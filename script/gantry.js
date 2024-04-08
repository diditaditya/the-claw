class Gantry {
    constructor(xFrame, yFrame, sling, claw, startX, startY, maxX, maxY) {
        this.xFrame = xFrame;
        this.yFrame = yFrame;
        this.sling = sling;
        this.claw = claw;
        this.posX = startX;
        this.posY = startY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    moveX(val) {
        this.posX = val;
        this.xFrame.moveX(val);
        this.yFrame.moveX(val);
        this.sling.moveX(val);
        this.claw.moveX(val);
    }

    moveY(val) {
        this.posY = val;
        this.xFrame.moveX(val);
        this.yFrame.moveX(val);
        this.sling.moveX(val);
        this.claw.moveX(val);
    }

    grab() {
        this.sling.drop();
        this.claw.grab();
        this.sling.return();

        this.returnToOriginalPos();
        this.claw.release();
    }

    returnToOriginalPos() {
        this.moveX(this.startX);
        this.moveY(this.startY);
    }
}