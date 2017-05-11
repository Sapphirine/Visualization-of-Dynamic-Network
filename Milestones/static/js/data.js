// function handleMsg(msg) {
//   if (VISIBLE) {
//     addData(msg.pub, msg.subs);
//   }
// }

var channel = 'pubnub-twitter';

var pubnub = PUBNUB.init({
  subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe',
  ssl: true
});

// fetching previous 100 data, then realtime stream
function getData() {
  pubnub.history({
      channel: channel,
      count: 100,
      callback: function(messages) {
        pubnub.each( messages[0], addData );
        getStreamData();
      },
      error: function(error) {
        console.log(error);
        if(error) {
          getStreamData();
        }
      }
    });
}

function getStreamData() {
  pubnub.subscribe({
    channel: channel,
    callback: addData
  });
}

getStreamData();

// var pubnub = PUBNUB.init({
//   publish_key   : "demo",
//   subscribe_key : "e19f2bb0-623a-11df-98a1-fbd39d75aa3f",
//   ssl           : true
// });
// var timeStamps = [];
// pubnub.subscribe({
//   channel  : "rts-xNjiKP4Bg4jgElhhn9v9-geo-map",
//   callback : function(msg){
//     timeStamps = timeStamps.concat(msg.geo_map);
//   }
// });
// var k;
// var z = setInterval(function() {
//   //??
//   var x = exPubSub(timeStamps);
//   timeStamps = [];
//   var count = 0;
//   clearInterval(k);
//   k = setInterval(function() {
//     if (count >= 30) {
//       clearInterval(k);
//     }
//     if (typeof(x[count]) === "undefined") {
//       clearInterval(k);
//     }
//     else {
//       handleMsg(x[count]);
//       count++;
//     }
//   }, 100);
// }, 3000);
