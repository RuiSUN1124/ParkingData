var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ParkingData', { server: { auto_reconnect: true } });

const db = mongoose.connection;
db.once('open', () => {
    console.log('Connection using Mongoose succeed!');
});
db.on('error', (error) => {
    console.error('Error on Mongo connection' + error);
    mongoose.disconnect();
})
db.on('close', () => {
    console.log('Closed,reconnecting...');
    mongoose.connect('mongodb://localhost:27017/ParkingData', { server: { auto_reconnect: true } });
});

exports.mongoose = mongoose;