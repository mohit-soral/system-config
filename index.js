'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var sysinfo = require('systeminformation');
var fs = require('fs-extra');
var iptables = require('iptables');

var port = 9999;
var app = express();

app.use(bodyParser.json());

app.get('/containers', (request, response) => {
    console.log('In Method to get docker container info');

    sysinfo.dockerAll((data) => {
        console.log('Found details for ' + data.length + ' containers');
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].id + ' : ' + data[i].name + ' : ' + data[i].created + ' : ' + data[i].state + ' : ' + data[i].mem_percent + ' : ' + data[i].cpu_percent);
        }
    })

})

app.get('/proxy', function (req, res) {
    var result = {
        'http_proxy': process.env.http_proxy || '',
        'https_proxy': process.env.https_proxy || ''
    };
    console.log("result: " + JSON.stringify(result));
    res.send(result);
});


app.post('/proxy', function (req, res) {
    var proxyValues = req.body;
    console.log("proxyValues: " + JSON.stringify(proxyValues));

    var valueToWrite = '';
    if (proxyValues.http_proxy !== undefined || proxyValues.http_proxy !== '') {
        valueToWrite = valueToWrite + 'export http_proxy=' + proxyValues.http_proxy;
    }
    if (proxyValues.https_proxy !== undefined || proxyValues.https_proxy !== '') {
        valueToWrite = valueToWrite + '\nexport https_proxy=' + proxyValues.https_proxy;
    }

    const file = '/etc/profile.d/proxy.sh';
    fs.outputFileSync(file, valueToWrite)
    res.send();
});

app.delete('/proxy', function (req, res) {
    const file = '/etc/profile.d/proxy.sh';
    fs.removeSync(file)
    res.send();
});

const ipTablesRuleFormat = {
    in: 'eth0',
    target: 'ACCEPT',
    protocol: 'tcp',
    dport: 22,
    sport: 55,
    src: '10.0.10.0/24',
    dst: '0.0.0.0/0'
}

app.post('/allowRule', function (req, res) {
    var rule = req.body;
    rule.chain = 'FirewallRuleChain';
    if(rule.src === undefined){
        throw new Error('src not defined');
    }
    iptables.allow(rule);
    console.log(rule);
    res.send();
});

app.post('/rejectRule', function (req, res) {
    var rule = req.body;
    rule.chain = 'FirewallRuleChain';
    if(rule.src === undefined){
        throw new Error('src not defined');
    }
    iptables.reject(rule);
    console.log(rule);
    res.send();
});

app.post('/dropRule', function (req, res) {
    var rule = req.body;
    rule.chain = 'FirewallRuleChain';
    iptables.drop(rule);
    console.log(rule);
    res.send();
});

app.get('/getRules', function (req, res) {
    var rules = iptables.list('FirewallRuleChain', (rules) => {
        console.log(rules);
        res.send(rules);
    });
});

app.delete('/deleteRule', function (req, res) {
    var rule = req.body;
    rule.chain = 'FirewallRuleChain';
    iptables.deleteRule(rule);
    console.log(rule);
    res.send();
});

module.exports = app.listen(port, () => {
    console.log('Server has started. Listening on port ' + port);
})	
