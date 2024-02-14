import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

function SnippetPlayer({ index }) {

    function playSnippetClicked() {
        
        console.log(index);
    }

    return (
        <div style={{ backgroundColor: "transparent", width: "100px", height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }} onClick={playSnippetClicked} value={index}>
            <PlayCircleFilledWhiteIcon style={{ width: "100%", height: "100%" }} />
        </div>
    )
}

export default SnippetPlayer