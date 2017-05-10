sentiment = new Sentimood();
  var content = "我今天很高兴";
  var positive = sentiment.positivity( content ).comparative;
  var negative = sentiment.negativity( content ).comparative;
 console.log(positive);
