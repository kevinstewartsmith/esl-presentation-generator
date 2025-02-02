import { useEffect, useContext, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AudioTextContext } from "../contexts/AudioTextContext";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import IconButton from "@mui/material/IconButton";
import { playAudioFile } from "@app/utils/AudioControls";
import { Grid } from "@mui/material";

function AudioTable(props) {
  const {
    bucketContents,
    updateBucketContents,
    selectedAudioFileName,
    updateSelectedAudioFileName,
    fullAudioBuffer,
    updateFullAudioBuffer,
  } = useContext(AudioTextContext);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowSelectionChange = (newSelection) => {
    if (newSelection.length > 0) {
      setSelectedRow(newSelection[0]);
      bucketContents
        ? updateSelectedAudioFileName(bucketContents[newSelection[0] - 1])
        : null;
    } else {
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    async function getBucketContents() {
      const response = await fetch("/api/get-audio-bucket-info");
      const data = await response.json();
      console.log(data[0][0]);
      updateBucketContents(data);
    }
    getBucketContents();
  }, []);

  async function playAudio(name) {
    console.log("Row Data:", name);
    try {
      const response = await fetch(`/api/audio?name=${name}`);

      if (!response.ok) {
        throw new Error("Failed to fetch audio file");
      }

      const audioBuffer = await response.arrayBuffer();
      playAudioFile(audioBuffer);
      // const audioContext = new AudioContext();
      // const audioSource = audioContext.createBufferSource();
      // audioContext.decodeAudioData(audioBuffer, (buffer) => {
      //     audioSource.buffer = buffer;
      //     audioSource.connect(audioContext.destination);
      //     audioSource.start(0);
      // });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fileName", headerName: "File name", width: 300 },
    { field: "size", headerName: "Size", width: 130 },
    { field: "length", headerName: "Length", width: 130 },
    {
      field: "type",
      headerName: "File Type",
      width: 130,
    },
    {
      field: "transcript",
      headerName: "Transcript",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 190,
      valueGetter: (params) => `${params.row.fileName || ""} `,
    },
    {
      field: "audio",
      headerName: "Audio",
      width: 120,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            // Handle icon button click here, you can access row data using params.row
            playAudio(params.row.fileName);
            //console.log('Row Data:', params.row.fileName);
          }}
        >
          <PlayCircleFilledWhiteIcon />
        </IconButton>
      ),
    },
  ];

  const rows = bucketContents
    ? bucketContents.map((item, idx) => ({
        id: idx + 1,
        lastName: "pimp",
        fileName: item,
        type: "NA",
        size: " - ",
      }))
    : [];

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      height={650}
    >
      <Grid item xs={12}>
        <div
          style={{
            height: "80%",
            width: 600,
            backgroundColor: "white",
            borderColor: "black",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedRow !== null ? [selectedRow] : []}
            onRowSelectionModelChange={handleRowSelectionChange}
          />
          <div
            style={{
              height: "20%",
              width: 600,
              backgroundColor: "white",
              borderColor: "black",
              overflow: "auto",
            }}
          >
            <h1> api:{bucketContents}</h1>
            <h1> selected bucket: {selectedAudioFileName}</h1>
            <h1>{selectedRow}</h1>
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <div
          style={{
            height: "100%",
            width: 600,
            backgroundColor: "white",
            borderColor: "black",
          }}
        >
          <h1>Audio Player</h1>
        </div>
      </Grid>
    </Grid>
  );
}

export default AudioTable;
