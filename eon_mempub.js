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
});

var megabyte = 1024 * 1024;
var interval = false;

var publish_mem = function(process_id) {
  
  mem = process.memoryUsage();

 console.log('publishing ' + process_id);

  // publish to pubnub
  pubnub.publish({
    channel: process_id,
    message: {
      columns: [
				['rss-' + process_id, Math.ceil(mem.rss / megabyte * 100) / 100],
				['heap-total-' + process_id, Math.ceil(mem.heapTotal / megabyte * 100) / 100],
				['heap-' + process_id, Math.ceil(mem.heapUsed / megabyte * 100) / 100],
				['x', new Date().getTime() / 1000]
			], 
    },
		callback: function(a){
	console.log(a);	
		}
  });

};

var start = function(process_id) {
  interval = setInterval(function(){
    publish_mem(process_id);
  }, interval_timeout);
};

var stop = function() {
  clearInterval(interval);
};

var init = function(options) {

  if(typeof options !== "undefined") {
  
    publish_key = options.publish_key || publish_key;
    process_id = options.process_id || process_id;
    interval_timeout = options.timeout || interval_timeout;

  }

  start(process_id);

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
	init({
    process_id: m	
	});
});
