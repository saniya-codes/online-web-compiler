import {exec, execFile} from "child_process"

//The index.js file defines three asynchronous functions using the child_process module in Node.js to execute commands and manage processes. 

//to compiler
function execFileFn(executable, args){
    return new Promise((resolve, reject)=>{
        execFile(executable, [args], {
            timeout: 4000,
            maxBuffer: 1024 * 90,
            shell: true
        }, (error, stdout, stderr)=>{
            //null -> success
            if(error){
                error.stderr = stderr; //populated with compilation error
                error.stdout = stdout; 
            }   
            resolve({error}); //if executable fails
        });
    })    
}

//to execute
function execFn(args) {
    let output = {}
    let child = exec(args, {
        timeout: 4000,
        maxBuffer: 1024*90, //maxBuffer terminates succesfully
        killSignal: "SIGKILL"
    }, (error, stderr, stdout)=>{
        //time metrics enter 'stderr' only after program termination along with error.message (merged)
        if(error && error.message == "stdout maxBuffer length exceeded"){
            //node terminated process
            output.errorMsg = error.message;
        }
    });
    console.log(`node child-process : ${child.pid}, script : ${+child.pid + 2}`);
    return new Promise((resolve, reject) => {
        output.pid = +child.pid + 2;       

        // Capture the exit event
        child.on('exit', (code, signal) => {
            output.code = code;
            output.signal = signal;
            output.stderr = stderr;
            output.stdout = stdout;
            resolve(output);
        });

        // Capture standard output
        let stdout = '';
        child.stdout.on('data', (data) => {
            stdout += data;
        });

        // Capture standard error -> nodejs error merged
        let stderr = '';
        child.stderr.on('data', (data) => {
            stderr += data;
        });
    })
}

//can this only be done in callback format
function killPID(pid){
    return new Promise((resolve, reject)=>{
        exec(`kill ${pid}`, ((error, stdout, stderr)=>{
            //null -> success
            if(error){
                error.stdout = stdout; 
                error.stderr = stderr; //used in case of executable failure -> command failed , '/bin/sh: 1: kill: No such process\n\n'
            }
            resolve({error}); //contains status/signal/killed (command failed message)
        }))
    })
}

export {execFn, killPID, execFileFn}
/*
The provided code includes three asynchronous utility functions for managing processes using Node.js's child_process module. Here's a summary of each function:

execFileFn:
Purpose: Executes a file (commonly used for compiling code).
Parameters:
executable: The command or executable to run (string).
args: The arguments to pass to the executable (string).
Returns: A Promise that resolves with an object containing any errors (error.stderr and error.stdout) if the execution fails.

execFn:
Purpose: Runs a command and captures its output and metadata.
Parameters:
args: The command to run, along with any arguments (string).
Returns: A Promise that resolves with an object containing:
pid: Process ID.
code: Exit code.
signal: Signal that caused the process to exit.
stdout: Standard output.
stderr: Standard error.
Behavior:
Handles process execution with a buffer limit.
Captures stdout and stderr data.
Handles process exit events.

killPID:
Purpose: Kills a process by its PID.
Parameters:
pid: The Process ID to kill (number).
Returns: A Promise that resolves with an object containing any errors (error.stderr and error.stdout) if the kill command fails.
*/