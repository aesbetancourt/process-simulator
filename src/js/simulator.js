const processes = require('../../utils/fake_processes.json');

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


// SJF => sort the entire "processes" object by burst time
function sortByBurst(arr) {
    clock = 0;
    arr.sort((a, b) =>{
        return a.time - b.time
    })
}

// TIME FUNCTIONS (IGNORING QUANTUM)
let clock = 0;
function timed() {
    document.getElementById('running').value = processes[clock].pid;
    setTimeout(() =>{
        document.getElementById('running').value = processes[clock].pid;
        document.getElementById('finished').value += processes[clock].pid + " ";
        clock++;
        if (clock < processes.length) timed();
    }, processes[clock].time * 1000);


    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    for(let i=0; i<tbody.rows.length; i++){
        if(tbody.rows[i].cells[0].innerHTML === processes[clock].pid){
            tbody.rows[i].cells[5].innerHTML = 'Terminado'
            // tbody.deleteRow(i);
        }
    }
}

// QUANTUM FUNCTIONS

// General Quantum

function roundRobin(general_quantum, cycle, residual, remaining) {
    // let table = document.getElementsByTagName("table")[0];
    // let tbody = table.getElementsByTagName("tbody")[0];
    let suspended = [];
    let finished = [];
    if (general_quantum){
        let q = document.getElementById("quantum");
        let quantum = parseInt(q.options[q.selectedIndex].text);
        let steps = iterations(quantum, remaining);

        function repeat() {
            document.getElementById('suspended').value = suspended;
            document.getElementById('finished').value = finished;
            if (remaining[cycle] > quantum){
                residual = quantum;
                remaining[cycle] -= quantum;
                document.getElementById('running').value = processes[cycle].pid;
                suspended.push(processes[cycle].pid);
            } else if (quantum >= remaining[cycle]){
                residual = remaining[cycle];
                remaining[cycle] = 0;
                finished.push(processes[cycle].pid);
                document.getElementById('running').value = processes[cycle].pid;
            } else {
                for (let i = 0; i < remaining.length; i++) {
                    if (remaining[i] !== 0){
                        residual = remaining[i];
                        remaining[i] -= remaining[i];
                        if (remaining[i] === 0){
                            suspended.splice(0,1);
                            finished.push(processes[i].pid);
                        }
                        document.getElementById('running').value = processes[i].pid;
                        break
                    }
                }
                function checkZeros(num) {
                    return num === 0;
                }
                if (remaining.every(checkZeros)){
                    document.getElementById('running').value = "No hay procesos pendientes por ejecutar";
                    document.getElementById('suspended').value = suspended;
                    document.getElementById('finished').value = finished;
                }
            }
            setTimeout(() => {
                cycle++;
                console.log(remaining);
                if (cycle < steps) repeat()
            }, 1000 * residual);
        }
        repeat()
    } else {
        // Variable Quantum
    }

}

function iterations(quantum, arr) {
    let steps = 0;
    for (let i = 0; i < arr.length; i++) {
        steps += arr[i]/quantum;
        if (steps < 1){
            steps = 1
        }
        steps = Math.ceil(steps)
    }
    return steps
}


// Plan processes according to selected algorithm
function run() {
    document.getElementById('running').value = '';
    document.getElementById('finished').value = '';
    let algo = document.getElementById("algorithm");
    let selection = algo.options[algo.selectedIndex].value;
    if (selection === "1"){
        // console.log("FIFO");
        sortByArrival(processes);
        timed();
    } else if (selection === "2"){
        // console.log("PRIORITY");
        sortByPriority(processes);
        timed();
    } else if (selection === "3"){
        console.log("ROUND ROBIN");
        sortByArrival(processes);
        let general_quantum = false;
        let cycle = 0;
        let remaining = [];
        for (let i = 0; i < processes.length ; i++) {
            remaining.push(parseInt(processes[i].time))
        }
        let residual = 0;

        let q = document.getElementById("quantum");
        let type = q.options[q.selectedIndex].value;
        if (type !== "No Aplica"){
            general_quantum = true
        }
        roundRobin(general_quantum, cycle, residual, remaining)
    } else if (selection === "4"){
        console.log("SJF");
        sortByBurst(processes);
        timed();
    }
}


// Go back to processes list view
function goBack() {
    const { remote } = require('electron');
    remote.getCurrentWindow().loadFile('views/list.html')
}


var vm = new Vue({
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
