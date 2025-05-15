document.addEventListener('DOMContentLoaded',() =>{
    

    const countdownElement = document.querySelector('.countdown');
    const startButton = document.querySelector('.btn-start');
    const pauseButton = document.querySelector('.btn-pause');

    const bellButton = document.getElementById('bell-toggle');
    const bellIcon = document.getElementById('bell-icon');
    const audioBell = document.getElementById('ring-alarm');
    const DURATION = 30*60;
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

    function startBellColorToggle(bellIcon) {
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

    // END CODE FOR DEFINING ELEMENTS NEEDED FOR TOTORO


    function startCountdown() {
        console.log('START COUNTDOWN!');
        if (timerInterval) return; // Prevent multiple intervals
        countdownStartTime = Date.now();
        startButton.disabled = true;
        pauseButton.disabled = false;
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
            timeLeft = Math.max(DURATION - elapseSeconds,0);
            updateDisplay();
            if (timeLeft <= 0) {
                
                clearInterval(timerInterval);
                startButton.disabled = false;
                pauseButton.disabled = true;
                timerInterval = null;
                timeLeft = DURATION;
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

                },8000)


            }
        }, 500);
    }

    function pauseCountdown(){
        console.log('PAUSE COUNTDOWN!');

        // pause totoro
        totoro.style.animationPlayState = 'paused';

        if (timerInterval) {
            // clear
            clearInterval(timerInterval);
            timerInterval = null;
            startButton.disabled = false;
            pauseButton.disabled = true;
            startButton.textContent = 'RESUME';
        }
    }



    startButton.addEventListener('click', startCountdown);
    pauseButton.addEventListener('click',pauseCountdown);
    updateDisplay(); // Initialize display

 

})
