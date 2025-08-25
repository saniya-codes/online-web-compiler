import loadingGif from "../loading.gif"

function Loading() {
    return (
        <center>
            <img src={loadingGif} style={{ width: "50px", height: "50px" }}></img>
        </center>
    )
}

export default Loading