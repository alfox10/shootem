class BasePolygonObject {

    constructor(context, position, radius, color, velocity, sides = 6, lineWidth = 2, shadowBlur = 10, onlyEdges = false, powerup = 'none') {
        this.context = context;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.sides = sides;
        this.angle = 2 * Math.PI / this.sides;
        this.lineWidth = lineWidth;
        this.shadowBlur = shadowBlur;
        this.onlyEdges = onlyEdges;
        this.powerup = powerup;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.onlyEdges ? 'rgba(0,0,0,0)' : this.color;
        this.context.shadowBlur = this.shadowBlur;
        this.context.strokeStyle = this.color;
        this.context.lineWidth = this.lineWidth;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowColor = this.color;
        for (let i = 0; i < this.sides + 1; i++) {
            this.context.lineTo(this.position.x + this.radius * Math.sin(this.angle * i), this.position.y + this.radius * Math.cos(this.angle * i));
        }
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
}