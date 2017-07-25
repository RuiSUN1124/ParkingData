var mqtt = require('mqtt');
var MQTT_ADDR = "ws://106.14.14.169:8083/mqtt";
//var MQTT_PORT = 1883;
var client = mqtt.connect(MQTT_ADDR, { clientId: 'testnodejs', connectTimeout: 1000, debug: true }, (err) => {
    if (err) {
        console.log('Client established error');
    } else {
        console.log('Client established');
    }
});
var header = "01234567890123";
var pData = {
"SN":"aabbccddeeff",
"Name": "TMote.Status",
"TMoteStatus": [{
"SubSN": "1122334455",
"Batt": 360,
"Status": 1,
},
{
"SubSN": "1122334466",
"Batt": 360,
"Status":  1,
}
]
}

client.on('connect', () => {
    console.log('Client connection and subscribe \'test\'');
    var temps_str = JSON.stringify(pData);
    client.publish("hi", header + temps_str);
});

client.on('error', function (err) {
    console.log(err);
    client.end()
})



