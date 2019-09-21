processes = require('../../utils/process.json');

// FIFO
function sortByArrival(arr){
    clock = 0;
    arr.sort((a, b) =>{
        return a.arrival - b.arrival
    })
}

// PRIORITY
function sortByPriority(arr) {
    clock = 0;
    arr.sort((a, b) =>{
        return a.priority - b.priority
    })
}
// TIME FUNCTIONS (IGNORING QUANTUM)
let clock = 0;
function timed() {
    let ready = [];
    document.getElementById('running').value = processes[clock].pid;
    ready.push(processes[clock].pid)
    setTimeout(() =>{
        // console.log(processes[clock].pid);
        document.getElementById('running').value = processes[clock].pid;
        // console.log(processes[clock].pid);
        document.getElementById('ready').value += processes[clock].pid + " ";
        clock++;
        if (clock < processes.length) timed();
    }, processes[clock].time * 1000);

    if (clock-1 === (processes.length )){
        document.getElementById('running').value = 'No hay mas procesos';
    }

}


function run() {
    document.getElementById('running').value = '';
    document.getElementById('ready').value = '';
    let algo = document.getElementById("algorithm");
    let selection = algo.options[algo.selectedIndex].value;
    if (selection === "1"){
        console.log("FIFO");
        sortByArrival(processes);
        timed();
    } else if (selection === "2"){
        console.log("PRIORITY");
        sortByPriority(processes);
        timed();
    } else if (selection === "3"){
        console.log("ROUND ROBIN")
    }
}

function goBack() {
    const { remote } = require('electron');
    remote.getCurrentWindow().loadFile('views/index.html')
}



var simulator = new Vue({
    el: '#simulator',
    data: {
        rows: processes
    }
});
