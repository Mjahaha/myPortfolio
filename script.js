class Blobby {
    constructor() {
        // blobby details
        this.headHeight = 50;
        this.headWidth = 60;
        this.eyeSize = 15;  // Size of the eyes
        this.eyeSpace = 5;  // Space between the eyes
        // attention details 
        this.attentionTimestep = 1000;
        this.currentAttentionItem = "mouse";
        this.currentAttentionOptions = [
            "mouse", "nav"
        ]
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
        console.log(this.attentionItem.nav);
        this.createCreature();
        this.addStyles();
        this.storeMousePosListener();
        this.moveAttention();
        this.moveEyes();
    }

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

    addStyles() {
        const headStyle = `
            position: absolute; 
            height: ${this.headHeight}px; 
            width: ${this.headWidth}px; 
            background-color: lightblue; 
            border-radius: 50%; 
            top: -10%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Adds shading to the bottom */
        `;

        const bodyStyle = `
            position: absolute; 
            height: ${this.headHeight * 1.5}px; 
            width: ${this.headWidth * 1.5}px; 
            background-color: lightblue; 
            border-radius: 50%; 
            z-index: -1;
        `

        // Adjust eye positions to be proportional to head size
        const eyeOffsetX = (this.headWidth - this.eyeSize) / 2; 
        const eyeOffsetY = (this.headHeight - this.eyeSize) / 2; 

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
                ((this.headWidth - 5) / 4),   //if mouse is outside of the head, the eyes only go 5px from the edge of the head
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

    storeMousePosListener() {
        document.addEventListener('mousemove', (event) => {
            this.attentionItem.mouse.x = event.clientX;
            this.attentionItem.mouse.y = event.clientY;
        });
    }

    moveAttention() {
        const intervalId = setInterval(() => {
            const shouldWeMoveAttention = () => {
                // options of what to change to should not include current item
                const optionsToChangeAttentionTo = [];
                this.currentAttentionOptions.forEach( (option) => {
                    if (option != this.currentAttentionItem) {
                        optionsToChangeAttentionTo.push(option)
                    }
                });
                
                // chance to change
                const randomNumberToSeeIfAttentionShifts = Math.ceil(Math.random() * 6); 
                if (randomNumberToSeeIfAttentionShifts === 6 ) {
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

            shouldWeMoveAttention();

        }, this.attentionTimestep);
    }

    
}

// Create and display blobby 
new Blobby();
