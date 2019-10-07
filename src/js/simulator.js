const processes = require('../../utils/fake_processes.json');
const mem = require('../../utils/memory.json');


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
        return a.burst - b.burst
    })
}

let finished = [];
let keepGoing = true;
// TIME FUNCTIONS (IGNORING QUANTUM)
let clock = 0;

function timed(remainingArr) {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    function repeat(){
        if (clock !== 0){
            for(let i=0; i< tbody.rows.length; i++){
                if(tbody.rows[i].cells[0].innerHTML === processes[clock-1].pid){
                    tbody.rows[i].cells[5].innerHTML = 'Terminado';
                    tbody.rows[i].cells[5].style.backgroundColor="#2d5faa";
                    tbody.rows[i].cells[5].style.color="#b1b2b8";
                }
            }
        }
        document.getElementById('finished').value = finished;
        document.getElementById('running').value = processes[clock].pid;
        finished.push(processes[clock].pid);
        remainingArr[clock] -= remainingArr[clock];
        if (keepGoing){
            setTimeout(() =>{
                // console.log(remainingArr);
                if (remainingArr.every(checkZeros)){
                    document.getElementById('running').value = "No hay procesos pendientes por ejecutar";
                }
                clock++;
                if (clock <= processes.length) repeat();
            }, processes[clock].burst * 1000);

        }
    }
    repeat();


}

// QUANTUM FUNCTIONS
// General Quantum
function roundRobin(general_quantum, cycle, residual, remaining) {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    if (general_quantum){
        // console.log("General");
        let q = document.getElementById("quantum");
        let quantum = parseInt(q.options[q.selectedIndex].text);
        let steps = iterations(quantum, remaining);
        let suspended = [];

        function repeat() {
            if (cycle <= processes.length){
                for(let i=0; i < tbody.rows.length; i++){
                    for (let j = 0; j < finished.length; j++) {
                        if(tbody.rows[i].cells[0].innerHTML === finished[j]){
                            tbody.rows[i].cells[5].innerHTML = 'Terminado';
                            tbody.rows[i].cells[5].style.backgroundColor="#2d5faa";
                            tbody.rows[i].cells[5].style.color="#b1b2b8";
                        }
                    }
                }
            }
            if (cycle <= processes.length){
                for(let i=0; i < tbody.rows.length; i++){
                    for (let j = 0; j < suspended.length; j++) {
                        if(tbody.rows[i].cells[0].innerHTML === suspended[j]){
                            tbody.rows[i].cells[5].innerHTML = 'Suspendido';
                            tbody.rows[i].cells[5].style.backgroundColor="#e3742d";
                            tbody.rows[i].cells[5].style.color="#222225";
                        }
                    }
                }
            }
            document.getElementById('suspended').value = suspended;
            document.getElementById('finished').value = finished;
            if (remaining[cycle] > quantum){
                residual = quantum;
                remaining[cycle] -= quantum;
                document.getElementById('running').value = processes[cycle].pid;
                suspended.push(processes[cycle].pid);

            } else if (quantum >= remaining[cycle]) {

                residual = remaining[cycle];
                remaining[cycle] = 0;
                finished.push(processes[cycle].pid);
                document.getElementById('running').value = processes[cycle].pid;
            } else {
                for (let i = 0; i < remaining.length; i++) {
                    if (remaining[i] >= quantum){
                        residual = quantum;
                        remaining[i] -= quantum;
                    } else if (remaining[i] !== 0){
                        residual = remaining[i];
                        remaining[i] -= remaining[i];
                        if (remaining[i] === 0){
                            suspended.splice(0,1);
                            finished.push(processes[i].pid);
                            for(let i=0; i < tbody.rows.length; i++){
                                for (let j = 0; j < finished.length; j++) {
                                    if(tbody.rows[i].cells[0].innerHTML === finished[j]){
                                        tbody.rows[i].cells[5].innerHTML = 'Terminado';
                                        tbody.rows[i].cells[5].style.backgroundColor="#2d5faa";
                                        tbody.rows[i].cells[5].style.color="#b1b2b8";
                                    }
                                }
                            }
                        }
                        document.getElementById('running').value = processes[i].pid;
                        break
                    }
                }
                if (remaining.every(checkZeros)){
                    document.getElementById('running').value = "No hay procesos pendientes por ejecutar";
                    document.getElementById('suspended').value = suspended;
                    document.getElementById('finished').value = finished;
                }
            }
            if (keepGoing){
                setTimeout(() => {
                    cycle++;
                    // console.log(remaining);
                    if (cycle < steps) repeat()
                }, 1000 * residual);
            }
        }
        repeat()
    } else {
        let quantum = quantums(processes);
        let steps = iterations(quantum, remaining);
        let suspended = [];
        function repeatQuantum() {
            if (cycle <= processes.length){
                for(let i=0; i < tbody.rows.length; i++){
                    for (let j = 0; j < finished.length; j++) {
                        if(tbody.rows[i].cells[0].innerHTML === finished[j]){
                            tbody.rows[i].cells[5].innerHTML = 'Terminado';
                            tbody.rows[i].cells[5].style.backgroundColor="#2d5faa";
                            tbody.rows[i].cells[5].style.color="#b1b2b8";
                        }
                    }
                }
            }
            if (cycle <= processes.length){
                for(let i=0; i < tbody.rows.length; i++){
                    for (let j = 0; j < suspended.length; j++) {
                        if(tbody.rows[i].cells[0].innerHTML === suspended[j]){
                            tbody.rows[i].cells[5].innerHTML = 'Suspendido';
                            tbody.rows[i].cells[5].style.backgroundColor="#e3742d";
                            tbody.rows[i].cells[5].style.color="#222225";
                        }
                    }
                }
            }
            document.getElementById('suspended').value = suspended;
            document.getElementById('finished').value = finished;
            if (remaining[cycle] > quantum[cycle]){
                residual = quantum[cycle];
                remaining[cycle] -= quantum[cycle];
                document.getElementById('running').value = processes[cycle].pid;
                suspended.push(processes[cycle].pid);
            } else if (quantum[cycle] >= remaining[cycle]){
                residual = remaining[cycle];
                remaining[cycle] = 0;
                finished.push(processes[cycle].pid);
                document.getElementById('running').value = processes[cycle].pid;
            } else {
                for (let i = 0; i < remaining.length; i++) {
                    if (remaining[i] >= quantum[i]){
                        residual = quantum[i];
                        remaining[i] -= quantum[i];
                    } else if (remaining[i] !== 0){
                        residual = remaining[i];
                        remaining[i] -= remaining[i];
                        if (remaining[i] === 0){
                            suspended.splice(0,1);
                            finished.push(processes[i].pid);
                            for(let i=0; i < tbody.rows.length; i++){
                                for (let j = 0; j < finished.length; j++) {
                                    if(tbody.rows[i].cells[0].innerHTML === finished[j]){
                                        tbody.rows[i].cells[5].innerHTML = 'Terminado';
                                        tbody.rows[i].cells[5].style.backgroundColor="#2d5faa";
                                        tbody.rows[i].cells[5].style.color="#b1b2b8";
                                    }
                                }
                            }
                        }
                        document.getElementById('running').value = processes[i].pid;
                        break
                    }
                }
                if (remaining.every(checkZeros)){
                    document.getElementById('running').value = "No hay procesos pendientes por ejecutar";
                    document.getElementById('suspended').value = suspended;
                    document.getElementById('finished').value = finished;
                }
            }
            setTimeout(() => {
                cycle++;
                // console.log("quantum",quantum);
                // console.log("Suspended ",suspended);
                if (cycle < steps) repeatQuantum();
            }, 1000 * residual)
        }
        repeatQuantum();
    }

}

