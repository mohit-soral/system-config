'use strict';

var fs = require('fs-extra');

//CONSTANTS DEFINATION
const file = '/etc/profile.d/proxy.sh';

module.exports = {
	getProxy: readSystemProxy,
	setProxy: setSystemProxy,
    deleteProxy: deleteSystemProxy
}

function readSystemProxy (req, res) {
    var result = {
        'httpProxy': process.env.http_proxy || '',
        'httpsProxy': process.env.https_proxy || ''
    };
    res.send(result);
}

function setSystemProxy (req, res) {
    var proxyValues = req.body;

    var valueToWrite = '';
    if (proxyValues.httpProxy !== undefined || proxyValues.httpProxy !== '') {
        valueToWrite = valueToWrite + 'export http_proxy=' + proxyValues.httpProxy;
    }
    if (proxyValues.httpsProxy !== undefined || proxyValues.httpsProxy !== '') {
        valueToWrite = valueToWrite + '\nexport https_proxy=' + proxyValues.httpsProxy;
    }

    fs.outputFileSync(file, valueToWrite)
    res.json({statusMessage: 'OK'});
}

function deleteSystemProxy (req, res) {
    fs.removeSync(file)
    res.json({statusMessage: 'OK'});
}