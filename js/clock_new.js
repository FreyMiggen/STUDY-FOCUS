document.addEventListener('DOMContentLoaded',() =>{
    

    const countdownElement = document.querySelector('.countdown');
    const startButton = document.querySelector('.btn-start');
    const pauseButton = document.querySelector('.btn-pause');
    const resetButton = document.querySelector('.btn-reset');

    const bellButton = document.getElementById('bell-toggle');
    const bellIcon = document.getElementById('bell-icon');
    const audioBell = document.getElementById('ring-alarm');
    let DURATION = 0.5*60; // default duration
    let bellInterval;

    // Load alarm audio
    audioBell.src = 'audio/alarm_repeated.wav';
    console.log('KIM');

    // WHEN THE BELL IS RINGING, CHANGE THE COLOR OF THE BELL FROM BLACK->YELLOW  REPEATEDLY 
    audioBell.onended =()=>{
        if (bellInterval){
            clearInterval(bellInterval);
            bellIcon.style.color = 'black';

        }

    }

    window.addEventListener('durationChanged',(e)=>{
        DURATION = e.detail.duration; // update duration
        resetCountDown();
    })



    // if ('service' in navigator){
    //     navigator.serviceWorker.register('js/sw.js')
    //     .then(reg => console.log('Service Worker registered')
    //     .catch(err=> console.log('SW registration failed: ',err)));
    // }

    function startBellColorToggle(bellIcon) {
        // alternating the color of the alarm clock
        let isYellow = false; // Local state
        return setInterval(() => {
            bellIcon.style.backgroundColor = isYellow ? "transparent" : "rgb(227, 136, 66)";
            isYellow = !isYellow;
        }, 250);
    }

    bellButton.addEventListener('click', () => {
        console.log('ALARM BELL CLICKED!');
        if (!audioBell.paused) {
            audioBell.pause();
            bellIcon.style.backgroundColor="transparent";
            if (bellInterval) {
                clearInterval(bellInterval)
                bellIcon.style.color = 'black';
                
            }
          
            audioBell.currentTime = 0; // Reset to start
            // bellButton.querySelector('i').classList.remove('fa-bell-slash');
            // bellButton.querySelector('i').classList.add('fa-bell');
        } else {
            audioBell.play().catch(err => {
                console.log(`Alarm playback error: ${err.message}`);
            });
            bellInterval = startBellColorToggle(bellIcon);

            // bellButton.querySelector('i').classList.remove('fa-bell');
            // bellButton.querySelector('i').classList.add('fa-bell-slash');
        }
    });


    let timerInterval;
    let timeLeft = DURATION; // 25 minutes in seconds
    let countdownStartTime;

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // TOTORO MOVING
    const grass = document.querySelector('.grass');
    const totoro = document.querySelector('.totoro');

    const grassWidth = grass.offsetWidth;
    const totoroWidth = totoro.offsetWidth;
    const travelDistance = grassWidth - totoroWidth;

    const animationName = 'moveTotoro';
    const keyframes = `
        @keyframes ${animationName} {
            from {
                left:0;
                }
            to {
                left: ${travelDistance}px;
                }
        
        }`;
    

    // Add keyframes to the document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    let totoroStarted = false;
    let isPause = false;
    let timeOffset = 0;

    // END CODE FOR DEFINING ELEMENTS NEEDED FOR TOTORO


    function startCountdown() {
        console.log('START COUNTDOWN!');
        if (timerInterval) return; // Prevent multiple intervals
        countdownStartTime = Date.now();
        startButton.disabled = true;
        pauseButton.disabled = false;
        resetButton.disabled = false;
        // move totoro
        if (!totoroStarted){
            // Apply animation to totoro
            totoro.style.animation = `${animationName} ${DURATION}s linear forwards`;
            totoroStarted = true;

        } else {
            // resume animation
            totoro.style.animationPlayState = 'running';
        }

        timerInterval = setInterval(() => {
            const elapseSeconds = Math.floor((Date.now()-countdownStartTime)/1000);
            timeLeft = Math.max(DURATION - elapseSeconds-timeOffset,0);
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                startButton.disabled = false;
                pauseButton.disabled = true;
                timerInterval = null;
                startButton.textContent = 'START';
            
                // ring the bell
                if (audioBell.paused){
                    audioBell.play().catch(err=>{
                        console.error('ERROR WHEN PLAYBACK RINGING BELL!')
                    })

                    bellInterval = startBellColorToggle(bellIcon);
                    
                }
                


                // move Totoro to the left edge
                setTimeout(()=>{
                    totoro.style.animation = 'none';
                    totoro.style.left = '0px';
                    totoroStarted = false;

                },8000);

                setTimeout(()=>{
                    timeLeft = DURATION;
                    updateDisplay();
                    console.log('SET CLOCK COLOR BBACK TO NONE')
                    bellIcon.style.backgroundColor = 'none';
                },9000);

                

            }
        }, 500);
    }

    function pauseCountdown(){
        console.log('PAUSE COUNTDOWN!');

        // pause totoro
        totoro.style.animationPlayState = 'paused';
        isPause = true;
        timeOffset = Math.floor((Date.now()-countdownStartTime)/1000);
        if (timerInterval) {
            // clear
            clearInterval(timerInterval);
            timerInterval = null;
            startButton.disabled = false;
            pauseButton.disabled = true;
            startButton.textContent = 'RESUME';
        }
    }

    function resetCountDown(){
        console.log('RESET COUNTDOWN');
        timeOffset = 0;
        startButton.disabled = false;
        pauseButton.disabled = true;
        resetButton.disabled = true;

        // // clear coundown
        if (timerInterval){
            clearInterval(timerInterval);

            startButton.textContent = 'START';
            timerInterval = null;
            
        } 
        // reset totoro
        totoroStarted = false;
        totoro.style.animation = null;
        totoro.style.left = 0;

        // reset timer
        timeLeft = DURATION;
        updateDisplay();
        
    }


    startButton.addEventListener('click', startCountdown);
    pauseButton.addEventListener('click',pauseCountdown);
    resetButton.addEventListener('click',resetCountDown);
    updateDisplay(); // Initialize display

 

})
