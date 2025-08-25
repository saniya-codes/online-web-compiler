import { useState } from "react";
import axios from "axios";
import Loading from "./components/Loading.js";
import AceEditor from "react-ace";
import "./App.css";

// Language imports (C, C++, bash not supported)
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";

// Theme imports
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";

// AXIOS 413 Error

function App() {
  const [loading, setLoading] = useState(null);
  const [btnDisplay, setBtnDisplay] = useState(null);
  const [display, setDisplay] = useState({ output: false, error: false });
  const [ide, setIde] = useState({
    code: "",
    args: "",
    time: "",
    space: "",
    language: "",
    output: "",
    error: "",
    theme: "monokai",
    mode: "javascript"
  });

  const onChangeHandler = (e) => {
    setIde({ ...ide, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post(`/api/compiler/${ide.language}`, { args: ide.args, language: ide.language, code: ide.code });
      let outputToRender, errorToRender;
      if (res.data.output.code === 0) { // success
        outputToRender = res.data.output.stdout;
        errorToRender = "";
        setDisplay({ error: false, output: true });
        setIde({
          ...ide,
          output: outputToRender,
          time: `${res.data.output.time.real}, ${res.data.output.time.user}, ${res.data.output.time.sys}`,
          space: `heap-used: ${res.data.output.memory.heapUsed}, rss: ${res.data.output.memory.rss}`,
          error: errorToRender
        });
      } else {
        outputToRender = res.data.output.stdout || "";
        errorToRender = res.data.output.errorMsg ? `${res.data.output.errorMsg}, ${res.data.output.msg}` : res.data.output.msg;
        setDisplay({ error: true, output: true });
        setIde({
          ...ide,
          output: outputToRender,
          time: "",
          space: `heap-used: ${res.data.output.memory.heapUsed}, rss: ${res.data.output.memory.rss}`,
          error: errorToRender
        });
      }
      setLoading(false);
      setBtnDisplay(true);
    } catch (error) {
      setLoading(false);
      setDisplay({ output: false, error: true });
      setBtnDisplay(true);
      setIde({
        ...ide,
        error: error.response?.data?.error || error.message,
        output: "",
        time: "",
        space: ""
      });
    }
  };

  const onChange = (value) => {
    setIde({ ...ide, code: value });
  };

  const onClickHandler = () => {
    setIde({ output: "", args: "", language: ide.language, code: "", time: "", space: "", error: "" });
    setDisplay({ output: false, error: false });
    setBtnDisplay(null);
  };

  return (
    <div className="app">
      <center>
        <h2>Code & Compile</h2>
        <div className="container">
          <div className="performance-metrics">
            <select name="language" onChange={onChangeHandler} className="dropdown">
              <option value="">Language</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="js">JavaScript</option>
              <option value="bash">Bash</option>
              <option value="ruby">Ruby</option>
            </select>
            <select name="theme" onChange={onChangeHandler} className="dropdown">
              <option value="">Theme</option>
              <option value="monokai">Monokai</option>
              <option value="github">GitHub</option>
              <option value="terminal">Terminal</option>
              <option value="xcode">Xcode</option>
              <option value="twilight">Twilight</option>
            </select>
          </div>
          <form onSubmit={onSubmitHandler}>
            <AceEditor
              mode={ide.mode}
              theme={ide.theme}
              onChange={onChange}
              showGutter={true}
              showPrintMargin={false}
              highlightActiveLine={true}
              fontSize={14}
              name="code"
              value={ide.code}
              editorProps={{ $blockScrolling: true, cursorStyle: 'smooth', mergeUndoDeltas: 'always' }}
              style={{ width: "100%", height: "300px" }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                enableSnippets: false,
                useWorker: false,
                tabSize: 4,
              }}
            />
            <div className="performance-metrics">
              <input type="text" name="args" value={ide.args} placeholder="Enter command line args if any" onChange={onChangeHandler} className="input-field" />
              <input type="text" value={ide.time} placeholder="Time complexity" readOnly className="input-field" />
              <input type="text" value={ide.space} placeholder="Space complexity" readOnly className="input-field" />
            </div>
            {display.output && <textarea cols={15} rows={8} className="output" value={ide.output} placeholder="Output" readOnly></textarea>}
            {display.error && <textarea cols={15} rows={8} className="error" value={ide.error} placeholder="Error" readOnly></textarea>}
            <div className="submit-container">
              <input type="submit" value="Compile" className="submit-btn" />
              {loading && <Loading />}   {btnDisplay && (
            <div className="btn-container">
              <button onClick={onClickHandler} className="clear-btn">Clear</button>
            </div>
          )}
            </div>
          </form>
        </div>
      </center>
    </div>
  );
}

export default App;
