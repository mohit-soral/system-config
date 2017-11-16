'use strict';

var fs = require('fs-extra');

//CONSTANTS DEFINATION
const file = '/etc/profile.d/proxy.sh';

module.exports = {
	getProxy: readSystemProxy,
	setProxy: setSystemProxy
}

function readSystemProxy (req, res) {
    var result = {
        'httpProxy': process.env.http_proxy || '',
        'httpsProxy': process.env.https_proxy || ''
    };
    // console.log("result: " + JSON.stringify(result));
    res.send(result);
}

function setSystemProxy (req, res) {
    var proxyValues = req.body;
    // console.log("proxyValues: " + JSON.stringify(proxyValues));

    var valueToWrite = '';
    if (proxyValues.httpProxy !== undefined || proxyValues.httpProxy !== '') {
        valueToWrite = valueToWrite + 'export http_proxy=' + proxyValues.httpProxy;
    }
    if (proxyValues.httpsProxy !== undefined || proxyValues.httpsProxy !== '') {
        valueToWrite = valueToWrite + '\nexport https_proxy=' + proxyValues.httpsProxy;
    }

    fs.outputFileSync(file, valueToWrite)
    res.send();
}