// make logo flicker in and out 
const flickerLogo = () => {
    const myLogo = document.getElementById("headerLogo"); 
    myLogo.style.fontFamily = "Rubik Glitch";

    setTimeout( () => {
        myLogo.style.fontFamily = "Rubik"
    }, 100);
}
// Function to handle the rapid flickering
const rapidFlicker = () => {
    for (let i = 0; i < 2; i++) {
        setTimeout(flickerLogo, i * 200);
    }
};

export const executeFlicker = () => {
    // Starts the normal flicker every 2 seconds
    setInterval(flickerLogo, 2000);
    // Start the rapid flickering after 4 seconds
    setInterval(rapidFlicker, 3800);
}