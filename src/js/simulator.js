const processes = require('../../utils/process.json');

// FIFO => sort the entire "processes" object by arrival
function sortByArrival(arr){
    clock = 0;
    arr.sort((a, b) =>{
        return a.arrival - b.arrival
    })
}

// PRIORITY => sort the entire "processes" object by priority
function sortByPriority(arr) {
    clock = 0;
    arr.sort((a, b) =>{
        return a.priority - b.priority
    })
}
// TIME FUNCTIONS (IGNORING QUANTUM)
let clock = 0;
function timed() {
    document.getElementById('running').value = processes[clock].pid;
    setTimeout(() =>{
        document.getElementById('running').value = processes[clock].pid;
        document.getElementById('ready').value += processes[clock].pid + " ";
        clock++;
        if (clock < processes.length) timed();
    }, processes[clock].time * 1000);


    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    for(let i=0; i<tbody.rows.length; i++){
        if(tbody.rows[i].cells[0].innerHTML === processes[clock].pid){
            tbody.deleteRow(i);
        }
    }
}

// QUANTUM FUNCTIONS
function roundRobin() {
    let quantum = document.getElementById("quantum");
    let quantumTime = parseInt(quantum.options[quantum.selectedIndex].text);
}

// Plan processes according to selected algorithm
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
        console.log("ROUND ROBIN");
        sortByPriority(processes);
        roundRobin()
    }
}


// Go back to processes list view
function goBack() {
    const { remote } = require('electron');
    remote.getCurrentWindow().loadFile('views/index.html')
}



var simulator = new Vue({
    el: '#simulator',
    data: {
        rows: processes,
        show: true
    },
    methods:{
        reloadTable(){
            var self = this;
            self.show = false;
            Vue.nextTick(function (){
                console.log("re-render");
                self.show = true;
            })
        }
    }
});
