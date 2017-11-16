'use strict'

var iptables = require('iptables');

const ruleChain = 'FirewallRuleChain';

const ipTablesRuleFormat = {
    in: 'eth0',
    target: 'ACCEPT',
    protocol: 'tcp',
    dport: 22,
    sport: 55,
    src: '10.0.10.0/24',
    dst: '0.0.0.0/0'
}

module.exports = {
	allowRule: allowIpTableRule,
	rejectRule: rejectIpTableRule,
	dropRule: dropIpTableRule,
	getAllRules: getAllIpTableRules,
	deleteRule: deleteIpTableRule
}

//allowRule
function allowIpTableRule (req, res) {
    var rule = req.body;
    rule.chain = ruleChain;
    if(rule.src === undefined){
    	//TODO: return a proper HTTP ERROR CODE and a message may be
        throw new Error('src not defined');
    }
    iptables.allow(rule);
    // console.log(rule);
    res.send();
}

//rejectRule
function rejectIpTableRule (req, res) {
    var rule = req.body;
    rule.chain = ruleChain;
    if(rule.src === undefined){
    	//TODO: return a proper HTTP ERROR CODE and a message may be
        throw new Error('src not defined');
    }
    iptables.reject(rule);
    // console.log(rule);
    res.send();
}

//dropRule
function dropIpTableRule (req, res) {
    var rule = req.body;
    rule.chain = ruleChain;
    iptables.drop(rule);
    // console.log(rule);
    res.send();
}

//getRules
function getAllIpTableRules (req, res) {
    var rules = iptables.list(ruleChain, (rules) => {
        // console.log(rules);
        res.send(rules);
    });
}

//deleteRule
function deleteIpTableRule (req, res) {
    var rule = req.body;
    rule.chain = ruleChain;
    iptables.deleteRule(rule);
    // console.log(rule);
    res.send();
}