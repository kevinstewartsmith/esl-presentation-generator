import { useEffect, useContext, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AudioTextContext } from "../contexts/AudioTextContext";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import IconButton from "@mui/material/IconButton";
import { playAudioFile } from "@app/utils/AudioControls";
import { Grid } from "@mui/material";
import { saveFile, deleteFile } from "@app/utils/IndexedDBWrapper";
import { useLessonStore } from "@app/stores/UseLessonStore";

function AudioTable(props) {
  const { updateAudioFileName } = useLessonStore();
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
      //Save the selected audio file to IndexedDB
      if (bucketContents && bucketContents[newSelection[0] - 1]) {
        const fileName = bucketContents[newSelection[0] - 1];
        fetch(`/api/audio?name=${fileName}`)
          .then((response) => response.blob())
          .then((blob) => {
            saveFile(fileName, blob)
              .then(() => {
                console.log(`File ${fileName} saved to IndexedDB.`);
                // Update completeListeningStageData with the audio file name
                updateAudioFileName(fileName);
              })
              .catch((error) => {
                console.error("Error saving file to IndexedDB:", error);
              });
            //update completeListeningStageData with the audio file name
            // updateCompleteListeningStageData((prevData) => ({
            //   ...prevData,
            //   audioFileName: fileName,
            // }));
          })
          .catch((error) => {
            console.error("Error fetching audio file:", error);
          });
      }
    } else {
      setSelectedRow(null);
      console.log("Selected row cleared");
      //Delete the selected audio file from IndexedDB
      if (selectedAudioFileName) {
        deleteFile(selectedAudioFileName)
          .then(() => {
            console.log(
              `File ${selectedAudioFileName} deleted from IndexedDB.`
            );
          })
          .catch((error) => {
            console.error("Error deleting file from IndexedDB:", error);
          });
      }
      updateSelectedAudioFileName(null);
      updateFullAudioBuffer(null);
      // updateCompleteListeningStageData((prevData) => ({
      //   ...prevData,
      //   audioFileName: "",
      // }));
      console.log("Selected audio file name cleared");
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
    <>
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
    </>
  );
}

export default AudioTable;
