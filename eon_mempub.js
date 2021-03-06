var pubnub = require('pubnub');
var express = require('express');
var colors = require('colors');
var SHA256 = require("crypto-js/sha256");

var mem = false;

// set defaults
var interval_timeout = 3000;

// init pubnub
var PUBNUB = require("pubnub");
var pubnub = PUBNUB.init({
  publish_key: 'pub-c-6dbe7bfd-6408-430a-add4-85cdfe856b47',
  subscribe_key: 'sub-c-2a73818c-d2d3-11e3-9244-02ee2ddab7fe'
});

var megabyte = 1024 * 1024;
var interval = false;

var publish_mem = function(process_id) {
  
  mem = process.memoryUsage();

  var date = new Date().getTime();

  var msg = {};
  msg['rss-' + process_id] = Math.ceil(mem.rss / megabyte);
  msg['heap-total-' + process_id] = Math.ceil(mem.heapTotal / megabyte);
  msg['heap-' + process_id] = Math.ceil(mem.heapUsed / megabyte);

  console.log(msg)

  // publish to pubnub
  pubnub.publish({
    channel: "process-memory-demo",
    message: {
      eon: msg, 
    },
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

var refreshInterval = Math.random() * 10000;
console.log('refresh interval is ' + refreshInterval);

setInterval(function(){

  var rand = Math.random();

  for(i = 0; i < 500; i++) {
		var crypto = SHA256(rand);  
	}

}, refreshInterval);

process.on('message', function(m){
	console.log('starting');	
	init({
    process_id: m	
	});
});
