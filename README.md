# Graph the memory usage of distributed systems in realtime

Even harder than scaling multiple NodeJS processes is monitoring what's going on right now. Are the processes using too much memory? Are they down entirely? What processes are they doing right now, and how often?

With PubNub's Project EON, we can use the power of PubNub's realtime data stream network to graph information from multiple NodeJS (or any other backend server) to a realtime dashboard we can create and customize ourselves. Project EON is charting framework for realtime data that allows you to graph the values of realtime data streams in your own dashboard.

This repository includes the full code examples for spawning a few NodeJS processes, publishing their memory usage (using ```process.memoryUsage```
sdfasdf asdf
asdfasdfasdf
asdfasdf

```js
var childProcess = require('child_process');

var i = 0;
while(i < 5) {

	var cp = childProcess.fork('eon_mempub')
	cp.send('process-memory-' + i);

	i++;

}
```
First we'll write some code to increase memory usage.
```js
// increase memory usage

var refreshInterval = Math.random() * 10000;
console.log('refresh interval is ' + refreshInterval);

setInterval(function(){

  var rand = Math.random();

  while(i = 0; i < 500; i++) {
		var crypto = SHA256(rand);  
	}

}, refreshInterval);

process.on('message', function(m){
	console.log('starting');	
	init({
    process_id: m	
	});
});
```

```
var publish_mem = function(process_id) {
  
  mem = process.memoryUsage();

  // publish to pubnub
  pubnub.publish({
    channel: "process-memory-demo",
    message: {
      columns: [
				['rss-' + process_id, Math.ceil(mem.rss / megabyte * 100) / 100],
				['heap-total-' + process_id, Math.ceil(mem.heapTotal / megabyte * 100) / 100],
				['heap-' + process_id, Math.ceil(mem.heapUsed / megabyte * 100) / 100],
				['x', new Date().getTime() / 1000]
			], 
    },
  });

};

var start = function(process_id) {
  interval = setInterval(function(){
    publish_mem(process_id);
  }, interval_timeout);
};
```
