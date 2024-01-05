class Blobby {
    constructor() {
        this.headHeight = 60;
        this.headWidth = 60;
        this.eyeSize = 15;  // Size of the eyes
        this.eyeSpace = 5;  // Space between the eyes
        this.attentionTimestep = 2000;
        this.createCreature();
        this.addStyles();
        this.storeMousePosListener();
        this.moveAttention();
    }

    createCreature() {
        this.blobbyHead = document.createElement('div');
        this.blobbyBody = document.createElement('div');
        this.leftEye = document.createElement('div');
        this.rightEye = document.createElement('div');

        this.blobbyHead.appendChild(this.leftEye);
        this.blobbyHead.appendChild(this.rightEye);
        document.body.appendChild(this.blobbyHead);

        this.blobbyHead.id = 'creature';
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
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
        `;

        const bodyStyle = `
            position: absolute; 
            height: ${this.headHeight * 2}px; 
            width: ${this.headWidth * 2}px; 
            background-color: lightblue; 
            border-radius: 50%; 
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
            transition: all ${Math.min(this.attentionTimestep, 150)}ms linear;
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
        const { left, top, width, height } = this.blobbyHead.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = this.mouseX - centerX;
        const deltaY = this.mouseY - centerY;
        const angle = Math.atan2(deltaY, deltaX);
        const eyeOffset = Math.min(
            ((this.headWidth - 5) / 4),   //if mouse is outside of the head, the eyes only go 5px from the edge of the head
            Math.hypot(deltaX, deltaY) / 10     //within the head the eyes look at the mouse
        );
        const eyeX = eyeOffset * Math.cos(angle);
        const eyeY = eyeOffset * Math.sin(angle);

        // Adjust eye movement relative to the head size
        this.leftEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        this.rightEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    }

    storeMousePosListener() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
    }

    moveAttention() {
        const intervalId = setInterval(() => {
            this.moveEyes();
        }, this.attentionTimestep);
    }

    
}

// Create and display the creature
new Blobby();