function iterations(quantum, arr) {
    let steps = 0;
    if (Array.isArray(quantum)){
        for (let i = 0; i < arr.length ; i++) {
            steps += arr[i]/quantum[i];
            if (steps < 1){
                steps = 1
            }
            steps = Math.ceil(steps)
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            steps += arr[i]/quantum;
            if (steps < 1){
                steps = 1
            }
            steps = Math.ceil(steps)
        }
    }
    return steps
}

function quantums(objArr) {
    let remaining = [];
    for (let i = 0; i < objArr.length ; i++) {
        remaining.push(parseInt(objArr[i].quantum))
    }
    return remaining;
}

function remainingTime(objArr) {
    let remaining = [];
    for (let i = 0; i < objArr.length ; i++) {
        remaining.push(parseInt(objArr[i].burst))
    }
    return remaining
}

function checkZeros(num) {
    return num === 0;
}


// Plan processes according to selected algorithm
function run() {
    keepGoing = true;
    document.getElementById('running').value = '';
    document.getElementById('finished').value = '';
    let algorithm = document.getElementById("algorithm");
    let selection = algorithm.options[algorithm.selectedIndex].value;
    if (selection === "1"){
        // console.log("FIFO");
        finished = [];
        let remaining = remainingTime(processes);
        sortByArrival(processes);
        timed(remaining);
    } else if (selection === "2"){
        // console.log("PRIORITY");
        finished = [];
        let remaining = remainingTime(processes);
        sortByPriority(processes);
        timed(remaining);
    } else if (selection === "3"){
        // console.log("ROUND ROBIN");
        finished = [];
        sortByArrival(processes);
        let general_quantum = false;
        let remaining = remainingTime(processes);
        let cycle = 0;
        let residual = 0;

        let q = document.getElementById("quantum");
        let type = q.options[q.selectedIndex].text;
        if (type !== "No Aplica"){general_quantum = true}

        roundRobin(general_quantum, cycle, residual, remaining)
    } else if (selection === "4"){
        // console.log("SJF");
        finished = [];
        let remaining = remainingTime(processes);
        sortByBurst(processes);
        timed(remaining);
    }
}
function getMemoryArr(objArr) {
    let arr = [];
    for (let i = 0; i < processes.length ; i++) {
        arr.push(parseInt(objArr[i].memory))
    }
    return arr;
}

// Go back to processes list view
function goBack() {
    const { remote } = require('electron');
    remote.getCurrentWindow().loadFile('views/list.html')
}

function stop() {
    keepGoing = false;
}

function reload() {
    document.getElementById('running').value = '';
    document.getElementById('finished').value = '';
    document.getElementById('suspended').value = '';
}

//
function pause() {
    stop()
    

}

function kill() {

}



var vm = new Vue({
    el: '#simulator',
    data: {
        rows: processes,
        show: true,
        used_memory: '',
        total_memory: mem
    },
    methods:{
        reloadTable(){
            this.used_memory = this.getMemory();
            var self = this;
            self.show = false;
            Vue.nextTick(function (){
                console.log("re-render");
                self.show = true;
            })
        },
        getMemory(){
            let used = 0;
            for (let i = 0; i < processes.length; i++) {
                used += parseInt(processes[i].memory)
            }
            return used
        },
        freeSpace(memoryArr){
            for (let i = 0; i < memoryArr.length ; i++) {
                if (finished[i] === processes[i].pid){
                    this.used_memory -= memoryArr[i];
                    memoryArr[i] = 0;
                }
            }
        }
    },
    created() {
        this.used_memory = this.getMemory();
        let memoryArr = getMemoryArr(processes);
        this.interval = setInterval(() => this.freeSpace(memoryArr), 5000);
    }
});