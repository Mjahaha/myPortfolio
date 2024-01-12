export class Blobby {
    constructor(arrayOfElementIdsForAttention) {

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
        this.currentActualHeight = 0;
        this.isAboveGroundLevel = true;

        // attention details 
        this.attentionTimestep = 4000;
        this.currentAttentionOptions = arrayOfElementIdsForAttention;
        this.currentAttentionOptions.push("mouse"); // adds mouse to the array of attention items
        this.currentAttentionItem = "mouse";
        this.attentionItems = {
            mouse: {
                x: 100,
                y: 100
            }
        }
        this.setAttentionItemsValues();
        //const navElement = document.getElementById("navBarInHeader").getBoundingClientRect();
        

        // gravity details 
        this.gravity = 10; // The rate at which Blobby accelerates towards the ground
        this.velocityY = 0; // The current velocity of Blobby's fall
        this.velocityX = 0;
        this.isOnGround = false; // Flag to check if Blobby is on the ground
        this.gravityTimestep = 100;

        // methods to make blobby work
        this.createCreature();  // creates the blobby divs
        this.addStyles();   // adds the styles to blobbys divs
        this.storeMousePosListener();   // stores the mouse coords on the class
        this.moveEyes();    // constantly moves eyes to the direciton of where the attention item is
        this.moveAttention();   //moves attention randomly to different items on the screen 
        this.trackGroundLevel();    // Call the method to set and keep track of the bottom Y value
        this.applyGravity();    // Apply gravity to Blobby
        this.recalculateHeight();   // Stores Blobbys actual height; 

        // for testing
        console.log(this);
        this.blobbyBody.addEventListener('click', () => {
            console.log('jump!');
            this.jump();
        });

    }
    get x() {
        return this._x;
    }
    set x(input) {
        if (isNaN(input)) { return }
        const maxX = window.innerWidth - this.width - 23;
        const minX = 0;
        if (input > maxX) {
            this._x = maxX;
        } 
        else if (input < minX) {
            this.x = 0;
        }
        else {
            this._x = input;
        }
        this.left = this._x - this.height / 2; // Update left position based on x
    }
    get y() {
        return this._y;
    }
    set y(input) {
        if (isNaN(input)) { return }
        this.recalculateHeight();
        // necessary variables 
        const maxY = this.groundLevel - this.currentActualHeight / 2 + 20; 
        const currentY = this.y;

        // set isAboveGroundLevel 
        if (currentY > this.groundLevel) 
        { this.isAboveGroundLevel = false; }
        else { this.isAboveGroundLevel = true }

        // set isOnGround
        if (this.isAboveGroundLevel && input > this.groundLevel) 
        { this.isOnGround = true; }
        else { this.isOnGround = false }

        // if starting above groundLevel 
        if (this.isAboveGroundLevel) {
            if (input < maxY) {
                this._y = input;
            } else {
                this._y = maxY;
                this.velocityY = 0;
                this.velocityX = 0;
                this.isOnGround = true;
                this.top = this._y - this.height / 2;
            }
        } else {    // if starting below groundLevel
            this.velocityY = this.velocityY - 15;
            if (this.velocityY < - 70) { this.velocityY = -70 }
            this._y = input;
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
            z-index: 3;
            transform: translate(-50%, -50%);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Adds shading to the bottom */
        `;

        const bodyStyle = `
            position: absolute; 
            height: ${this.height * 1.8}px; 
            width: ${this.width * 1.5}px; 
            background-color: lightblue; 
            border-radius: 50%; 
            z-index: 2;
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
            z-index: 4;
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
        // updates the mouse position when the mouse moves
        document.addEventListener('mousemove', (event) => {
            this.attentionItems.mouse.x = event.clientX + window.scrollX;
            this.attentionItems.mouse.y = event.clientY + window.scrollY;
        });

        // when the mouse enters the window, add 'mouse' to attentionItems if it's not already there
        document.addEventListener('mouseenter', () => {
            if (!this.currentAttentionOptions.includes('mouse')) {
                this.currentAttentionOptions.push('mouse');
            }
        });

        // when the mouse leaves the window, remove 'mouse' from attentionItems
        document.addEventListener('mouseleave', () => {
            const mouseIndex = this.currentAttentionOptions.indexOf('mouse');
            if (mouseIndex > -1) {
                this.currentAttentionOptions.splice(mouseIndex, 1);
            }
        });
    }

    // set the values for each potential attention items 
    setAttentionItemsValues() {
        this.currentAttentionOptions.forEach((itemId) => {
            // Get the DOM element by ID
            let element = document.getElementById(itemId);
            if (itemId === "mouse") { element = false };    // set the element to falsey if we are lookng for the mouse 
            // If the element exists, calculate its position
            if (element) {
                const rect = element.getBoundingClientRect();
                // Update the attentionItem object with the new coordinates
                this.attentionItems[itemId] = {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    x: rect.left + rect.width / 2 + window.scrollX, // Center x-coordinate
                    y: rect.top + rect.height / 2  + window.scrollY  // Center y-coordinate
                };
            }
        });
        //console.log(this.attentionItems);
    }

    // constantly moves eyes to the direciton of where the attention item is
    moveEyes(event) {
        const actualMovingOfTheEyes = () => {
            // bobby variable
            const { left, top, width, height } = this.blobbyHead.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const attentionX = this.attentionItems[this.currentAttentionItem].x - window.scrollX; // Adjust for scroll
            const attentionY = this.attentionItems[this.currentAttentionItem].y - window.scrollY; // Adjust for scroll

            // attention item variables
            const deltaX = attentionX - centerX;
            const deltaY = attentionY - centerY;
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

        // move eyes every 35ms
        setInterval(actualMovingOfTheEyes, 35);
    }

    moveAttention() {
    // randomly determine where blobby is paying attention to
    const shouldWeMoveAttention = () => {
        // dont change attention while in the air 
        if (!this.isOnGround) { return; }

        // options of what to change to should not include current item
        const optionsToChangeAttentionTo = [];
        this.currentAttentionOptions.forEach( (option) => {
            if (option != this.currentAttentionItem) {
                optionsToChangeAttentionTo.push(option)
            }
        });
        if (optionsToChangeAttentionTo.length == 0) {   // don't change attention if there is nothing to change to, usually when mouse leaves
            this.jump();
            return;
        } 
        
        // chance to change
        const randomNumberToSeeIfAttentionShifts = Math.ceil(Math.random() * 3); // 1 in 3 chance to change attention
        // if the random number is 1 shift attention, otherwise jump
        if (randomNumberToSeeIfAttentionShifts === 1 ) {
            // change attention item
            const randomNumberToChooseOption = Math.floor(Math.random() * optionsToChangeAttentionTo.length);
            this.currentAttentionItem = optionsToChangeAttentionTo[randomNumberToChooseOption];
            console.log("attention has changed to: " + this.currentAttentionItem);
            
            // change transitions so his eyes dont jerk weirdly to attention item
            this.leftEye.style.transition = "all 750ms ease-in-out";
            this.rightEye.style.transition = "all 750ms ease-in-out";
            setTimeout( () => {     // return eyes to normal 
                this.leftEye.style.transition = "all 35ms linear";
                this.rightEye.style.transition = "all 35ms linear";
            }, 750);
        } else {    // otherwise execute jump
            this.jump();
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
            // updates coords of all attention items
            this.setAttentionItemsValues()
            // updates the groundLevel
            let screenGroundLevel = window.innerHeight + window.scrollY;
            // dont let ground level get past the bottom of the page
            let maxGroundLevel = document.body.getBoundingClientRect().top + document.body.getBoundingClientRect().height + window.scrollY - 10; 
            this.groundLevel = Math.min(screenGroundLevel, maxGroundLevel);

            /* console.log(`
                normal GroundLevel:  ${screenGroundLevel}
                maxGroundLevel:      ${maxGroundLevel}
                top:                 ${document.body.getBoundingClientRect().top + window.scrollY}
                height:              ${document.body.getBoundingClientRect().height}
                chosen ground level: ${this.groundLevel}
            `); */

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

        // stretch blobby out when he is falling
        const stretch = () => {
            // Stretch Blobby vertically and reduce horizontally
            this.blobbyBody.style.height = `${this.height * 2.2}px`;
            this.blobbyBody.style.width = `${this.width * 1.3}px`;
            this.blobbyBody.style.transition = 'all 100ms linear';
        };

        // squash blobby for when he lands 
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

        const moveBasedOnVelocitiesAndGravity = () => {
            
            /* console.log(`
                this.top: ${this.top};
                this.left: ${this.left};
                this.isOnGround: ${this.isOnGround};
                this.velocityY: ${this.velocityY};
                this.velocityX: ${this.velocityX};
                this.y: ${this.y};
                this.x: ${this.x};
                this.groundLevel: ${this.groundLevel};
            `); */
            //doubleCheckOnGround();
            
            if (!this.isOnGround || this.velocityY < 0) {
                this.velocityY += this.gravity;     // Increase velocity by gravity
                this.x = this.x + this.velocityX;   // Adjust x based on velocity 
                this.y = this.y + this.velocityY;   // Adjust y based on velocity 
    
                if (this.isOnGround && this.isAboveGroundLevel) { // Check if Blobby has hit the ground after setting top
                    squash(); // Squash Blobby on impact
                } else {
                    stretch(); // Stretch Blobby while falling
                }
            }
        } 

        setInterval(moveBasedOnVelocitiesAndGravity, this.gravityTimestep); // Continuously apply gravity
    }


    // have blobby jump
    jump() {  
        
        // the animation of blobby squatting down to get ready for his jump
        const littleJumpSquashAndGo = () => {

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
                executeLittleJump();
            }, 200);
        };
        
        // the animaiton for blobby adding a wiggle to the squash for a bit jump
        const bigJumpSquashAndWiggle = () => {
            // Calculate the difference in height when Blobby squashes
            const heightDiff = this.height * 1.8 - this.height * 1.2;

            const squashForJumpBeforeWiggle = () => {
                // Increase the top position to keep the bottom in the same place
                this.top += heightDiff / 2 + 20; 

                // Squash Blobby horizontally and reduce vertically
                this.blobbyBody.style.height = `${this.height * 1.2}px`;
                this.blobbyBody.style.width = `${this.width * 1.8}px`;
                this.blobbyBody.style.transition = 'all 200ms ease-out';

                setTimeout(() => {
                    wiggle();
                }, 500);
            }

            const wiggle = () => {
                let wiggleCount = 0;
                const numberOfWiggles = 8; // Total number of wiggles
                const wiggleInterval = 100; // Time in ms between each wiggle
        
                const wiggleAnimation = setInterval(() => {
                    // Alternate the wiggle direction
                    this.blobbyBody.style.transform = `translateX(${wiggleCount % 2 === 0 ? -10 : 10}px)`;
        
                    wiggleCount++;
                    if (wiggleCount > numberOfWiggles) {
                        clearInterval(wiggleAnimation);
                        // Reset Blobby's transform after wiggling
                        this.blobbyBody.style.transform = 'translateX(0px)';
                        // Return Blobby to normal after squashing
                        this.top -= heightDiff / 2 + 20; // Reset the top position
                        this.blobbyBody.style.height = `${this.height * 1.8}px`;
                        this.blobbyBody.style.width = `${this.width * 1.5}px`;
                        this.blobbyBody.style.transition = 'all 300ms ease-out';
                        executeTargetedJump();
                    }
                }, wiggleInterval);
            }

            //execute sequence
            squashForJumpBeforeWiggle();

        } 

        // does a little jump towards attention item 
        const executeLittleJump = () => {
            // variables for jumping 
            const targetX = this.attentionItems[this.currentAttentionItem].x; 
            const deltaX = targetX - this.x; 
            const velocityY = 50;
            const timeStepsToReachPeakOfJump = velocityY / this.gravity;    // variable required for potentailVelocityX formula
            const potentialVelocityX = 2 * Math.abs(deltaX / (2 * timeStepsToReachPeakOfJump)); // velocity required to reach targetX
            const velocityXMax = 24;
            const velocityXMin = 12;
            const velocityX = Math.max(Math.min(potentialVelocityX, velocityXMax), velocityXMin)    // get the correct velocity that is bounded by the min and max values 
            let posNegMultiplier = 1;
            if (deltaX < 0) { posNegMultiplier = -1; }

            /* console.log(`
            targetX = ${targetX}:
            this.X = ${this.x}:
            deltaX = ${deltaX}:
            posNegMultiplier = ${posNegMultiplier}:
            `): */

            // Set horizontal and vertical velocities for a little jump
            this.velocityX = velocityX * posNegMultiplier; // Limit horizontal movement to 250px
            this.velocityY = -1 * velocityY;
            // velX as 12 and velY as -50 has jump distance of 108
        }
        
        // does a big jump that reaches the attention item 
        const executeTargetedJump = () => {
            // variable for the formula 
            const targetX = this.attentionItems[this.currentAttentionItem].x;
            const targetY = this.attentionItems[this.currentAttentionItem].y;
            const deltaX = this.x - targetX;
            const deltaY = targetY - this.y;

            const velocityY = Math.sqrt(2 * this.gravity * Math.abs(deltaY));
            const timeStepsToReachPeakOfJump = velocityY / this.gravity;
            const velocityX = 2 * Math.abs(deltaX / (2 * timeStepsToReachPeakOfJump));
            let posNegMultiplier = 1;   // to determine the direction of horizontal vel, 1 is left -1 is right
            if (deltaX > 0) { posNegMultiplier = -1; }

            /* console.log(`
            deltaY = ${deltaY}:
            velocityY = ${velocityY}:
            timeStepsToReachPeakOfJump = ${timeStepsToReachPeakOfJump}:
            targetX = ${targetX}:
            this.X = ${this.x}:
            deltaX = ${deltaX}:
            velocityX = ${velocityX}:
            posNegMultiplier = ${posNegMultiplier}:
            `) */
            
            this.velocityY = -1 * (velocityY + 5);
            this.velocityX = velocityX * posNegMultiplier;
            
        }

        // chooses which jump to do an runs jump 
        const runjump = () => {
            // exit if not on the ground 
            if (!this.isOnGround) { return; }

            // variable for the formula 
            const targetX = this.attentionItems[this.currentAttentionItem].x;
            const targetY = this.attentionItems[this.currentAttentionItem].y;
            const deltaX = Math.abs(this.x - targetX);  // finds how many pixels blobby is from targetX
            const deltaY = Math.abs(targetY - this.y);    // finds how many pixels blobby is from targetY

            /* console.log(`
                this.x: ${this.x}
                targetX: ${targetX}
                deltaX: ${deltaX}
                deltaY: ${deltaY}
            `); */

            // a small jump goes 108px so if small jump until we are close enough 
            if (deltaX < 200 && deltaY > 100) {
                bigJumpSquashAndWiggle();
            } else {
                littleJumpSquashAndGo();
            }
        }
        runjump();
    }
}
