# Graph the memory usage of distributed systems in realtime

![](http://i.imgur.com/2QuiXfp.gif)

Even harder than scaling multiple NodeJS processes is monitoring what's going on right now. Are the processes using too much memory? Are they down entirely? What processes are they doing right now, and how often?

With PubNub's Project EON, we can use the power of PubNub's realtime data stream network to graph information from multiple NodeJS (or any other backend server) to a realtime dashboard we can create and customize ourselves. Project EON is charting framework for realtime data that allows you to graph the values of realtime data streams in your own dashboard.

This repository includes the full code examples for spawning a few NodeJS processes, publishing their memory usage (using `process.memoryUsage`) to the PubNub data stream network. Each process spawned artificially increases it's memory usage by encrypting random strings with the node `crypto` library.

## Spawning Child Processes

In this demo we'll be using `child_process` to `fork` our "node" process that will artificially increase it's own memory and publish it over the network. The spawn process spawns 5 of these memory intensive processes, each with it's own id. You can see the master `spawn` process give each child process it's own id within `cp.send()`.

This pattern is the basis for a clustered web server architecture pattern you may use for scaling NodeJS processes. In practice, you would probably use the "cluster" NPM package rather than `child_process`.

```js
var childProcess = require('child_process');

var i = 0;
while(i < 5) {

	var cp = childProcess.fork('eon_mempub')
	cp.send('process-memory-' + i);

	i++;

}
```

## The spawned process

As mentioned earlier, the `spawn.js` process spawns 5 sub-processes that publish their memory usage to PubNub EON Realtime Graphing Framework. To simulate varying load in a distributed system, we'll perform an intensive task at a regular interval. 

Each process will randomly choose an interval to encrypt `500` random numbers using SHA256. Because each process chooses a random interval, they will have varying memory usages.

```js
var refreshInterval = Math.random() * 10000;
console.log('refresh interval is ' + refreshInterval);

setInterval(function(){

  var rand = Math.random();

  while(i = 0; i < 500; i++) {
		var crypto = SHA256(rand);  
	}

}, refreshInterval);
```

## Publishing the memory usage to EON Charts

Now that we have processes with varying memory usages, we publish them over PubNub data stream network so they can be consumed by the EON framework.

We can get the process memory usage using `process.memoryUsage()`. This function returns an object with the rss, heapTotal, and heapUsed values which represents the individual process memory usage.

We divide these values by a megabyte so that they're easier to consume on the chart side.

Also notice that, even though each process will have it's own process_id, they're all publishing to the same `process-memory-demo` channel. This is the magic of EON. The charting system will compile the messages published on the front end, combining all the information from each process into a single chart.

```js
var publish_mem = function(process_id) {
  
  mem = process.memoryUsage();

  pubnub.publish({
    channel: "process-memory-demo",
    message: {
      columns: [
				['rss-' + process_id, Math.ceil(mem.rss / megabyte)],
				['heap-total-' + process_id, Math.ceil(mem.heapTotal / megabyte)],
				['heap-' + process_id, Math.ceil(mem.heapUsed / megabyte)],
				['x', new Date().getTime() / 1000]
			], 
    },
  });
};
```

## Creating the Chart

In order to graph our process memory usage, we'll need an HTML page to embed the EON charting framework on. First, include the EON libraries within the page.

```html
<script type="text/javascript" src="http://pubnub.github.io/eon/lib/eon.js"></script>
<link type="text/css" rel="stylesheet" href="http://pubnub.github.io/eon/lib/eon.css" />
```

Next, a `div` is defined for your chart and the EON chart is configured through javascript. Notice how we use the same channel as within our spawned publishing process.

```html
<div id="chart" />
<script type="text/javascript">
eon.chart({
	history: true,
	channel: 'process-memory-demo',
	flow: true,
	generate: {
		bindto: '#chart',
		data: {
			x: 'x',
			labels: false
		},
		axis : {
			x : {
				type : 'timeseries',
				tick: {
					format: '%H:%M:%S'
				}
			}
		}
	}
});	
</script>
```

You can learn more about customizing your graph on the [EON project page](http://www.pubnub.com/developers/eon/). Load this example in your browser and run the included `spawn.js` to see each of the 5 spawned processes log their memory to the graph.

## How it works

Each of the spawned processes publishes their memory usage to the same PubNub channel. Each memory value (rss, heapSize, heapTotal)

You can learn more about customizing your graph on the [EON project page](http://www.pubnub.com/developers/eon/). Load this example in your browser and run the included `spawn.js` to see each of the 5 spawned processes log their memory to the graph.

![](http://i.imgur.com/2QuiXfp.gif)

## Full demo

You can find this full demo, including `spawn.js`, `eon_mempub,js`, and the `index.html` examples [here](https://github.com/pubnub/eon-distributed). Just run `node spawn.js` and then load up `index.html`.
