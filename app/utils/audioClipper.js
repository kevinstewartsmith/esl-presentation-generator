function audioClipper(mp3FileData){

// Create an audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Fetch the MP3 file
fetch(mp3FileData.link)
  .then(response => response.arrayBuffer())
  .then(buffer => audioContext.decodeAudioData(buffer))
  .then(decodedAudio => {
    // Create a buffer source node
    const source = audioContext.createBufferSource();
    source.buffer = decodedAudio;

    // Set the start and end time to trim the audio (in seconds)
    const startTime = mp3FileData.startTime; // Example start time
    const endTime = mp3FileData.endTime; // Example end time

    // Create a new AudioBuffer to hold the trimmed audio
    const duration = endTime - startTime;
    const newBuffer = audioContext.createBuffer(
      decodedAudio.numberOfChannels,
      duration * decodedAudio.sampleRate,
      decodedAudio.sampleRate
    );

    // Copy the trimmed portion into the new buffer
    for (let channel = 0; channel < decodedAudio.numberOfChannels; channel++) {
      const channelData = decodedAudio.getChannelData(channel);
      const newData = newBuffer.getChannelData(channel);
      for (let i = startTime * decodedAudio.sampleRate, j = 0; i < endTime * decodedAudio.sampleRate; i++, j++) {
        newData[j] = channelData[i];
      }
    }

    // Create a new buffer source node for the trimmed audio
    const trimmedSource = audioContext.createBufferSource();
    trimmedSource.buffer = newBuffer;
    trimmedSource.connect(audioContext.destination);
    trimmedSource.start();
  })
  .catch(error => console.error('Error loading audio file:', error));
}

export default audioClipper