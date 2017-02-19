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
  publish_key: 'pub-c-80d4bf2c-0da2-43eb-ad81-579b81d3c8f4',
  subscribe_key: 'sub-c-5765cab0-f6c5-11e6-80ea-0619f8945a4f'
});

var megabyte = 1024 * 1024;
var interval = false;

var publish_mem = function(process_id) {

  mem = process.memoryUsage();

  var date = new Date().getTime();

  var msg = {};
  msg['211'] = Math.ceil(mem.rss / megabyte);
  msg['212'] = Math.ceil(mem.heapTotal / megabyte);
  msg['213'] = Math.ceil(mem.heapUsed / megabyte);
  msg['214'] = Math.floor((Math.random() * 20) + 1) + Math.ceil(mem.rss / megabyte);
  msg['215'] = Math.floor((Math.random() * 20) + 1) + Math.ceil(mem.heapTotal / megabyte);
  msg['216'] = Math.floor((Math.random() * 20) + 1) + Math.ceil(mem.heapUsed / megabyte);

  console.log(msg)

  // publish to pubnub
  pubnub.publish({
    channel: "Demo",
    message: {
      eon: msg,
    },
  },function (status, response) {
        if (status.error) {
            console.log(status)
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
