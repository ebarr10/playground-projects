const videoElement = document.getElementById("video");
const button = document.getElementById("button");
const buttonContainer = document.getElementById("button-container");
const screenSelect = document.getElementById("screen-select");

// Prompt to select media stream, pass to video element, then play
async function selectMediaStream() {
    try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia();
        videoElement.srcObject = mediaStream;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
        }
    } catch(error) {
        console.error(error);
    }
}

button.addEventListener("click", async () => {
    // Disable Button
    button.disabled = true;

    // Start Picture
    await videoElement.requestPictureInPicture();

    // Reset Button
    button.disabled = false;
});

screenSelect.addEventListener("click", async () => {
    // Disable Screen Select
    screenSelect.disabled = true;

    // Select Screen
    await selectMediaStream();

    // Show Start Button
    buttonContainer.hidden = false;
    screenSelect.disabled = false;
});

// On Load
// selectMediaStream();