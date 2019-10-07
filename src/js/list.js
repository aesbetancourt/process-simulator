const Swal = require('sweetalert2');
const json = require('../../utils/fake_processes.json');
const mem = require('../../utils/memory.json');
const fs = require('fs');

var vm = new Vue({
    el: '#processes',
    data: {
        newProcessAttrs: {
            process: '',
            pid: '',
            priority: '',
            memory: '',
            burst: '',
            arrival: '',
            quantum: ''
        },
        rows: json,
        memory: mem
    },
    methods: {
        addProcess() {
            Swal.mixin({
                input: 'text',
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                progressSteps: ['1', '2', '3', '4', '5', '6', '7']
            }).queue([
                {
                    title: 'Nombre del Proceso'
                },
                'PID',
                'Prioridad',
                'Memoria',
                'Tiempo',
                'Llegada',
                'Quantum'
            ]).then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: 'Proceso añadido a la cola',
                        confirmButtonText: 'Aceptar'
                    });
                    this.newProcessAttrs.process = result.value[0];
                    this.newProcessAttrs.pid = result.value[1];

                    this.newProcessAttrs.priority = result.value[2];
                    this.newProcessAttrs.memory = result.value[3];
                    this.newProcessAttrs.burst = result.value[4];
                    this.newProcessAttrs.arrival = result.value[5];
                    this.newProcessAttrs.quantum = result.value[6];
                    this.rows.push(JSON.parse(JSON.stringify(this.newProcessAttrs)))
                }
            })

        },
        updateProcess(){
            console.log(json);
        },
        deleteProcess(index){
            this.rows.splice(index, 1);
            console.log(this.rows)
        },
        exportList(){
            fs.writeFile("utils/fake_processes.json", JSON.stringify(this.rows), (err) =>{
                if (err) throw err;
                console.log('fake_processes.json updated!');
            });
            let r = document.getElementById("ram");
            this.memory = r.options[r.selectedIndex].text;
            fs.writeFile("utils/memory.json", JSON.stringify(this.memory), (err) =>{
                if (err) throw err;
                console.log('memory.json updated!');
            });
        }
    }
});

function openSimulator() {
    const { remote } = require('electron');
    remote.getCurrentWindow().loadFile('views/simulator.html')
}