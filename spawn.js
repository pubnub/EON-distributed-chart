var childProcess = require('child_process');

var i = 0;
while(i < 5) {

	var cp = childProcess.fork('eon_mempub')
	cp.send('process-memory-' + i);

	i++;

}

