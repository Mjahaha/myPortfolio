import { Blobby } from './javascript/blobby.js';
import { executeFlicker } from './javascript/flickeringText.js';

// using these as inspiration https://yasio.dev/  https://thieb.co/  

// Create and display blobby 
//new Blobby(["navBarInHeader", "headerLogo"]);
new Blobby(["myName"]);
executeFlicker();

const createGallery = (id) => {
    // set up gallery properties
    const galleryElement = document.getElementById(id)
    galleryElement.style.display = 'flex';
    galleryElement.style.position = 'absolute';
    galleryElement.style.left = '-500px'
    galleryElement.style.cursor = 'grab';

    // set up gallery item properties
    const galleryContentArray = Array.from(galleryElement.children);
    galleryContentArray.map( (item) => {
        item.style.width = '70vw';
        item.style.height = '80vh';
        item.style.backgroundColor = "white";
        item.style.margin = '10px';
        item.style.flexShrink = '0';
    });

    // grab elements and move them left and right to explore 
    const addGrabbingEffect = () => {
        // initialise variables for click and drag effect
        let isDragging = false;
        let startX;
        
        // add effect that grabs the gallery item
        galleryElement.addEventListener('mousedown', (event) => {
            isDragging = true;
            startX = event.pageX - galleryElement.offsetLeft;
            galleryElement.style.cursor = 'grabbing';
        });
        
        // stop dragging if the mouse leaves the screen
        galleryElement.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        // let go after grabbing
        galleryElement.addEventListener('mouseup', () => {
            isDragging = false;
            galleryElement.style.cursor = 'grab';
        });
        
        // move gallery while grabbing
        galleryElement.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
            event.preventDefault();
            const x = event.pageX;
            const deltaX = (x - startX) * 0.8;
            galleryElement.style.left = deltaX + 'px';
        });
    }
    addGrabbingEffect();
    
}

createGallery('galleryOne');