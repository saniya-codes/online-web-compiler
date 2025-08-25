import express from "express"
import codeRouter from "./routes/codeRouter.js"
import os from "os"
import cluster from "node:cluster";

const num_cores = os.cpus().length; //It will collect all the cores available in the system 

const app = express();

const port = 8080;

app.use(express.json());

app.use(express.static(`build`));

app.use((req, res, next) => {
    console.log(`Processed by ${process.pid}`);
    next()
});

app.use("/api/compiler", codeRouter);

//checks presence of main process in each core -> if present, will spawn and fork main process into all other core
//spawns worker threads when main process is found, prints process Id when statement is false

if (cluster.isPrimary) { //This checks if the current process is the primary (master) process.
    for (let i = 0; i < num_cores; i++) { //If it is the primary process, it forks new worker processes based on the number of CPU cores.
        cluster.fork(); //creates a copy of main express instance on all cores
    }
    cluster.on("exit", (worker, core, signal) => { //This listens for the 'exit' event, which is emitted when a worker process dies, and logs the worker's PID.
        console.log(`worker ${worker.process.pid} died`);
    })
}
else { //If the process is a worker (not the primary process), it starts the Express server.
    app.listen(port, () => {
        console.log(`Compiler app listening at http://localhost:${port} and Core/Process ID ${process.pid}`);
    });
}
//In Node.js, cluster is a module that allows you to create child processes (workers) that all share the same server port. This is useful for taking advantage of multi-core systems by creating a separate process for each CPU core, enabling your application to handle more load and achieve better performance.