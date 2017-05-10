/**
 * TweetBeacon extends THREE.Object3D
 * A Three.js object that constructs and animates itself
 */
TweetBeacon = function(tweet) {
  
  this.tweet = tweet;
//   console.log(this.tweet);
  // Call the constructor
  THREE.Object3D.call(this);

  // An empty container oriented to make it easier to work with child objects
  this.container = new THREE.Object3D();
  this.container.rotation.y = THREE.Math.degToRad(180);
  this.add(this.container);

  // Set base color depending on sentiment score
  this.color = 0xFFFFFF;

  var material = new THREE.MeshBasicMaterial({
    color: this.color,
    transparent: true,
    opacity: 1.0
  });

  var radius = 20;
  var segments = 16 ;

  var circleGeometry = new THREE.CircleGeometry(radius, segments);        
  var circle = new THREE.Mesh(circleGeometry, material);
  // console.log( this.getScore( tweet));
  if( this.getScore( tweet ) > 3 )
  {
    //purple red
    this.color = 0xFFFF00;
    mood = 4;
  }
  else if ( this.getScore( tweet ) <=3 && this.getScore( tweet ) > 2  )
  {
    //red
    this.color = 0xFF9900;
    mood = 2.5;
  }
 else if ( this.getScore( tweet ) <=2 &&  this.getScore( tweet ) > 1 )
  {
    //orange
    this.color = 0xFF0000 ;
    mood = 1.5;
  }
   else if ( this.getScore( tweet ) <= 1 &&  this.getScore( tweet ) > 0 )
  {
    //yellow
    this.color = 0xFF3399;
    mood = 0.5;
  }
    else if ( this.getScore( tweet ) < -3 )
  {
    //purple
    this.color = 0x0000FF;
    mood = -4;
  }
     else if ( this.getScore( tweet ) <-2 && this.getScore( tweet ) >= -3 )
  {
    //dark blue
    this.color = 0x006600;
    mood = -2.5;
  }
    else if (this.getScore( tweet ) <-1 && this.getScore( tweet ) >= -2)
  {
    //light blue
    this.color = 0x999966;
    mood = -1.5;
  }
    else if ( this.getScore( tweet ) < 0 && this.getScore( tweet ) >= -1 )
  {
    //green
    this.color = 0x660000;
    mood = -0.5;
  }
  // if (tweet.sentiment.score < 0) {
  //   this.color = 0xFF0000;
  // }
  // else if (tweet.sentiment.score > 0) {
  //   this.color = 0xDDDD00;
  // }

  this.addBeam();

  // this.addShockwave();
};

TweetBeacon.prototype = new THREE.Object3D();
TweetBeacon.prototype.constructor = TweetBeacon;
TweetBeacon.prototype.supr = THREE.Object3D.prototype;

/**
 * The line that shoots out from the surface of the Earth
 */
TweetBeacon.prototype.addBeam = function () {

  var material = new THREE.MeshBasicMaterial({
    color: this.color,
    transparent: true,
    opacity: 1.0
  });

  var radius = 20;
  var segments = 16 ;
  
//   var circleGeometry = new THREE.CircleGeometry(radius, segments);        
//   var circleGeometry = new THREE.ConeGeometry( 5, 20, 32 );
var circleGeometry = new THREE.OctahedronGeometry(radius);
  var circle = new THREE.Mesh(circleGeometry, material);
  
//   var textGeo = new THREE.TextGeometry( "T", {
// 					size:30});
//   var textBeacon = new THREE.Mesh( textGeo, material);
  this.container.add( circle);
  // var lineGeo = new THREE.Geometry();

  // lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
  // lineGeo.vertices.push(new THREE.Vector3(0, 0, 1));

  // var lineMat = new THREE.LineBasicMaterial({
  //   color: this.color,
  //   linewidth: 2,
  //   opacity: 0.0,
  //   transparent: true
  // });

  // this.lineMesh = new THREE.Line(lineGeo, lineMat);
  // this.container.add(this.lineMesh);
  
  // this.show();
}

