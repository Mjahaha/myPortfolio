import { Blobby } from './javascript/blobby.js';

// Create and display blobby 
//new Blobby(["navBarInHeader", "headerLogo"]);
new Blobby(["websiteIntroduction"]);

// make logo flicker in and out 
const myLogo = document.getElementById("headerLogo"); 
const flickerLogo = () => {
    myLogo.style.fontFamily = "Rubik Glitch";

    setTimeout( () => {
        myLogo.style.fontFamily = "Rubik"
    }, 100);
}
setInterval(flickerLogo, 2000);
// Function to handle the rapid flickering
const rapidFlicker = () => {
    for (let i = 0; i < 2; i++) {
        setTimeout(flickerLogo, i * 200);
    }
};

// Start the rapid flickering after 4 seconds
setInterval(rapidFlicker, 3800);