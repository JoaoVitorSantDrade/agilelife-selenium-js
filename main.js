import Worker from 'worker_threads'
import 'dotenv/config';


const Salas = 3;


function createWorker(i) {
    return new Promise(function (resolve) {
        console.log("Criando sala " + i)
        var worker = new Worker.Worker('./workers.js');
        worker.on('message',(msg) => {
            resolve(msg.data);
            return;
        });
        worker.on('error', (err) => {
            throw err;
            return;
        } );
        worker.postMessage(i);
    });
}

var promises = [];

async function main() {
    for (let i = 0; i < Salas; i++){
        promises.push(createWorker(i))
    }
}

main()

Promise.all(promises).then(function(results) {
    console.log("Todas as salas foram criadas com sucesso");
});


