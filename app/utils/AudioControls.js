export function playAudioFile(audioBuffer) {
    
    const audioContext = new AudioContext();
    const audioSource = audioContext.createBufferSource();
    audioContext.decodeAudioData(audioBuffer, (buffer) => {
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        audioSource.start(0);
    });

}

export function playAudioFileClip(audioData, startTime = 0, endTime = null) {
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(audioData, (decodedData) => {
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = decodedData;

        // Set the playback parameters
        audioSource.connect(audioContext.destination);
        audioSource.start(0, startTime, endTime ? (endTime - startTime) : undefined); // endTime is optional
        
        // Stop the playback if endTime is specified
        if (endTime !== null && endTime !== undefined) {
            audioSource.stop(audioContext.currentTime + (endTime - startTime));
        }

           // Download the audio clip as MP3
           downloadAudioClip(decodedData);
    }, (error) => {
        console.error('Error decoding audio data:', error);
    });
}


function downloadAudioClip(decodedData) {
    const audioBlob = new Blob([decodedData], { type: 'audio/mp3' });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio_clip.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


