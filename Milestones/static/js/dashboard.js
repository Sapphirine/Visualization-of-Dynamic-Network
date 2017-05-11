var topTenElement = document.getElementById("topTen");
var bottomTenElement = document.getElementById("bottomTen");
var wordPosElement = document.getElementById("wordPos");
var wordNegElement = document.getElementById("wordNeg");
var averageElement = document.getElementById("average");
var whichCountry;


var USChannel = 'channel1';
var averageChannel = 'channel2';
// var bottomTenChannel = 'channel2';

var pubnubEon = PUBNUB.init({
    subscribe_key: 'sub-c-066b68d0-f946-11e6-985e-02ee2ddab7fe', //different subscribe from Twitter
    publish_key: 'pub-c-c005ece7-3054-412a-beda-803151d520df' //separate keyset generated, paired with new subscribe key
  });

// function publishTop( b ){
//   // console.log(b);
//   console.log(b);
//   pubnubEon.publish(
//   {
//     channel: USChannel,
//     message: {
//       eon: b
//     }
//   } )
// }

function myJsFunction(){


    var text=document.getElementById('input').value;
    whichCountry = text;
    eon.chart({
  pubnub: pubnubEon,
  channel: USChannel,

  flow:true,
  generate: {
    bindto: '#splineChart',
    data:{
      colors:
      {
        'Sentiment': 'purple'
      }
    },
      size: {
  width: 580,
  height:200
},
legend: {
        show: false
    }
    }

 });
  }

// eon.chart({
//   pubnub: pubnubEon,
//   channel: USChannel,

//   flow:true,
//   generate: {
//     bindto: '#splineChart',
//     data:{
//       colors:
//       {
//         'Austin': 'red'
//       }
//     },
//       size: {
//   width: 600,
//   height:200
// },
// legend: {
//         show: false
//     }
//     }
    

  

    
// });

setInterval(function(){

  pubnubEon.publish({
    channel: USChannel,
    message: {
       eon: {
        'Sentiment': geoInfo[whichCountry].average
      }
    }
  });

}, 500);

// for gauge
setInterval(function(){
  var sum = 0;
  var times = 0;
  for( var item in record )
  {
    sum = sum + record[item] * afinn[item];
    times = times + record[item];
  }
  var averageScore = sum / times;
  averageElement.innerHTML = 
    "<font size=2 color=white>\
<p>" + "World Sentiment: " + averageScore + "</p>\
</font>";

  // console.log(averageScore)

  pubnubEon.publish({
    channel: averageChannel,
    message: {
       eon: {
        'World Sentiment': averageScore
      }
    }
  });

}, 500);

eon.chart({
  pubnub: pubnubEon,
  channel: averageChannel,
  generate: {
    bindto: '#gaugeChart',
    data: {
      type: 'gauge',
    },
     size: {
  width: 200,
  height:200
},

    gauge: {
      min: -1,
      max: 1
    },
    color: {
      pattern: ['#FF0000', '#F6C600', '#60B044'],
      threshold: {
        values: [-0.5, 0, 0.5]
      }
    }
  }
});



setInterval(function( ){
    var sortable = [];

    for (var eachCountry in geoInfo) {
  // console.log(geoInfo[eachCountry].average);
    sortable.push([eachCountry, geoInfo[eachCountry].average]);}
    sortable.sort(function(a, b) {
    return b[1] - a[1];
});
    var len = sortable.length;
//     var topTen = {};
//     for ( var i = 0; i < 10; i++) { 
//     topTen[ sortable[i][0] ] = sortable[i][1]; }
//     var bottomTen = {};
// for ( var i = sortable.length - 10; i < sortable.length; i++) { 
//     bottomTen[ sortable[i][0] ] = sortable[i][1];


  topTenElement.innerHTML = 
    "<font size=2 color=black>\
<p>" + sortable[0][0] + "</p>\
<p>" + sortable[1][0] + "</p>\
<p>" + sortable[2][0] + "</p>\
<p>" + sortable[3][0] + "</p>\
<p>" + sortable[4][0] + "</p>\
</font>";

	bottomTenElement.innerHTML = 
    "<font size=2 color=black>\
<p>" + sortable[len - 1][0] + "</p>\
<p>" + sortable[len - 2][0] + "</p>\
<p>" + sortable[len - 3][0] + "</p>\
<p>" + sortable[len - 4][0] + "</p>\
<p>" + sortable[len - 5][0] + "</p>\
</font>";

var wordPos = [];
var wordNeg = [];
  
    for (var item in afinn ) {
      if(afinn[item] > 0 )
    wordPos.push([item, record[item] ]);
    if(afinn[item] < 0)
      wordNeg.push([item, record[item]]);

}
   
    wordPos.sort(function(a, b) {
    return b[1] - a[1];
});
    wordNeg.sort(function(a, b) {
    return b[1] - a[1];
});
    
    
  wordPosElement.innerHTML = 
    "<font size=2 color=black>\
<p>" + wordPos[0][0] + "</p>\
<p>" + wordPos[1][0] + "</p>\
<p>" + wordPos[2][0] + "</p>\
<p>" + wordPos[3][0] + "</p>\
<p>" + wordPos[4][0] + "</p>\
</font>";

  wordNegElement.innerHTML = 
    "<font size=2 color=black>\
<p>" + wordNeg[0][0] + "</p>\
<p>" + wordNeg[1][0] + "</p>\
<p>" + wordNeg[2][0] + "</p>\
<p>" + wordNeg[3][0] + "</p>\
<p>" + wordNeg[4][0] + "</p>\
<p>" + wordNeg[5][0] + "</p>\
</font>";


}, 1000);

// // console.log(topTen);

// //[ [code, average], [  ... ] ]




// // // var a = { prop1: 9}
// // // console.log(a);
// // // a.Prop3 = a.Prop1;
// // // delete a.Prop1;
// // // console.log(a);





