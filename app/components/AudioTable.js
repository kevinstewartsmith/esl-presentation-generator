import { useEffect, useContext, useState }  from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { AudioTextContext } from '../contexts/AudioTextContext';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import IconButton from '@mui/material/IconButton';

function AudioTable(props) {
    const {bucketContents, updateBucketContents, selectedAudioFileName, updateSelectedAudioFileName } = useContext(AudioTextContext);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowSelectionChange = (newSelection) => {
        if (newSelection.length > 0) {
          setSelectedRow(newSelection[0]);
          bucketContents ? updateSelectedAudioFileName(bucketContents[newSelection[0] - 1]) : null
        } else {
          setSelectedRow(null);
        }
      };

    useEffect(() => {
        async function getBucketContents() {
          const response = await fetch("/api/get-audio-bucket-info");
          const data = await response.json()
          console.log(data[0][0]);
          updateBucketContents(data)
        }
        getBucketContents();
      }, []);

      async function playAudio(name) {
        console.log('Row Data:', name);
        try {
            const response = await fetch(`/api/audio?name=${name}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch audio file');
            }
            
            const audioBuffer = await response.arrayBuffer();
            const audioContext = new AudioContext();
            const audioSource = audioContext.createBufferSource();
            audioContext.decodeAudioData(audioBuffer, (buffer) => {
                audioSource.buffer = buffer;
                audioSource.connect(audioContext.destination);
                audioSource.start(0);
            });
        } catch (error) {
            console.error('Error playing audio:', error);
        }
      }

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "fileName", headerName: "File name", width: 190 },
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
          valueGetter: (params) =>
            `${params.row.fileName || ""} `,
        },
        {
            field: 'audio',
            headerName: 'Audio',
            width: 120,
            renderCell: (params) => (
              <IconButton
                onClick={
                    () => {
                        // Handle icon button click here, you can access row data using params.row
                        playAudio(params.row.fileName)
                        //console.log('Row Data:', params.row.fileName);
                    }
                }
              >
                <PlayCircleFilledWhiteIcon />
              </IconButton>
            ),
        }
      ];
      
      
    const rows = bucketContents ? bucketContents.map((item, idx) => ({
        id: idx + 1,
        lastName: "pimp",
        fileName: item,
        type: "NA",
        size: " - "
 
    })) : [];





  return (
    <div style={{ height: 400, width: "100%" , backgroundColor: "white"}}>
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
    <h1> api:{bucketContents}</h1>
    <h1> selected bucket: {selectedAudioFileName}</h1>
    <h1>{selectedRow}</h1>
    <br></br>
    <br></br>
  </div>
  
  )
}

export default AudioTable