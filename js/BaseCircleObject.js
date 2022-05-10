class BaseCircleObject{

    constructor(context,position,radius,color,velocity){
        this.context = context;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.shadowBlur = 10;
        this.context.shadowColor = this.color;
        this.context.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2);
        this.context.fill();
        this.context.closePath();
    }

    updateVelocity(){
        if(this.velocity){
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    update(){
        this.draw();
        this.updateVelocity();
    }
}