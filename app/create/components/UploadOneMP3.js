import React, { useState } from 'react';

const UploadOneMP3 = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload-one-mp3', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully.');
      } else {
        console.error('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
        <h1> Upload One MP3</h1>
        <input type="file" accept=".mp3" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadOneMP3;
