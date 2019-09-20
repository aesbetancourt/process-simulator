processes = require('../../utils/process.json');

// FIFO
function sortByArrival(arr){
    arr.sort((a, b) =>{
        return a.arrival - b.arrival
    })
}

// PRIORITY
function sortByPriority(arr) {
    arr.sort((a, b) =>{
        return a.priority - b.priority
    })
}
// TIME FUNCTIONS (IGNORING QUANTUM)
let clock = 0;
function timed() {
    setTimeout(() =>{
        console.log(processes[clock].pid);
        clock++;
        if (clock < processes.length) timed();
    }, processes[clock].time * 1000)
}




// sortByPriority(processes);
// timed();



