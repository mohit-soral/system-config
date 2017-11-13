'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var sysinfo = require('systeminformation');
var fs = require('fs-extra');
var tesserariusLib = require("tesserarius");
var tesserarius = new tesserariusLib();

var port = 9999;
var app = express();


app.use(bodyParser.json());

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.get("/containers", (request, response) => {
	console.log('In Method to get docker container info');

	sysinfo.dockerAll((data) => {
		console.log('Found details for ' + data.length + ' containers');
		for(var i = 0 ; i < data.length ; i++) {
			console.log(data[i].id + ' : ' + data[i].name + ' : ' + data[i].created + ' : ' + data[i].state + ' : ' + data[i].mem_percent + ' : ' + data[i].cpu_percent);
		}
	})

})

app.get('/proxy', function(req, res){
    var result  = {
        'http_proxy' : process.env.http_proxy || '',
        'https_proxy' : process.env.https_proxy || ''
    };
    console.log("result: " + JSON.stringify(result));
    res.send(result);
});

app.post('/proxy', function(req, res){
    var proxyValues  = req.body;
    console.log("proxyValues: " + JSON.stringify(proxyValues));

    var valueToWrite = '';
    if(proxyValues.http_proxy !== undefined || proxyValues.http_proxy !== ''){
        valueToWrite = valueToWrite + 'export http_proxy=' + proxyValues.http_proxy;
    }
    if(proxyValues.https_proxy !== undefined || proxyValues.https_proxy !== ''){
        valueToWrite = valueToWrite + '\nexport https_proxy=' + proxyValues.https_proxy;
    }
    
    const file = '/etc/profile.d/proxy.sh';
    fs.outputFileSync(file, valueToWrite)
    res.send();
});


const rule = {
    interface: 'eth0',
    policy: 'ACCEPT',
    protocol: 'tcp',
    destination_port: 22,
    source: '10.0.10.0/24'
}

app.post('/createRule', function(req, res){
	var ruleToCreate  = req.body;
	tesserarius.add_rule('FirewallRuleChain', rule, (err) => {
    if(err) {
        throw err;
    }
	});
});

app.delete('/deleteRule', function(req, res){
	var ruleToCreate  = req.body;
	tesserarius.delete_rule('FirewallRuleChain', rule, (err) => {
    if(err) {
        throw err;
    }
	});
});

tesserarius.create_chain('FirewallRuleChain', (err) => {
    if(err) {
        throw err;
    }
});

tesserarius.set_policy('FirewallRuleChain', 'DROP', (err) => {
    if(err) {
        throw err;
    }
});



module.exports = app.listen(port, () => {
	console.log('Server has started. Listening on port ' + port);
})	