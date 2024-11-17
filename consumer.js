const amqp = require('amqplib');
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected for Consumer'))
  .catch((err) => console.log(err));

async function consumeQueue() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('customerQueue', { durable: true });
    console.log('Waiting for messages in customerQueue...');

    channel.consume(
      'customerQueue',
      async (msg) => {
        if (msg !== null) {
          const customerData = JSON.parse(msg.content.toString());
          const customer = new Customer(customerData);
          try {
            await customer.save();
            console.log('Customer saved:', customer.email);
            channel.ack(msg);
          } catch (error) {
            console.error('Error saving customer:', error);
            channel.nack(msg);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error('Error in consumeQueue:', error);
  }
}

consumeQueue();
