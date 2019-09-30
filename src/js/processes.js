const si = require('systeminformation');
const Swal = require('sweetalert2');

var vm = new Vue({
    el: '#processes',
    data: {
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
        getProcess(){
          setInterval(()=>{
              si.processes()
                  .then(data =>{this.rows = data.list})
          }, 3000)
        },
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
                '<strong>Memoria: </strong>' + this.total_ram + '<br>'+
                '<strong>DISCO: </strong>' + this.disk_type + ' ' + this.disk_size + '<br><hr><div>',
                animation: false
            })
        }

    },
    created() {
        this.getSystemInfo();
        this.getProcess()
    }
});
