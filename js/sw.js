self.addEventListener('message',(event)=>{
    if (event.data.type == 'START_TIMER'){
        const endTime = Date.now() + event.data.duration;
        // store end time for later checks
        self.endTime = endTime;
        checkTimer();
    }
});

function checkTimer() {
  if (Date.now() >= self.endTime) {
    // Timer expired! Show notification.
    self.registration.showNotification("⏰ Time's up!", {
      body: "Your Pomodoro session is complete!",
      vibrate: [200, 100, 200] // Vibration pattern (mobile)
    });
  } else {
    // Check again in 1 second
    setTimeout(checkTimer, 1000);
  }
}