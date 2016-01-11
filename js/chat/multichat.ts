/// <reference path="../../typings/tsd.d.ts" />
class Multichat {
	constructor() {
        var peer = new Peer({
			// API キー
			key: 'a604aaf1-82ca-49ac-974f-ab934e66fc1c',
			secure: true,
			host: 'skyway.io',
			port: 443,
			debug: 3
	    });
	}
}
var multichat = new Multichat();