document.addEventListener('DOMContentLoaded',()=>{
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

    // apply animation to totoro
    totoro.style.animation = `${animationName} 120s linear forwards`;

})