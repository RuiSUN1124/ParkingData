var mqtt = require('mqtt');
var pData = require('./models/pData');
var bitwise = require('bitwise');
var MQTT_ADDR = "ws://106.14.14.169:8083/mqtt";
//var MQTT_PORT = 1883;
var client = mqtt.connect(MQTT_ADDR, { clientId: 'ruinodejs', connectTimeout: 1000, debug: true }, (err) => {
    if (err) {
        console.log('Client established error');
    } else {
        console.log('Client established');
    }
});

client.on('connect', () => {
    console.log('Client connection and subscribe \'test\'');
    client.subscribe('hi', { qos: 1 });
});

client.on('error', function (err) {
    console.log(err);
    client.end()
})

//Handle received data
client.on('message', function (topic, data) {
    //calc 12 or 14 bytes
    var array_l = bitwise.readByte(data[3]);
    console.log(array_l);
    if (array_l[2] == 0) {
        var header = data.slice(0, 12);
        payload = data.slice(12);
    } else if (array_l[2] == 1) {
        var header = data.slice(0, 14);
        var payload = data.slice(14);
    }

    //magicNum
    var magicNum = new String();
    for (var i = 0; i < 4; i++) {
        magicNum = magicNum + String.fromCharCode(header[i]);
    }

    //MsgType & Version
    var MV = bitwise.readByte(header[4]);
    var msgType = MV.slice(0, 4);
    msgType = msgType.join("");
    msgType = parseInt(msgType, 2);
    var version = MV.slice(4);
    version = version.join("");
    version = parseInt(version, 2);

    //console.log();
    //EncryptModel & LengthBytes & rsved
    var ELr = bitwise.readByte(header[5]);
    var encrypMode = ELr.slice(0, 2);
    encrypMode = encrypMode.join("")
    encrypMode = parseInt(encrypMode, 2);

    var lengthbytes = ELr[2];
    //lengthbytes = lengthbytes.join("")
    lengthbytes = parseInt(lengthbytes, 2);

    var rsved = ELr.slice(3);
    rsved = rsved.join("")
    rsved = parseInt(rsved, 2);

    //SessionId
    var sessionId = new String();
    sessionId = String.fromCharCode(header[6]);

    //PacketNum
    var packetNum = new String();
    packetNum = String.fromCharCode(header[7]);

    //MsgId
    var msgId = new String();
    msgId = String.fromCharCode(header[8]);

    //Checksum
    var checkSum = new String();
    checkSum = String.fromCharCode(header[9]);

    //Length
    var length = new String();
    if (array_l[2] == 0) {
        for (var i = 10; i <= 11; i++)
            length = length + String.fromCharCode(header[i]);
    } else if (array_l[2] == 1) {
        for (var i = 10; i <= 13; i++)
            length = length + String.fromCharCode(header[i]);
    }

    //pData0
    var pData0 = new String();
    pData0 = String.fromCharCode(header[-1]);

    //print
    console.log('MagicNum: ' + magicNum);
    console.log('MsgType: ' + msgType);
    console.log('Version: ' + version);
    console.log('EncryptMode: ' + encrypMode);
    console.log('LengthBytes: ' + lengthbytes);
    console.log('rsved: ' + rsved);
    console.log('SessionId: ' + sessionId);
    console.log('PacketNum: ' + packetNum);
    console.log('MsgId: ' + msgId);
    console.log('Checksum: ' + checkSum);
    console.log('Length: ' + length);
    console.log('pData[0]; ' + pData0);

    //verification check code
    var check_correct = 0;
    payload.forEach(function (element) {
        check_correct ^= element;
    }, this);

    //payload
    var jo_data = JSON.parse(payload.toString());
    //console.log(jo_data);
    var docu_data = new pData.ParkingModel(jo_data);
    if (checkSum == check_correct) {
        console.log('Check correct!');
        docu_data.save((err) => {
            if (err) {
                console.log('Save failed');
            } else {
                console.log('Save succeed');
            }
        });
    } else {
        console.log('Check incorrect!');
    }
});

