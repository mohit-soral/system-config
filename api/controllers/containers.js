'use strict';

var sysinfo = require('systeminformation');

module.exports = {
	containerInfo: getDockerContainerDetails
}

function getDockerContainerDetails(request, response) {
	var containersInfo = [];
	sysinfo.dockerAll((data) => {
        console.log('Found details for ' + data.length + ' containers');
        for (var i = 0; i < data.length; i++) {
        	containersInfo.push({
                'id': data[i].id,
                'name': data[i].name,
                'createdOn': data[i].created,
                'state': data[i].state,
                'memPerct': data[i].mem_percent,
                'cpuPerct': data[i].cpu_percent
            })
            // console.log(data[i].id + ' : ' + data[i].name + ' : ' + data[i].created + ' : ' + data[i].state + ' : ' + data[i].mem_percent + ' : ' + data[i].cpu_percent);
        }
    })
}