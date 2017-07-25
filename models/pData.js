var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var ParkingSchema = new Schema({
    SN : String,
    Name : String,
    TMoteStatus : [{
       SubSN : String,
       Batt : Number,
       Status : Number 
    },{
        SubSN : String,
        Batt : Number,
        Status : Number
    }]
});

//ParkingSchema.index("SN");
var ParkingModel = mongodb.mongoose.model('parking', ParkingSchema);

exports.ParkingModel = ParkingModel;