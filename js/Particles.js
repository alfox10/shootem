class Particles extends BaseCircleObject{
    constructor(context,position,radius,color,velocity){
        super(context,position,radius,color,velocity);
        this.alpha = 1;
    }

    draw(){
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.shadowBlur = 2;
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowColor = this.color;
        this.context.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2);
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    update(){
        super.update();
        this.alpha -= 0.01;
    }
}