document.addEventListener('DOMContentLoaded',()=>{
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    let isSettingsOpen = false;
    const durationInput = document.getElementById('input-duration');
    const durationBtn = document.getElementById('set-duration-btn');

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