class Player {

    constructor(context, position, radius, color, velocity = { x: 0, y: 0 }, lineWidth = 2, shadowBlur = 4, strokeStyle = 'white', shadowColor = 'white') {
        this.context = context;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.speed = 5;
        this.lineWidth = lineWidth;
        this.shadowBlur = shadowBlur;
        this.strokeStyle = strokeStyle;
        this.shadowColor = shadowColor;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.shadowBlur = this.shadowBlur;
        this.context.strokeStyle = this.strokeStyle;
        this.context.lineWidth = this.lineWidth;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowColor = this.shadowColor;
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        if (this.lineWidth > 0)
            this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }

    updateVelocity() {
        if (this.velocity) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    update() {
        this.draw();
        this.updateVelocity();
    }

    moveX(movement) {
        this.velocity.x = movement * this.speed;
    }

    moveY(movement) {
        this.velocity.y = movement * this.speed;
    }
}