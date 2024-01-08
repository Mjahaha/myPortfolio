class Blobby {
    constructor() {

        // blobby details
        this.height = 50;
        this.width = 60;
        this.headHeight = this.height;
        this.headWidth = this.width;
        this._top = 0;
        this._left = 0;
        this._x = Math.floor(window.innerWidth * 0.5);
        this._y = 200;
        this.eyeSize = 15;  // Size of the eyes
        this.eyeSpace = 5;  // Space between the eyes
        this.groundLevel = 0; // Initialize the ground level
        this.gravityTimestep = 100;
        this.currentActualHeight = 0;

        // attention details 
        this.attentionTimestep = 6000;
        this.currentAttentionItem = "mouse";
        this.currentAttentionOptions = ["mouse", "nav"];
        const navElement = document.getElementById("nav").getBoundingClientRect();
        this.attentionItem = {
            mouse: {
                x: 100,
                y: 100
            },
            nav: {
                left: navElement.left,
                top: navElement.top,
                width: navElement.width,
                height: navElement.height,
                x: navElement.left + navElement.height / 2,
                y: navElement.top + navElement.width / 2
            }
        }

        // gravity details 
        this.gravity = 10; // The rate at which Blobby accelerates towards the ground
        this.velocityY = 0; // The current velocity of Blobby's fall
        this.isOnGround = false; // Flag to check if Blobby is on the ground

        // methods to make blobby work
        this.createCreature();  // creates the blobby divs
        this.addStyles();   // adds the styles to blobbys divs
        this.storeMousePosListener();   // stores the mouse coords on the class
        this.moveEyes();    // constantly moves eyes to the direciton of where the attention item is
        this.moveAttention();   //moves attention randomly to different items on the screen 
        this.trackGroundLevel();    // Call the method to set and keep track of the bottom Y value
        this.applyGravity();    // Apply gravity to Blobby
        this.recalculateHeight();   // Stores Blobbys actual height; 
        console.log(this);
    }
    get x() {
        return this._x;
    }
    set x(input) {
        if (isNaN(input)) { return }
        const maxX = this.groundLevel - this.height / 2;
        if (input < maxX) {
            this._x = input;
            this.isOnGround = false; // Blobby is not on the ground
        } else {
            this._x = maxX;
            this.isOnGround = true; // Blobby is on the ground
        }
        this.left = this._x - this.height / 2; // Update left position based on x
    }
    get y() {
        return this._y;
    }
    set y(input) {
        if (isNaN(input)) { return }
        this.recalculateHeight();
        const screenWidth = window.innerWidth;
        const maxY = this.groundLevel - this.currentActualHeight / 2 + 20; 
        if (input < maxY) {
            this._y = input;
        } else {
            this._y = maxY;
            this.velocityY = 0;
            this.isOnGround = true;
        }
        this.top = this._y - this.height / 2;
    }
    get top() {
        return this._top;
    }
    set top(input) {
        this._top = input;
        this.blobbyBody.style.top = `${this._top}px`;
    }
    get left() {
        return this._left;
    }
    set left(input) {
        this._left = input;
        this.blobbyBody.style.left = `${this._left}px`;
    }

    // creates the blobby divs
    createCreature() {
        this.blobbyHead = document.createElement('div');
        this.blobbyBody = document.createElement('div');
        this.leftEye = document.createElement('div');
        this.rightEye = document.createElement('div');

        this.blobbyHead.appendChild(this.leftEye);
        this.blobbyHead.appendChild(this.rightEye);
        this.blobbyBody.appendChild(this.blobbyHead);
        document.body.appendChild(this.blobbyBody);

        this.blobbyHead.id = 'head';
        this.blobbyBody.id = 'blobbyBody'
        this.leftEye.id = 'leftEye';
        this.rightEye.id = 'rightEye';
    }

    // adds the styles to blobbys divs
    addStyles() {
        const headStyle = `
            position: absolute; 
            height: ${this.height}px; 
            width: ${this.width}px; 
            background-color: lightblue; 
            border-radius: 50%; 
            top: -10%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Adds shading to the bottom */
        `;

        const bodyStyle = `
            position: absolute; 
            height: ${this.height * 1.8}px; 
            width: ${this.width * 1.5}px; 
            background-color: lightblue; 
            border-radius: 50%; 
            z-index: -1;
            top: ${this.y}px;
            left: ${this.x}px;
        `

        // Adjust eye positions to be proportional to head size
        const eyeOffsetX = (this.width - this.eyeSize) / 2; 
        const eyeOffsetY = (this.height - this.eyeSize) / 2; 

        const eyeStyle = `
            position: absolute; 
            width: ${this.eyeSize}px; 
            height: ${this.eyeSize}px; 
            background-color: black; 
            border-radius: 50%; 
            top: ${eyeOffsetY}px;
            transition: all 35ms linear;
        `;
        const eyeStyleLeft = `
            ${eyeStyle}
            left: ${eyeOffsetX - (this.eyeSize / 2 + this.eyeSpace / 2)}px; 
        `;
        const eyeStyleRight = `
            ${eyeStyle}
            left: ${eyeOffsetX + (this.eyeSize / 2 + this.eyeSpace / 2)}px; 
        `;

        this.blobbyHead.style.cssText = headStyle;
        this.blobbyBody.style.cssText = bodyStyle;
        this.leftEye.style.cssText = eyeStyleLeft;
        this.rightEye.style.cssText = eyeStyleRight;
    }

    // stores the mouse coords on the class
    storeMousePosListener() {
        document.addEventListener('mousemove', (event) => {
            this.attentionItem.mouse.x = event.clientX;
            this.attentionItem.mouse.y = event.clientY;
        });
    }

    // constantly moves eyes to the direciton of where the attention item is
    moveEyes(event) {
        const actualMovingOfTheEyes = () => {
            // bobby variable
            const { left, top, width, height } = this.blobbyHead.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            // attention item variables
            const deltaX = this.attentionItem[this.currentAttentionItem].x - centerX;
            const deltaY = this.attentionItem[this.currentAttentionItem].y - centerY;
            const angle = Math.atan2(deltaY, deltaX);
            const eyeOffset = Math.min(
                ((this.width - 5) / 4),   //if mouse is outside of the head, the eyes only go 5px from the edge of the head
                Math.hypot(deltaX, deltaY) / 10     //within the head the eyes look at the mouse
            );
            
            // Adjust eye movement relative to the head size
            const eyeX = eyeOffset * Math.cos(angle);
            const eyeY = eyeOffset * Math.sin(angle);
            this.leftEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
            this.rightEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        }

        // move eyes every 10ms
        setInterval(actualMovingOfTheEyes, 10);
    }

    moveAttention() {
    // randomly determine where blobby is paying attention to
    const shouldWeMoveAttention = () => {
        // options of what to change to should not include current item
        const optionsToChangeAttentionTo = [];
        this.currentAttentionOptions.forEach( (option) => {
            if (option != this.currentAttentionItem) {
                optionsToChangeAttentionTo.push(option)
            }
        });
        
        // chance to change
        const randomNumberToSeeIfAttentionShifts = Math.ceil(Math.random() * 2); 
        if (randomNumberToSeeIfAttentionShifts === 1 ) {
            // change attention item
            const randomNumberToChooseOption = Math.floor(Math.random() * optionsToChangeAttentionTo.length);
            this.currentAttentionItem = optionsToChangeAttentionTo[randomNumberToChooseOption];
            
            //change transitions to be appropriate
            this.leftEye.style.transition = "all 750ms ease-in-out";
            this.rightEye.style.transition = "all 750ms ease-in-out";
            setTimeout( () => {
                this.leftEye.style.transition = "all 100ms linear";
                this.rightEye.style.transition = "all 100ms linear";
            }, 750);
        }
    }

    // check if we should randomly change attention every attention timestep
    const intervalId = setInterval(
        shouldWeMoveAttention, this.attentionTimestep);
    }

    recalculateHeight() {
        const blobbyTop = this.blobbyHead.getBoundingClientRect().top;
        const blobbyBodyStats = this.blobbyBody.getBoundingClientRect();
        const blobbyBottom = blobbyBodyStats.top + blobbyBodyStats.height;
        this.currentActualHeight = blobbyBottom - blobbyTop;
    }

    trackGroundLevel() {
        const updateGroundLevel = () => {
            this.groundLevel = window.innerHeight + window.scrollY;
            console.log(this.groundLevel);
            if (this.isOnGround < this.groundLevel) {
                this.isOnGround = false;
            }
        };

        updateGroundLevel(); // Set the initial value

        // Update bottomY on resize and scroll
        window.addEventListener('resize', updateGroundLevel);
        window.addEventListener('scroll', updateGroundLevel);
    }

    applyGravity() {

        const stretch = () => {
            // Stretch Blobby vertically and reduce horizontally
            this.blobbyBody.style.height = `${this.height * 2.2}px`;
            this.blobbyBody.style.width = `${this.width * 1.3}px`;
            this.blobbyBody.style.transition = 'all 100ms linear';
        };

        const squash = () => {
            // execute after timestep finished

            // Calculate the difference in height when Blobby squashes
            const heightDiff = this.height * 1.8 - this.height * 1.2;

            // Increase the top position to keep the bottom in the same place
            this.top += heightDiff / 2 + 20; 

            // Squash Blobby horizontally and reduce vertically
            this.blobbyBody.style.height = `${this.height * 1.2}px`;
            this.blobbyBody.style.width = `${this.width * 1.8}px`;
            this.blobbyBody.style.transition = 'all 200ms ease-out';

            setTimeout(() => {
                // Return Blobby to normal after squashing
                this.top -= heightDiff / 2 + 20; // Reset the top position
                this.blobbyBody.style.height = `${this.height * 1.8}px`;
                this.blobbyBody.style.width = `${this.width * 1.5}px`;
                this.blobbyBody.style.transition = 'all 300ms ease-out';
            }, 200);

        };

        const fall = () => {
            console.log(
                `this.top: ${this.top};
                this.left: ${this.left};
                this.isOnGround: ${this.isOnGround};
                this.velocity: ${this.velocityY}:
                this.y: ${this.y};
                this.groundLevel: ${this.groundLevel};
                `
            );
            if (!this.isOnGround) {
                this.velocityY += this.gravity; // Increase velocity by gravity
                this.y = this.y + this.velocityY; // Use the setter to update position
    
                if (this.isOnGround) { // Check if Blobby has hit the ground after setting top
                    squash(); // Squash Blobby on impact
                } else {
                    stretch(); // Stretch Blobby while falling
                }
            }
        } 

        setInterval(fall, this.gravityTimestep); // Continuously apply gravity
    }


    // have blobby jump
    jump() {



    }
    
}

// Create and display blobby 
new Blobby();
