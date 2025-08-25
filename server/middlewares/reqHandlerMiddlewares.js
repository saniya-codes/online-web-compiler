import fs from "fs/promises";
import path from "path";
//middleware-1
/*
Each middleware function performs the following tasks:

Generates a unique workspace name.
Creates a directory for storing the code.
Writes the provided code to a file.
Prepares command strings for execution or compilation.
*/
//The workspace name is a unique identifier for a temporary directory where the code provided by the user will be stored and executed. This name is generated randomly to ensure that each request gets its own isolated directory
//workspace at the end Store Path and Execution Information in Request Object
/*
By declaring const workspaceName, const { language, code, args }, const dirPath, and let processInfo outside the try block, you ensure that these variables are accessible throughout the entire function.
This allows you to reference them in the catch block for logging purposes and ensures the req object is properly populated regardless of where an error might occur.
*/
//interpretted

async function languageJsMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9); //Purpose: Generates a random string to use as a workspace name.
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName); //Purpose: Constructs the path to the workspace directory. //Details: Uses path.join to create a platform-independent directory path combining "workspaces", the language, and the workspace name.
    req.dirPath = dirPath;
    let processInfo = {}; //Purpose: Initializes an object processInfo to store information about the process, starting with the language.
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true }); //Purpose: Creates the workspace directory.
        await fs.writeFile(`${dirPath}/code.js`, code); //Purpose: Writes the provided JavaScript code to a file named code.js in the workspace directory.
        let cmdArgs = `time -p node ${dirPath}/code.js`; //Purpose: Constructs the command-line arguments for executing the JavaScript code. //Details: time -p: Measures the execution time of the command. 
        cmdArgs = args ? cmdArgs + " " + args : cmdArgs;
        req.executionArgs = cmdArgs; //Purpose: Attaches the constructed command-line arguments and process information to the req object, then passes control to the next middleware.
        req.processInfo = processInfo; //Purpose: Appends additional arguments to the command if provided //The processInfo object in both middleware functions currently only includes the language property
        next(); //Invokes the next middleware .
    } catch (error) { //Purpose: Handles any errors that occur during the try block.
        console.log("middleware1-js :", error);
        next(error); // Pass the error to the next middleware
    }
}
//compiled
async function languageCMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9);
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName);
    req.dirPath = dirPath;
    let processInfo = {};
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.c`, code);
        let compileArgs = `-o ${dirPath}/output ${dirPath}/code.c`;
        req.compileArgs = compileArgs;
        req.executionArgs = `time -p ${dirPath}/output ${args}`;
        req.executable = "gcc";
        req.processInfo = processInfo;
        next();
    } catch (error) {
        console.log("middleware1-c :", error);
        next(error);
    }
}


async function languageJavaMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9);
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName);
    req.dirPath = dirPath;
    let processInfo = {};
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.java`, code);
        let findClass = `${code.match(/class [a-zA-Z]+ \{/)[0]}`;
        let className = findClass.slice(6, findClass.length - 2);
        let cmdArgs = `-d ${dirPath} ${dirPath}/code.java`;
        req.compileArgs = cmdArgs;
        req.executionArgs = `time -p java -classpath ${dirPath} ${className} ${args}`;
        req.processInfo = processInfo;
        req.executable = "javac";
        next();
    } catch (error) {
        console.log("middleware1-java :", error);
        next(error);
    }
}

async function languageCppMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9);
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName);
    req.dirPath = dirPath;
    let processInfo = {};
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.cpp`, code);
        let cmdArgs = `-o ${dirPath}/output ${dirPath}/code.cpp`;
        req.compileArgs = cmdArgs;
        req.executionArgs = `time -p ${dirPath}/output ${args}`;
        req.processInfo = processInfo;
        req.executable = "g++";
        next();
    } catch (error) {
        console.log("middleware1-cpp :", error);
        next(error);
    }
}

async function languagePythonMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9);
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName);
    req.dirPath = dirPath;
    let processInfo = {};
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.py`, code);
        let cmdArgs = `time -p python3 ${dirPath}/code.py`;
        cmdArgs = args ? cmdArgs + " " + args : cmdArgs;
        req.executionArgs = cmdArgs;
        req.processInfo = processInfo;
        next();
    } catch (error) {
        console.log("middleware1-py :", error);
        next(error);
    }
}

async function languageBashMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9);
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName);
    req.dirPath = dirPath;
    let processInfo = {};
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.sh`, code);
        let cmdArgs = `time -p bash ${dirPath}/code.sh`;
        cmdArgs = args ? cmdArgs + " " + args : cmdArgs;
        req.executionArgs = cmdArgs;
        req.processInfo = processInfo;
        next();
    } catch (error) {
        console.log("middleware1-bash :", error);
        next(error);
    }
}

async function languageRubyMiddlewareOne(req, res, next) {
    const workspaceName = Math.random().toString(36).slice(2, 9);
    const { language, code, args } = req.body;
    const dirPath = path.join("workspaces", language, workspaceName);
    req.dirPath = dirPath;
    let processInfo = {};
    processInfo.language = language;
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.rb`, code);
        let cmdArgs = `time -p ruby ${dirPath}/code.rb`;
        cmdArgs = args ? cmdArgs + " " + args : cmdArgs;
        req.executionArgs = cmdArgs;
        req.processInfo = processInfo;
        next();
    } catch (error) {
        console.log("middleware1-ruby :", error);
        next(error);
    }
}

export {
    languageJsMiddlewareOne,
    languageCMiddlewareOne,
    languageJavaMiddlewareOne,
    languageCppMiddlewareOne,
    languagePythonMiddlewareOne,
    languageBashMiddlewareOne,
    languageRubyMiddlewareOne
};
