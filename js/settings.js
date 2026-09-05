document.addEventListener('DOMContentLoaded',()=>{
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    let isSettingsOpen = false;
    const durationInput = document.getElementById('input-duration');
    const durationBtn = document.getElementById('set-duration-btn');
    const bgSelect = document.getElementById('bg-select');
    const bgBtn = document.getElementById('set-bg-btn');
    const container = document.getElementById('starsContainer');
    const bubbleContainer = document.getElementById('bubblesContainer');

    durationBtn.addEventListener('click',()=>{
        const newDuration = parseInt(durationInput.value)*60;

        // fire a custom event with the new duration
        const durationChangedEvent = new CustomEvent('durationChanged',{
            detail: {
                duration:newDuration
            }
        });

        window.dispatchEvent(durationChangedEvent);
    })

    createBubbles(45); // create bubbles for the default theme
    // Apply background selection and persist; apply on change immediately
    function applyBackground(value){
        if (value){
            document.body.style.backgroundImage = `url('${value}')`;
        } else {
            document.body.style.backgroundImage = '';
        }
    
    }

    function applyTheme(theme){
        if (theme){
            document.documentElement.setAttribute('data-theme', theme);
        }

        if (theme === 'night'){
            createStars(45); // more stars for night theme
        } else {
            container.innerHTML = ''; // clear stars for other themes
        }

        if (theme ==='day'){
            createBubbles(60); // create bubbles for day theme
        } else {
            bubbleContainer.innerHTML = ''; // clear bubbles for other themes
        }
    }


    
    function createStars(count = 45) {
        
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'star-wrapper';

            const star = document.createElement('div');
            star.className = 'star';

            wrapper.appendChild(star);

            const startX = Math.random() * 100; // vw
            const duration = 4 + Math.random() * 5; // 4-9s
            const delay = Math.random() * 8; // stagger start
            const size = 1 + Math.random() * 2; // 1-3px

            // Position/timing go on the WRAPPER (this is what animates/falls)
            wrapper.style.left = `${startX}vw`;
            wrapper.style.animationDuration = `${duration}s`;
            wrapper.style.animationDelay = `${delay}s`;

            // Visual size goes on the STAR itself
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            container.appendChild(wrapper);
        }
    }

    function createBubbles(count = 45){
        bubbleContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'bubble-wrapper';

            const bubble = document.createElement('div');
            bubble.className = 'bubble';

            wrapper.appendChild(bubble);

            const bubbleX = Math.random() * 100;
            const bubbleDuration = 5 + Math.random() * 5;
            const delay = Math.random() * 8;
            const size = 5 + Math.random() * 2; //5-7px

            wrapper.style.left = `${bubbleX}vw`;
            wrapper.style.animationDuration = `${bubbleDuration}s`;
            wrapper.style.animationDelay = `${delay}s`;

            // visual size goes on the bubble itself
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;

            bubbleContainer.appendChild(wrapper);
        }
    }
    if (bgSelect){
   
        // change immediately when user selects a new option
        bgSelect.addEventListener('change', (e)=>{
            
            applyTheme(e.target.value);
        });

        // keep Apply button working if present
        if (bgBtn){
            bgBtn.addEventListener('click', ()=>{
                applyTheme(bgSelect.value);
            });
        }
    }


    // Toggle settings panel
    settingsToggle.addEventListener('click',()=>{
        
        isSettingsOpen = !isSettingsOpen;
        if (isSettingsOpen){
            console.log('OPEN SETTINGS');
            settingsPanel.classList.add('active');
            overlay.classList.add('active');
            // prevent scrolling when settings are open
            document.body.style.overflow ='hidden';
        } else {
            console.log('CLOSE SETTINGS');
            settingsPanel.classList.remove('active');
            overlay.classList.remove('active');

        }
    })

    // Close settings when clicking overlay
    overlay.addEventListener('click',()=>{
        settingsPanel.classList.remove('active');
        overlay.classList.remove('active');
        isSettingsOpen = false;
    })
})