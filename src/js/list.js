const Swal = require('sweetalert2');
const json = require('../../utils/process.json');
const fs = require('fs');
const { remote } = require('electron')

var processes = new Vue({
    el: '#processes',
    data: {
        newProcessAttrs: {
            process: '',
            pid: '',
            state: '',
            quantum: '',
            priority: '',
            memory: '',
            time: '',
        },
        rows: json,

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
                {
                    title: 'Estado',
                    text: '1,2,3'
                },
                'Quantum',
                'Prioridad',
                'Memoria',
                'Tiempo'
            ]).then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: 'Proceso añadido a la cola',
                        confirmButtonText: 'Aceptar'
                    });
                    this.newProcessAttrs.process = result.value[0];
                    this.newProcessAttrs.pid = result.value[1];
                    this.newProcessAttrs.state = result.value[2];
                    this.newProcessAttrs.quantum = result.value[3];
                    this.newProcessAttrs.priority = result.value[4];
                    this.newProcessAttrs.memory = result.value[5];
                    this.newProcessAttrs.time = result.value[6];
                    this.rows.push(JSON.parse(JSON.stringify(this.newProcessAttrs)))
                }
            })

        },
        updateProcess(){
        console.log(json)
        },
        deleteProcess(index){
            this.rows.splice(index, 1);
            console.log(this.rows)
        },
        exportList(){
            fs.writeFile("utils/process.json", JSON.stringify(this.rows), (err) =>{
                if (err) throw err;
                console.log('JSON created!');
            });

        }
    }
});

function openSimulator() {
    const { remote } = require('electron')
    remote.getCurrentWindow().loadFile('views/simulator.html')
}