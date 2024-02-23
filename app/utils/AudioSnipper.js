export async function createAudioSlice(arrayBuffer, startTime, endTime) {
    try {
    //   const response = await fetch(audioURL);
    //   const arrayBuffer = await response.arrayBuffer();

      // Audio processing logic
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);

      // Trim the audio (example: from 10 seconds to 20 seconds)
      //const startTime = 10;
      //const endTime = 20;
      const duration = endTime - startTime;

      const newBuffer = audioContext.createBuffer(
        decodedAudio.numberOfChannels,
        duration * decodedAudio.sampleRate,
        decodedAudio.sampleRate
      );

      for (let channel = 0; channel < decodedAudio.numberOfChannels; channel++) {
        const channelData = decodedAudio.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        for (let i = startTime * decodedAudio.sampleRate, j = 0; i < endTime * decodedAudio.sampleRate; i++, j++) {
          newData[j] = channelData[i];
        }
      }

      // Convert the trimmed audio buffer to MP3
      const audioBlob = await new Promise((resolve) => {
        newBufferToMP3(newBuffer, resolve);
      });

      // Set the trimmed audio blob to state
      //setTrimmedBlob(audioBlob);
      return audioBlob
    } catch (error) {
      console.error('Error fetching or processing audio:', error);
    }
  };

  const newBufferToMP3 = (buffer, callback) => {
    const mimeType = 'audio/mp3';
    const bitRate = 128;

    // Use the lamejs library (imported in the component) to encode the audio buffer to MP3
    const lame = require('lamejs');
    const mp3encoder = new lame.Mp3Encoder(2, buffer.sampleRate, bitRate);

    const interleaved = [];
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        interleaved.push(buffer.getChannelData(channel)[i]);
      }
    }

    const samples = new Int16Array(interleaved.map((n) => n * 32767));
    const mp3Data = [];
    const sampleBlockSize = 1152;
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const sampleChunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(new Int8Array(mp3buf));
    }

    const blob = new Blob(mp3Data, { type: mimeType });
    callback(blob);
  };

  