import express from "express"
const router = express.Router();
import { languageJsMiddlewareOne, languageCMiddlewareOne, languageJavaMiddlewareOne, languageCppMiddlewareOne, languagePythonMiddlewareOne, languageBashMiddlewareOne, languageRubyMiddlewareOne } from "../middlewares/reqHandlerMiddlewares.js";
import { interprettedLanguageMiddlewareTwo, compiledLanguageMiddlewareTwo } from "../middlewares/systemCallMiddlewares.js";
import { responseMiddleware } from "../middlewares/resHandlingMiddlewares.js";

router.post("/c", [languageCMiddlewareOne, compiledLanguageMiddlewareTwo, responseMiddleware]);

router.post("/cpp", [languageCppMiddlewareOne, compiledLanguageMiddlewareTwo, responseMiddleware]);

router.post("/js", [languageJsMiddlewareOne, interprettedLanguageMiddlewareTwo, responseMiddleware]); 

router.post("/java", [languageJavaMiddlewareOne, compiledLanguageMiddlewareTwo, responseMiddleware]);

router.post("/python", [languagePythonMiddlewareOne, interprettedLanguageMiddlewareTwo, responseMiddleware]);

router.post("/ruby",  [languageRubyMiddlewareOne, interprettedLanguageMiddlewareTwo, responseMiddleware]);

router.post("/bash", [languageBashMiddlewareOne, interprettedLanguageMiddlewareTwo, responseMiddleware]);

export default router;


//each programming language has it's own system call (wrapped within try/catch) ->  