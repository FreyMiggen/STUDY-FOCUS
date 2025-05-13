// USE MEDIA SOURCE EXTENSIONS API FOR STREAMING AUDIO IN CHUNKS

document.addEventListener('DOMContentLoaded',()=>{
const audio = document.getElementById('audio-player');
// document.body.appendChild(audio);

// Define music key btn, enable open audio control
const musicCtrlBtn = document.getElementById('music-control');
const musicIcon = document.getElementById('music-key-icon');
let isAudioPlayerVisible = false;



// When musicCtrBtn get clicked, open audio



musicCtrlBtn.addEventListener('click',()=>{
    console.log("HEY!");
    audio.classList.toggle('visible');
})



// Update player position when window is resized
window.addEventListener('resize', function() {
    if (isAudioPlayerVisible) {
         updatePlayerPosition();
    }
 });


const discIcon = document.getElementById('disc-icon');
const discCtrlBtn = document.getElementById('disc-control');
let musicStarted = false;

// Define disc rotation animation
const animationDiscName = 'rotateDisc';
const keyframesDisc =  `
        @keyframes ${animationDiscName} {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
// Add keyframes to document
const styleSheetMusic = document.createElement('style');
styleSheetMusic.textContent = keyframesDisc;
document.head.appendChild(styleSheetMusic);

audio.src = 'audio/study_playlist.mp3';

discCtrlBtn.addEventListener('click',()=>{
    // start spinning the disc
    if (audio.paused){
        // Play music
        audio.play().catch(err=>{
            console.error('ERROR PLAYING MUSIC!')
        })
        // Spinning the disc
        if (!musicStarted){
            // Apply animation
            discIcon.style.animation = `${animationDiscName} 5s linear infinite`
            musicStarted = true;
            
        } else {
            discIcon.style.animationPlayState = 'running'; 
        }

       
    } else {
        // Stop the music
        audio.pause();
        //stop the spinning
        discIcon.style.animationPlayState = 'paused';
        

    }
})

audio.addEventListener('play',()=>{
    if (!musicStarted){
            // Apply animation
            discIcon.style.animation = `${animationDiscName} 5s linear infinite`
            musicStarted = true;
            
    } else {
            discIcon.style.animationPlayState = 'running'; 
    }

})

audio.addEventListener('pause',()=>{
    discIcon.style.animationPlayState = 'paused';

})

audio.oneerror = () => console.error("AUDIO PLAYBACK ERROR: ",audio.error);
audio.onended = () => {
    discIcon.style.animationPlayState = 'paused';

}



})
