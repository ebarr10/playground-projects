const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const speed = document.querySelector('.player-speed');
const fullscreenBtn = document.querySelector('.fullscreen')

// Play & Pause ----------------------------------- //

function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
    }
    else {
        video.pause();
        showPlayIcon();
    }
}

// On Video End, show play button icon
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${displayTime(video.currentTime)} /`;
    duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;

function changeVolumeIcon(volume) {
    // Change icon depending on volume
    volumeIcon.className = '';
    if (volume > 0.7) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    }
    else if (volume < 0.7 && volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    }
    else if (volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-mute');
    }
    
    lastVolume = video.volume;
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;
}

// Volume Bar
function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;
    // Rounding volume up or down
    if (volume < 0.1) {
        volume = 0;
    }
    else if (volume > 0.9) {
        volume = 1;
    }

    changeVolumeIcon(volume);
}

// Mute / Unmute
function toggleMute() {
    volumeIcon.className = '';
    if (video.volume) {
        changeVolumeIcon(0);
        volumeIcon.setAttribute('title', 'Unmute');
    }
    else {
        changeVolumeIcon(lastVolume);
        volumeIcon.setAttribute('title', 'Mute');
    }
}

// Change Playback Speed -------------------- //

function changeSpeed() {
    video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //

// View in full screen
function openFullScreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    else if (elem.mozRequestFullScreen) {   // Firefox
        elem.mozRequestFullScreen();
    }
    else if (elem.webkitRequestFullScreen) {    // Chrome, Safari, and Opera
        elem.webkitRequestFullScreen();
    }
    else if (elem.msRequestFullScreen) {    // IE/Edge
        elem.msRequestFullScreen();
    }

    video.classList.add('video-fullscreen');
}

// Close Fullscreen
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {    // Firefox
        document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {   // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen) {   // IE/Edge
        document.msExitFullscreen();
    }

    video.classList.remove('video-fullscreen');
}

let fullscreen = false;

// Toggle Fullscreen
function toggleFullscreen() {
    !fullscreen ? openFullScreen(player) : closeFullscreen();
    fullscreen = !fullscreen;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);