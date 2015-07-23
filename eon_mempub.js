var pubnub = require('pubnub');
var express = require('express');
var uuid = require('node-uuid');
var colors = require('colors');

var mem = false;

// set defaults
var publish_key = "demo";
var interval_timeout = 1000;

// init pubnub
var pubnub = require("pubnub")({
  publish_key: publish_key
});

var megabyte = 1024 * 1024;
var interval = false;

var publish_mem = function() {
  
  mem = process.memoryUsage();

  // publish to pubnub
  pubnub.publish({
    channel: channel,
    message: {
      y: [
        Math.ceil(mem.rss / megabyte * 100) / 100, 
        Math.ceil(mem.heapTotal / megabyte * 100) / 100,
        Math.ceil(mem.heapUsed / megabyte * 100) / 100
      ],
      x: new Date().getTime() / 1000
    }
  });

};

var start = function(channel) {
  interval = setInterval(function(){
    publish_mem(channel);
  }, interval_timeout);
};

var stop = function() {
  clearInterval(interval);
};

var init = function(options) {

  if(typeof options !== "undefined") {
  
    publish_key = options.publish_key || publish_key;
    channel = options.channel || channel;
    interval_timeout = options.timeout || interval_timeout;

  }

  start(channel);

};

module.exports = {
  start: start,
  stop: stop,
  init: init
};

// increase memory usage
var SHA256 = require("crypto-js/sha256");
var uuid = require('node-uuid');

var refreshInterval = Math.random() * 10000;
console.log('refresh interval is ' + refreshInterval);

setInterval(function(){

  var rand = Math.random();
  var crypto = SHA256(rand);  

}, refreshInterval);

process.on('message', function(m){
	console.log('starting');	
	console.log(m);
	init({
    channel: m	
	});
});
