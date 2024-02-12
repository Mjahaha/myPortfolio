export const createGallery = (id) => {
    // set up gallery properties
    const galleryElement = document.getElementById(id)
    galleryElement.style.display = 'flex';
    galleryElement.style.position = 'relative';
    galleryElement.style.left = '-50px'
    galleryElement.style.cursor = 'grab';

    // set up gallery item properties
    const galleryContentArray = Array.from(galleryElement.children);
    galleryContentArray.map( (item) => {
        // set proporties of each item 
        item.style.width = '70vw';
        item.style.height = '80vh';
        item.style.backgroundColor = "rgb(37,37,37)";
        item.style.margin = '10px';
        item.style.flexShrink = '0';
        item.style.position = 'relative';
        item.style.overflow = 'hidden';
        item.style.padding = '3vh 4vw'
        item.style.border = '9px solid rgb(150, 150, 150)';
        item.style.borderRadius = "5vh";

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
            startingLeft = parseInt(galleryElement.style.left, 10);
            galleryElement.style.cursor = 'grabbing';
            galleryElement.style.transition = 'left 0s ease-in-out'
        });
        
        // stop dragging if the mouse leaves the screen
        document.body.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        // let go after grabbing
        document.body.addEventListener('mouseup', () => {
            isDragging = false;
            galleryElement.style.cursor = 'grab';

            /*
            // code to center the middlest element of the gallery
            let middlestElement;
            let smallestDistance;
            let distanceToOffset;
            galleryContentArray.forEach(item => {
                // needed properties of the items 
                const itemRect = item.getBoundingClientRect();
                const itemMiddle = itemRect.left + itemRect.width / 2;
                const middleX = window.innerWidth / 2;
                const distanceToMiddle = Math.abs(middleX - itemMiddle);
                console.log(`itemID: ${item.id} and distanceToMiddle: ${distanceToMiddle}`)
                //console.log(`itemMiddle: ${itemMiddle} and middleX: ${middleX}`);
                if (!middlestElement || distanceToMiddle < smallestDistance) {
                    smallestDistance = distanceToMiddle;
                    middlestElement = item;
                    distanceToOffset = middleX - itemMiddle;
                }
                
            });
            // get left most position of galleryElement
            const galleryLeft = parseInt(galleryElement.style.left, 10);
            galleryElement.style.transition = 'left 0.5s ease-in-out'
            galleryElement.style.left = `${galleryLeft + distanceToOffset}px`;
            if (galleryLeft + distanceToOffset > -250) { 
                moveLastItemToStart();
            }
            if (galleryLeft + distanceToOffset + galleryElement.scrollWidth < window.innerWidth + 250) {
                moveFirstItemToEnd();
            } 
            */
        });
        
        // move gallery while grabbing
        galleryElement.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
            event.preventDefault();
            const x = event.pageX;
            const deltaX = (x - startX) * 1.4;
            galleryElement.style.left = startingLeft + deltaX + 'px';
            darkenOuterElements(id);
            //console.log("left: " + galleryElement.getBoundingClientRect().left)
            //console.log("width: " + galleryElement.scrollWidth)
            //console.log("left + width: " + (galleryElement.getBoundingClientRect().left + galleryElement.scrollWidth))
            //console.log("windowInner: " + (window.innerWidth + 50))
            
            if (galleryElement.getBoundingClientRect().left > -250) { 
                moveLastItemToStart(id);
                startX = event.pageX;
                startingLeft = galleryElement.getBoundingClientRect().left;

            }
            if (galleryElement.getBoundingClientRect().left + galleryElement.scrollWidth < window.innerWidth + 50) {
                moveFirstItemToEnd(id);
                startX = event.pageX;
                startingLeft = galleryElement.getBoundingClientRect().left;
            } 
        });

        // Add touch events alongside mouse events
        galleryElement.addEventListener('touchstart', (event) => {
            isDragging = true;
            startX = event.touches[0].pageX; // Use the first touch point
            startingLeft = parseInt(galleryElement.style.left, 10);
            galleryElement.style.transition = 'left 0s ease-in-out';
        }, {passive: true}); // Use passive listener to improve scrolling performance

        document.body.addEventListener('touchend', () => {
            isDragging = false;
            galleryElement.style.cursor = 'grab';
        }, {passive: true});

        galleryElement.addEventListener('touchmove', (event) => {
            if (!isDragging) return;
            event.preventDefault(); // Prevent the browser from doing its default thing (scroll / zoom)
            const x = event.touches[0].pageX;
            const deltaX = (x - startX) * 1.4;
            galleryElement.style.left = `${startingLeft + deltaX}px`;
            darkenOuterElements(id);

            // Your logic for moving items
        }, {passive: false}); // Not passive since we're calling preventDefault()

    }
    addGrabbingEffect();
    darkenOuterElements(id);
}

const darkenOuterElements = (galleryNumber) => {
    const galleryElement = document.getElementById(galleryNumber);
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
        darkenerElement.style.opacity = '0.75';
    });
    // undarken the middle element
    middlestElement.querySelector('.darkener').style.opacity = '0';
}

const moveFirstItemToEnd = (galleryNumber) => {
    console.log('moveFirstItemToEnd')
    const galleryElement = document.getElementById(galleryNumber);
    if (galleryElement.children.length > 1) {
        const firstItem = galleryElement.children[0];
        const itemWidth = firstItem.offsetWidth; // Width of the item
        const itemMargin = parseInt(window.getComputedStyle(firstItem).marginLeft) + parseInt(window.getComputedStyle(firstItem).marginRight);

        // Adjust the left position to compensate for the moved item
        const currentLeft = parseInt(galleryElement.style.left, 10);
        galleryElement.style.left = (currentLeft + itemWidth + itemMargin) + 'px';

        // Move the item
        galleryElement.appendChild(firstItem);

        // Need to return a number to adjust where the grab coords are
        return itemWidth + itemMargin;
    }
};

const moveLastItemToStart = (galleryNumber) => {
    console.log('moveLastItemToStart')
    const galleryElement = document.getElementById(galleryNumber);
    if (galleryElement.children.length > 1) {
        const lastItem = galleryElement.children[galleryElement.children.length - 1];
        const itemWidth = lastItem.offsetWidth; // Width of the item
        const itemMargin = parseInt(window.getComputedStyle(lastItem).marginLeft) + parseInt(window.getComputedStyle(lastItem).marginRight);

        // Adjust the left position to compensate for the moved item
        const currentLeft = parseInt(galleryElement.style.left, 10);
        galleryElement.style.left = (currentLeft - itemWidth - itemMargin) + 'px';

        // Move the item
        galleryElement.insertBefore(lastItem, galleryElement.firstChild);

        // Need to return a number to adjust where the grab coords are
        return itemWidth + itemMargin;
    }
};