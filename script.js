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
    galleryElement.style.position = 'relative';
    galleryElement.style.left = '-500px'
    galleryElement.style.cursor = 'grab';

    // set up gallery item properties
    const galleryContentArray = Array.from(galleryElement.children);
    galleryContentArray.map( (item) => {
        // set proporties of each item 
        item.style.width = '70vw';
        item.style.height = '80vh';
        item.style.backgroundColor = "white";
        item.style.margin = '10px';
        item.style.flexShrink = '0';
        item.style.position = 'relative';
        item.style.overflow = 'hidden'
        item.style.color = 'black';

        // create grey-out div that hides the outter elements
        let darkenerElement = document.createElement('div');
        darkenerElement.style.width = '100%';
        darkenerElement.style.height = '100%';
        darkenerElement.style.top = '0'
        darkenerElement.style.left = '0'
        darkenerElement.style.zIndex = '4';
        darkenerElement.style.backgroundColor = 'black';
        darkenerElement.style.opacity = '0.5';
        darkenerElement.style.transition = 'opacity 1s ease-in-out';
        darkenerElement.style.position = 'absolute';
        darkenerElement.classList.add('darkener');
        // add darkener element to gallery item
        item.appendChild(darkenerElement);
    });

    // grab elements and move them left and right to explore 
    const addGrabbingEffect = () => {
        // initialise variables for click and drag effect
        let isDragging = false;
        let startX;
        let startingLeft;
        
        // add effect that grabs the gallery item
        galleryElement.addEventListener('mousedown', (event) => {
            isDragging = true;
            startX = event.pageX;
            startingLeft = galleryElement.getBoundingClientRect().left;
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
            const deltaX = (x - startX) * 1.4;
            galleryElement.style.left = startingLeft + deltaX + 'px';
            darkenOuterElements();
            
            if (galleryElement.getBoundingClientRect().left > -250) { 
                moveFirstItemToEnd();
                //startX = event.pageX;
            }
            if (galleryElement.getBoundingClientRect().right < window.innerWidth + 250) {
                moveLastItemToStart();
                //startX = event.pageX;
            } 
        });
    }
    addGrabbingEffect();
    darkenOuterElements();
}


const darkenOuterElements = () => {
    const galleryElement = document.getElementById('galleryOne');
    const galleryContentArray = Array.from(galleryElement.children);
    const middleX = window.innerWidth / 2;

    // find the item closest to the middle
    let middlestElement;
    let smallestDistance;
    galleryContentArray.forEach(item => {
        // needed properties of the items 
        const itemRect = item.getBoundingClientRect();
        const itemMiddle = itemRect.left + itemRect.width / 2;
        const distanceToMiddle = Math.abs(middleX - itemMiddle);
        //console.log(`itemMiddle: ${itemMiddle} and middleX: ${middleX}`);
        if (!middlestElement || distanceToMiddle < smallestDistance) {
            smallestDistance = distanceToMiddle;
            middlestElement = item;
        }
        else {
        }
    });

    // make all the elements dark by changing opacity 
    galleryContentArray.forEach(item => {
        let darkenerElement = item.querySelector('.darkener');
        darkenerElement.style.opacity = '0.5';
    });
    // undarken the middle element
    middlestElement.querySelector('.darkener').style.opacity = '0';
}

const moveFirstItemToEnd = () => {
    const galleryElement = document.getElementById('galleryOne');
    if (galleryElement.children.length > 1) {
        const firstItem = galleryElement.children[0];
        const itemWidth = firstItem.offsetWidth; // Width of the item
        const itemMargin = parseInt(window.getComputedStyle(firstItem).marginLeft) + parseInt(window.getComputedStyle(firstItem).marginRight);

        // Adjust the left position to compensate for the moved item
        const currentLeft = parseInt(galleryElement.style.left, 10);
        galleryElement.style.left = (currentLeft - itemWidth - itemMargin) + 'px';

        // Move the item
        galleryElement.appendChild(firstItem);

        // Need to return a number to adjust where the grab coords are
        return itemWidth + itemMargin;
    }
};

const moveLastItemToStart = () => {
    const galleryElement = document.getElementById('galleryOne');
    if (galleryElement.children.length > 1) {
        const lastItem = galleryElement.children[galleryElement.children.length - 1];
        const itemWidth = lastItem.offsetWidth; // Width of the item
        const itemMargin = parseInt(window.getComputedStyle(lastItem).marginLeft) + parseInt(window.getComputedStyle(lastItem).marginRight);

        // Adjust the left position to compensate for the moved item
        const currentLeft = parseInt(galleryElement.style.left, 10);
        galleryElement.style.left = (currentLeft + itemWidth + itemMargin) + 'px';

        // Move the item
        galleryElement.insertBefore(lastItem, galleryElement.firstChild);

        // Need to return a number to adjust where the grab coords are
        return itemWidth + itemMargin;
    }
};

createGallery('galleryOne');

