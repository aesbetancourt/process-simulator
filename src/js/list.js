const Swal = require('sweetalert2');

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
        rows: [
                {"process":"process","pid":"0001","state":"Standby","quantum":"5","priority":"1","memory":"2000","time":"5"},
                {"process":"process","pid":"0001","state":"Standby","quantum":"5","priority":"1","memory":"2000","time":"5"},
                {"process":"process","pid":"0001","state":"Standby","quantum":"5","priority":"1","memory":"2000","time":"5"},
                {"process":"process","pid":"0001","state":"Standby","quantum":"5","priority":"1","memory":"2000","time":"5"},
            ]
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
                    title: 'Proceso'
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
                        html:
                            'Your answers: <pre><code>' +
                            JSON.stringify(result.value) +
                            '</code></pre>',
                        confirmButtonText: 'Añadir'
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

        },
        deleteProcess(index){
            this.rows.splice(index, 1);
        }
    }
});