/**
 * The shockwave at the base of the beacon line
 */

//getScore:
TweetBeacon.prototype.getScore = function( tweet )
{
  sentiment = new Sentimood();
  var content = tweet.text.toLowerCase() ;
  var positive = sentiment.positivity( content ).comparative;
  var negative = sentiment.negativity( content ).comparative;
  if (isNaN(positive)){positive = 0;}
  if(isNaN(negative)){negative = 0;}
  // else{console.log(content);
  //   console.log(positive);}
  return positive - negative;
//   if (!this.tweet || !this.tweet.place || !this.tweet.lang) return;
//   if (!this.tweet.text) return;
//   if (this.tweet === "undefined") return;
  
//   console.log( this.tweet.text );

}

// TweetBeacon.prototype.addShockwave = function () {

//   var self = this;

//   var material = new THREE.MeshBasicMaterial({
//     color: this.color,
//     transparent: true,
//     opacity: 1.0
//   });

//   var radius = 20;
//   var segments = 16 ;

//   var circleGeometry = new THREE.CircleGeometry(radius, segments);        
//   var circle = new THREE.Mesh(circleGeometry, material);
//   circle.position.z = 5;
//   circle.scale.x = circle.scale.y = circle.scale.x = 0.1;
//   this.container.add(circle);
  
//   var time = 2;

//   // Animates opacity of shockwave
//   TweenLite.to(circle.material, time, {
//     opacity: 0,
//     ease: Quad.easeOut
//   });

//   // Animates scale/size of shockwave
//   TweenLite.to(circle.scale, time, {
//     x: 1.0, y: 1.0, z: 1.0,
//     ease: Quart.easeOut,
//     onComplete: function () {
//       // remove when animation completes to keep number of object in scene to a minimum
//       self.container.remove(circle);
//     }
//   });
// }

// /**
//  * Animation of line emerging from beacon base
//  */
// TweetBeacon.prototype.show = function () {

//   var self = this;
//   var time = 4;

//   // Define the line height based on the sentiment score
//   this.beamHeight = 400 + Math.abs(this.tweet.sentiment.score) * 100
  
//   // Animate opacity
//   TweenLite.to(this.lineMesh.material, time, {
//     opacity: 0.75,
//     ease: Quart.easeOut
//   });

//   // Animate line length
//   TweenLite.to(this.lineMesh.geometry.vertices[1], time, {
//     z: this.beamHeight,
//     ease: Quart.easeOut,
//     onUpdate: function () {
//       // this is required for Three.js to re-render the line
//       self.lineMesh.geometry.verticesNeedUpdate = true;
//     }
//   });
  
//   // Set the life span of the beacon before it shoots into space 
//   setTimeout(function () {
//     self.hide()
//   }, time * 1000);
// };

// /**
//  *  Animation of beacon shooting into space
//  */
// TweetBeacon.prototype.hide = function () {

//   var self = this;
//   var time = 10;

//   // Animate opacity
//   TweenLite.to(this.lineMesh.material, time, {
//     opacity: 0.0,
//     ease: Quart.easeOut,
//     onComplete: function () {
//       // when animation completes callback to notify
//       if (self.onHideCallback) {
//         self.onHideCallback();
//       }
//     }
//   });
  
  // Animate length of line
//   TweenLite.to(this.lineMesh.geometry.vertices[0], time / 2, {
//     z: this.beamHeight,
//     ease: Quart.easeOut,
//     onUpdate: function () {
//       // this is required for Three.js to re-render the line
//       self.lineMesh.geometry.verticesNeedUpdate = true;
//     }
//   });
  
//   // Animate distance of line from beacon base / surface of earth
//   TweenLite.to(this.lineMesh.position, time, {
//     z: this.beamHeight + 300,
//     ease: Quart.easeOut
//   });

// }

// /**
//  * Sets a callback for aniamtion complete and beacon has expired
//  */
// TweetBeacon.prototype.onHide = function (callback) {
//   this.onHideCallback = callback;
// }

