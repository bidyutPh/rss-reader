const http = require('http');
const FeedParser = require('feedparser');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//import {renderTotString} from 'react-dom/server';
//import expState from 'express-state';
//expState.extend(app);

//const url = "http://www.guardian.co.uk/world/usa/rss";

//const url = "https://www.yahoo.com/news/rss/mostviewed";
//const url = "https://www.yahoo.com/news/rss";
const urlList = [];
urlList.push({label:'Guardian', url:"http://www.guardian.co.uk/world/usa/rss"});
urlList.push({label:'Yahoo', url:"https://www.yahoo.com/news/rss"});
urlList.push({label:'The West', url:"https://thewest.com.au/rss"});
urlList.push({label:'BBC', url:"http://feeds.bbci.co.uk/news/business/rss.xml"});
urlList.push({label:'NDTV', url:"http://feeds.feedburner.com/ndtvnews-top-stories"});
urlList.push({label:'Reuters', url:"http://feeds.reuters.com/reuters/INtopNews"});
urlList.push({label:'Google News', url:"https://news.google.com/news/rss/?ned=us&gl=GB&hl=en",
categories:[{label:'US', url:'https://news.google.com/news/rss/?ned=us&gl=GB&hl=en'},
{label:'India',url:'https://news.google.com/news/rss/?ned=in&gl=IN&hl=en-IN'}]});
urlList.push({label:'Times Of India', url:"https://timesofindia.indiatimes.com/rssfeeds/1221656.cms",
categories:[{label:'India', url:'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms'},
{label:'World',url:'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms'},
{label:'Entertainment',url:'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms'},
{label:'Sports',url:'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms'}]});

// categories:[
//   {label:'All', url:'https://news.google.com/news/rss/?ned=us&gl=GB&hl=en'},
//   {label:'Entertainment',url:''},
//   {label:'Sports',url:''},
//   {label:'Science',url:''},
//   {label:'Business',url:''}]});


const categories = ['All','Entertainment','Sports','Science','Business'];


app.use(express.static(__dirname + './../../'));

app.listen(process.env.PORT || 8080, function(){
	console.log('Started server on port 8080');
});

app.post('/feeds', function(req, res){
	getFeeds(req.body.url)
  .then(function(feedList) {
    res.status(200).send({data: feedList})
  })
	//var feedList = ['john','matt','sam','patrick'];
	//const appString = renderTotString(<App feedList={feedList}/>);

	//res.send();
  //res.status(200).send({data: feedList})
});

app.get('/sources', function(req, res){
  res.status(200).send({data:urlList});
});

app.post('/getSource', function(req, res){
  //res.status(200).send({data:urlList});
  //console.log(req.body);
  getFeeds(req.body.url)
  .then(function(feedList) {
    res.status(200).send({data: feedList})
  })
});

app.post('/getCategories', function(req, res){
  //getFeeds(req.body.url)
  //.then(function(feedList) {
  var returnValue = '';
  urlList.forEach(function(url) {
    if(url.url == req.body.url){
      returnValue = url.categories;
    }
  })

  returnValue = returnValue ? returnValue : [];

  res.status(200).send({categories:returnValue});
  //})
});

function getCategories(key) {
  var returnValue = '';
  urlList.forEach(function(url) {
    if(url.url == key){
      returnValue = url.categories;
    }
  })

  return returnValue;
}

function getFeeds(url) {
	var req = request(url);
	var feedItems = [];
	var feedparser = new FeedParser();

  return new Promise(function(resolve, reject){
    req.on('response', function(response){
      //console.log(response);
      this.pipe(feedparser);
    });

    feedparser.on('readable', function(){
      var item = this.read ();
      if (item !== null) {
        feedItems.push (item);
        }
      }
    );

    feedparser.on ("end", function () {
      //callback (undefined, feedItems);
      //console.log(feedItems);
      resolve(feedItems);
    });

    feedparser.on ("error", function (err) {
      console.log ("getFeed: err.message == " + err.message);
      callback (err);
    });
  });

}
