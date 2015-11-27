var CommandLine = require('../');

var testConfig = {
    requestsBeforeStats: {
        command: ['f'],
        name: 'force output (0 = off)',
        description: 'number of requests before forcing the stats of the next request. Used when there is a threshold configured',
        value: 50
    },
    thresholds: {
        command: 't',
        name: 'threshold',
        description: 'sets a threshold to be reached before displaying a value',
        value: {
            est: { description: 'elasticsearch time on server', value: 0 },
            esc: { description: 'explorer elasticsearch processing time', value: 0 },
            dur: { description: 'explorer duration', value: 0 },
            rt:  { description: 'server response time', value: 0 },
            rc:  { description: 'concurrent requests on nodejs instance', value: 0 },
            art: { description: 'average response time', value: 0 },
            rs:  { description: 'requests per second', value: 0 },
            ct:  { description: 'call time from this module', value: 0 },
            node:{ description: 'node name to highlight', value: null },
            ell: { description: 'event loop latency', value: 0 }
        }
    },
    xrtHost: {
        command: ['x', 'xhost'],
        name: 'xrt host name. Host name to use when connecting to XRT. Can specify host and port',
        value: 'xrt.xpologistics.com:8080'
    },

    esHost: {
        command: ['e', 'ehost'],
        name: 'elasticsearch host name. Host name to use when connecting to elasticsearch. Can specify host and port',
        value: 'xrt.xpologistics.com:5000'
    },
    docType: {
        command: ['t'],
        name: 'document type',
        description: 'document type to use when searching an elasticsearch index',
        value: 'allLoadsSearch'
    },
    index: {
        command: 'i',
        name: 'elasticsearch index',
        description: 'elasticsearch index to use when querying',
        value: 'xrt_fo_explore'
    },
    samples: {
        command: 's',
        name: 'elasticsearch document size to sample from',
        description: 'number of docs to bring back from elasticsearch to generate random filters from',
        value: 1000
    },
    minWait: {
        command: 'minwait',
        name: 'minimum delay in ms before sending another request',
        description: 'minimum delay before sending another request',
        value: 200
    },
    maxWait: {
        command: 'maxwait',
        name: 'maximum delay in ms before sending another request',
        description: 'maximum delay before sending another request',
        value: 1000
    },
    users: {
        command: 'u',
        name: 'number of "users" to simulate. Runs multiple requests on different sockets',
        value: 1
    },
    loop: {
        command: 'l',
        name: 'stop after looping this many times. Applies to each user (0 = infinite)',
        value: 0
    }
};

var testConfig2 = JSON.parse(JSON.stringify(testConfig));
var pass = new CommandLine(testConfig).parseCommandLine();
var pass2 = new CommandLine(testConfig2).parseCommandLine();
if (!pass && !pass2) return;

console.log(JSON.stringify(testConfig, null, '\t'));