import { killPID, execFn, execFileFn } from "../helpers/index.js"
import fs from "fs/promises"

/*
 middleware 2
    - makes execFile (compiled languages), exec (execution) sys calls
    - handle all sys calls within try block using custom promise syntax
    - time and memory metrics captured
*/

async function interprettedLanguageMiddlewareTwo(req, res, next) {
    try {
        let args = req.executionArgs, msg;
        // exec allows process termination
        let output = await execFn(args); // Execution Call: Executes a function execFn (likely an asynchronous function) with args obtained from req.executionArgs. This function seems executes a program and returns an object output which contains execution details.

        // Add stdout to output if it exists
        if (output.stdout) {
            output.stdout = output.stdout;
        }

        if (output.code) {
            msg = "Runtime error"; // covers all errors
        } else {
            msg = "Successfully executed";
        }

        if (output.code == 0) {
            let processTimeMetrics = output.stderr.split("\n").slice(0, -1);
            let time = {
                "real": `${processTimeMetrics[0]}s`,
                "user": `${processTimeMetrics[1]}s`,
                "sys": `${processTimeMetrics[2]}s`
            }
            output.time = time;
        } else if (output.code == null) { // time metrics not captured
            msg = "process forcefully terminated, program must adhere to a runtime of 4000ms and 90KB";
            // only in case of max_buffer (errorMsg is usually captured for process terminated by node)
            if (!output.errorMsg) {
                let killOutput = await killPID(output.pid);
                if (killOutput.error) {
                    console.log(killOutput);
                }
            }
        } else {
            let time = {
                "real": `${output.stderr.match(/real (\d+\.\d+)/)[1]}s`,
                "user": `${output.stderr.match(/user (\d+\.\d+)/)[1]}s`,
                "sys": `${output.stderr.match(/sys (\d+\.\d+)/)[1]}s`
            }
            output.time = time;
        }

        /*
        Output Handling: Depending on output.code:
        If output.code is 0, parses output.stderr to extract time metrics and adds them to output.time.
        If output.code is null, indicates that the process was forcefully terminated, attempts to kill the process using killPID(output.pid) if output.errorMsg is not present.
        Otherwise, parses output.stderr to capture time metrics and adds them to output.time.
         */

        output.msg = msg;
        output.memory = {
            "heapUsed": `${Math.floor((process.memoryUsage().heapUsed) / 1024)}KB`,
            "heapTotal": `${Math.floor((process.memoryUsage().heapTotal) / 1024)}KB`,
            "rss": `${Math.floor((process.memoryUsage().rss) / 1024)}KB`
        }; // Memory Usage: Retrieves current memory usage stats (heapUsed, heapTotal, rss) and formats them into KB, assigning to output.memory.

        req.processInfo = { ...output, ...req.processInfo };
        await fs.rm(req.dirPath, { recursive: true, force: true });
        next();
    } catch (error) { // Error Handling (Catch Block): Logs any errors that occur during execution, cleans up by removing req.dirPath, and then calls next().
        console.log("middleware2-interpretted :", error);
        await fs.rm(req.dirPath, { recursive: true, force: true });
        next()
    }
}


async function compiledLanguageMiddlewareTwo(req, res, next) {
    try { //Initialization: Retrieves compileArgs from req and initializes msg for messages.
        let compileArgs = req.compileArgs;
        let msg;

        // Compilation step //Compilation: Executes compilation using execFileFn with req.executable and compileArgs, storing the result in compiledOutput.
        let compiledOutput = await execFileFn(req.executable, compileArgs);

        if (compiledOutput.error) {
            msg = "Compilation failed";
            req.processInfo = { ...compiledOutput.error, msg };
            res.status(200).json({ output: req.processInfo });
            await fs.rm(req.dirPath, { recursive: true, force: true });
            return;
        }//Compilation Error Check: If compiledOutput.error exists, indicates compilation failure, sets msg, sends response with error details, and cleans up.

        // Execution step 
        let executionOutput = await execFn(req.executionArgs)
        if (executionOutput.code) msg = "Runtime error";
        else msg = "Compiled and executed successfully";

        if (executionOutput.code === 0) {
            let processTimeMetrics = executionOutput.stderr.split("\n").slice(0, -1);
            let time = {
                "real": `${processTimeMetrics[0]}s`,
                "user": `${processTimeMetrics[1]}s`,
                "sys": `${processTimeMetrics[2]}s`
            };
            executionOutput.time = time;
        } else if (executionOutput.code === null) {
            msg = "Process forcefully terminated, program must adhere to a runtime of 4000ms and 90KB";
            if (!executionOutput.errorMsg) {
                let killOutput = await killPID(executionOutput.pid);
                if (killOutput.error) {
                    console.log(killOutput);
                }
            }
        } else {
            let time = {
                "real": `${executionOutput.stderr.match(/real (\d+\.\d+)/)[1]}s`,
                "user": `${executionOutput.stderr.match(/user (\d+\.\d+)/)[1]}s`,
                "sys": `${executionOutput.stderr.match(/sys (\d+\.\d+)/)[1]}s`
            };
            executionOutput.time = time;
        }//Execution Output Handling: Similar to the interpreted middleware, handles different cases of executionOutput.code (success, termination, error) and captures time metrics accordingly.

        executionOutput.msg = msg;
        executionOutput.memory = {
            "heapUsed": `${Math.floor((process.memoryUsage().heapUsed) / 1024)}KB`,
            "heapTotal": `${Math.floor((process.memoryUsage().heapTotal) / 1024)}KB`,
            "rss": `${Math.floor((process.memoryUsage().rss) / 1024)}KB`
        };
        req.processInfo = { ...executionOutput, ...req.processInfo };
        await fs.rm(req.dirPath, { recursive: true, force: true });
        next();
    } catch (error) { //Error Handling (Catch Block): Logs errors, cleans up by removing req.dirPath, and calls next().
        console.log("middleware2-compiled :", error);
        await fs.rm(req.dirPath, { recursive: true, force: true });
        next();
    }
}

export { interprettedLanguageMiddlewareTwo, compiledLanguageMiddlewareTwo } 

/*
Summary
Both middleware functions handle execution or compilation of code, capture execution metrics, manage errors, update request information (req.processInfo), and perform directory cleanup after execution.
They utilize async/await for handling asynchronous operations and ensure proper error logging and cleanup in case of failures.
*/