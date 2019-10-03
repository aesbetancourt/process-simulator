const si = require('systeminformation');
const Swal = require('sweetalert2');
const os 	= require('os-utils');


var vm = new Vue({
    el: '#processes',
    data: {
        // PROCESSES
        rows: null,
        //CPU
        cpu_name: null,
        cpu_speed: null,
        //MEMORY
        total_ram: null,
        //SYS
        so : null,
        dist: null,
        arch: null,
        //DISKS
        disk_type: null,
        disk_size: null,
    },
    methods:{
        // Returns a list of objects of the processes running
        getProcess(){
          setInterval(()=>{
              si.processes()
                  .then(data =>{this.rows = data.list})
          }, 3000)
        },
        // Returns important information about the system
        getSystemInfo(){
            si.cpu()
                .then(data =>{
                    this.cpu_name = data.brand;
                    this.cpu_speed = data.speed;
                });
            si.mem()
                .then(data =>{
                    this.total_ram = data.total;
                });
            si.osInfo()
                .then(data => {
                    this.so = data.platform;
                    this.dist = data.distro;
                    this.arch = data.arch;
                });
            si.diskLayout()
                .then(data =>{
                    this.disk_type = data[0].type;
                    this.disk_size = data[0].size;
                })
        },
        // Show a message with system information
        showInfoPopUp(){
            Swal.fire({
                title: 'Informacion del sistema',
                html:
                '<div align="left">' +
                '<hr><br>'+
                '<strong>Plataforma: </strong>' + this.so + '<br>' +
                '<strong>Distribucion: </strong>' + this.dist + '<br>'+
                '<strong>Arquitectura: </strong>' + this.arch + '<br>'+
                '<strong>CPU: </strong>' + this.cpu_name + ' ' + this.cpu_speed + ' GHz<br>'+
                '<strong>Memoria: </strong>' + (parseFloat(this.total_ram)/1e+6).toFixed(2) + 'MB<br>'+
                '<strong>DISCO: </strong>' + this.disk_type + ' ' + (parseFloat(this.disk_size)/1e+9).toFixed(2) + 'GB<br><hr><div>',
                animation: true
            })
        }
    },
    created() {
        // When the app is created, the functions previously instantiated are executed
        this.getSystemInfo();
        this.getProcess()
    }
});


// Returns the use of the RAM as a percentage in the specific time
let cont = 0;
function getMemUsagePercent() {
    let used_memory = os.totalmem() - os.freemem();
    if (cont === 0){
        cont = -1;
        return 0;
    }
    return ((used_memory * 100) / os.totalmem()).toFixed(1);
}

// Returns the use of the CPU as a percentage in the specific time
let usage = 0;
function getCPUUsagePercent(){
    os.cpuUsage(function(data){
        usage = data * 100;
    });
    return usage;
}

// Layout of the charts
const layout = {
    xaxis: {
        title: 'Tiempo (S)'
    },
    yaxis: {
        title: '%'
    },
    height: 150,
    width: 420,
    margin: {
        l: 40,
        r: 20,
        b: 30,
        t: 10,
        pad: 0
    }
};

// CPU usage chart
Plotly.plot('cpu-chart', [{
    y: [getCPUUsagePercent()],
    type: 'line',
}], layout, {displayModeBar: false});

// RAM usage chart
Plotly.plot('ram-chart', [{
    y: [getMemUsagePercent()],
    type: 'line',
}], layout, {displayModeBar: false});

// Update interval of tables with new data (10s)
let cnt = 0;
setInterval(function () {
    // Extend traces in CPU chart by 10s
    cnt++;
    Plotly.extendTraces('cpu-chart', { y: [[getCPUUsagePercent()]]}, [0]);
    if (cnt > 10){
        Plotly.relayout('cpu-chart', {
            xaxis: {
                range: [cnt-10, cnt]
            }
        })
    }
    // Extend traces in RAM chart by 10s
    Plotly.extendTraces('ram-chart', { y: [[getMemUsagePercent()]]}, [0]);
    if (cnt > 10){
        Plotly.relayout('ram-chart', {
            xaxis: {
                range: [cnt-10, cnt]
            }
        })
    }
}, 2000);

// Display a waiting message while data is loading
let timerInterval;
Swal.fire({
    title: 'Buscando procesos...',
    html: 'Espera un segundo',
    timer: 8000,
    onBeforeOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
            Swal.getContent().querySelector('strong')
                .textContent = Swal.getTimerLeft()
        }, 100)
    },
    onClose: () => {
        clearInterval(timerInterval)
    }
}).then((result) => {
    if (
        result.dismiss === Swal.DismissReason.timer
    ) {
        console.log('I was closed by the timer')
    }
});

// Refresh this page on button event
function reload() {
    const { remote } = require('electron');
    remote.getCurrentWindow().loadFile('views/processes.html')
}
