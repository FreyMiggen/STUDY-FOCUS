// USE MEDIA SOURCE EXTENSIONS API FOR STREAMING AUDIO IN CHUNKS

document.addEventListener('DOMContentLoaded',()=>{
    const audio = document.getElementById('audio-player');
// document.body.appendChild(audio);

const discIcon = document.getElementById('disc-icon');
const discCtrlBtn = document.getElementById('disc-control');

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

// Apply animation
discIcon.style.animation = `${animationDiscName} 5s linear infinite`


// 2. create a new MediaSource object, which lets
// you dynamically feed audio data chunk into <audio> element
const mediaSource = new MediaSource();
// 3. create a temp object URL from the MediaSource object, then
// sets it as the source of the <audio> player
audio.src = URL.createObjectURL(mediaSource);

const musicToggle = document.getElementById('music-toggle');

let currentChunk = 0;
const chunks = ['chunk0.mp3','chunk1.mp3', 'chunk2.mp3', 'chunk3.mp3','chunk4.mp3','chunk5.mp3','chunk6.mp3','chunk7.mp3',
    'chunk8.mp3','chunk9.mp3','chunk10.mp3','chunk11.mp3'
];
const chunkDuration = 10;
let currentTime = 0;
const keepBufferWindow = 30;

// Toggle play/pause on icon click

audio.addEventListener('play', () => {
    musicToggle.querySelector('i').classList.remove('fa-play');
    musicToggle.querySelector('i').classList.add('fa-pause');
});
audio.addEventListener('pause', () => {
    musicToggle.querySelector('i').classList.remove('fa-pause');
    musicToggle.querySelector('i').classList.add('fa-play');
});

audio.oneerror = () => console.error("AUDIO PLAYBACK ERROR: ",audio.error);
audio.onended = () => URL.revokeObjectURL(audio.src);

mediaSource.addEventListener('sourceopen',() =>{
    // 4. create a memory buffer inside MediaSource object
    // where you will add binary audio data to
    // audio/mpeg tells the browser the expected audio format
    const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');


    // APPEND NEXT CHUNK
    sourceBuffer.addEventListener('updateend',() =>{

        if (currentChunk < chunks.length){
            fetch(`audio/test_folder/${chunks[currentChunk]}`)
            .then(res=> res.arrayBuffer())
            .then(data => {
                if (!sourceBuffer.updating){
                    sourceBuffer.appendBuffer(data);
                    console.log(`CHUNK ${currentChunk} LOADED SUCCESSFULLY!`);
                    currentChunk++;
                    
                } else {
                    setTimeout(() => sourceBuffer.appendBuffer(data),100);
                }
            })
            .catch(err => console.error('FETCH ERROR: ',err));
        } else {
            mediaSource.endOfStream();
        }


    });

    // PERIODIC BUFFER EVICTION
    const evictionInterval = setInterval(() =>{

        const bufferedStart = sourceBuffer.buffered.start(0);
        // calculate the chunk that contains the current playing data
        const currentDataChunk = Math.floor(audio.currentTime/chunkDuration); 
        if (currentDataChunk*chunkDuration - keepBufferWindow > bufferedStart  ){
            const removeBefore = currentDataChunk*chunkDuration - keepBufferWindow;

            try {
                if (!sourceBuffer.updating){
                    sourceBuffer.remove(bufferedStart,removeBefore);
                    console.log(`DELETED MUSIC FROM ${bufferedStart} to ${removeBefore}`);

                } else {
                    // Defer if updating
                    setTimeout(() => sourceBuffer.remove(bufferedStart,removeBefore),100);
                }
                
            } catch (e) {
                console.warn(f`ERROR REMOVING BUFFER FROM ${bufferedStart} to ${removeBefore}`);
            }


        }

    },1000)

    // CLEANUP
    mediaSource.addEventListener('sourceended',()=>clearInterval(evictionInterval));


    // KICK OFF FIRST CHUNK

    fetch(`audio/test_folder/${chunks[currentChunk]}`)
    .then(res => res.arrayBuffer())
    .then(data =>{
        if (!sourceBuffer.updating){
            sourceBuffer.appendBuffer(data);
            currentChunk++;
            console.log(`CHUNK ${currentChunk-1} LOADED SUCCESSFULLY!`);
            
        }
    })
    .catch(err => console.error("ERROR LOADING FIRST MUSIC CHUNK!"));

})

})
