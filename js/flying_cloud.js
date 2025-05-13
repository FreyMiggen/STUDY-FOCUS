document.addEventListener('DOMContentLoaded', () => {
    const cloudBunch = document.querySelector('.cloud-flying');
    let cloudWidth = cloudBunch.getBoundingClientRect().width; // 
    // Variable position: leftest point of the flying cloud
    let position = 0; // 
    console.log(`INITIAL POSITION: ${position}`);
    console.log(`CLOUD WIDTH: ${cloudWidth}`);
    const speed = 0.01; // Pixels per frame

    function moveCloud() {
        const windowWidth = window.innerWidth;
        position += speed;
        console.log(`POSITION: ${position}`);
        // When the cloud left edge reach the screen right side -> set position to -cloudWidth 
        if (position >= windowWidth) {
            position = -cloudWidth; // Right edge at -cloudWidth
        }
        cloudBunch.style.left = `${position}px`;
        requestAnimationFrame(moveCloud);
    }

    requestAnimationFrame(moveCloud);

    window.addEventListener('resize', () => {
        const windowWidth = window.innerWidth;
        const newCloudWidth = cloudBunch.getBoundingClientRect().width;
        // Adjust position to preserve center position
       
        position = 0;
        cloudWidth = newCloudWidth; // Update cloudWidth
        if (position >= windowWidth) {
            position = -newCloudWidth;
        }
        cloudBunch.style.left = `${position}px`;
    });
});