document.getElementById('convertButton').addEventListener('click', async () => {
    const videoInput = document.getElementById('videoInput');
    const formatSelect = document.getElementById('formatSelect');
    const convertButton = document.getElementById('convertButton');
    const output = document.getElementById('output');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadLink = document.getElementById('downloadLink');

    if (videoInput.files.length === 0) {
        alert('Please select a video file first.');
        return;
    }

    const videoFile = videoInput.files[0];
    const format = formatSelect.value;
    convertButton.disabled = true;
    convertButton.textContent = 'Converting...';

    const reader = new FileReader();
    reader.onload = async (event) => {
        const result = event.target.result;
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(result));
        await ffmpeg.run('-i', 'input.mp4', `output.${format}`);
        const data = ffmpeg.FS('readFile', `output.${format}`);
        const audioBlob = new Blob([data.buffer], { type: `audio/${format}` });
        const audioUrl = URL.createObjectURL(audioBlob);

        audioPlayer.src = audioUrl;
        downloadLink.href = audioUrl;
        downloadLink.download = `output.${format}`;
        output.classList.remove('hidden');

        convertButton.disabled = false;
        convertButton.textContent = 'Convert';
    };
    reader.readAsArrayBuffer(videoFile);
});
