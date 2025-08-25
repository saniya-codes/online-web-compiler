/*
 middleware 3
    - send response from captured information
*/

async function responseMiddleware(req, res, next) {
    try {
        let processInfo = req.processInfo;
        res.status(200).json({output : processInfo});
    } catch (error) {
        console.log("error :", error);
        res.status(500).json({error : "internal server error"});
    }
}


export { responseMiddleware } 
/*
Summary
The responseMiddleware function is a simple Express middleware that:
Retrieves the processInfo from the req object.
Sends an HTTP response with status code 200 and the processInfo in JSON format.
Catches any errors that occur, logs the error, and sends a 500 status response with an error message.
This middleware is intended to be used after the execution and compilation middlewares, completing the request-response cycle by sending the final results to the client.
*/