let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

window.onload = function() {
    canvas = document.getElementById('canvas1');
    // canvas 2d drawing api -- get Context onlu works on canvas
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0)
};



window.addEventListener('resize', function(){
    cancelAnimationFrame(flowFieldAnimation)
    canvas.width = window.innerHeight;
    canvas.height = window.innerWidth;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
})


const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
})

class FlowFieldEffect {
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#ctx.lineWidth = 0.5;
        // this.#ctx.strokeStyle = 'white';
        this.#width = width;
        this.#height = height;
        // this.angle = 0;
        // timeframe for delta time
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        this.cellSize = 22;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 0;
        this.vr = 0.03
    }


    #createGradient(){
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1", "#ff5c33")
        this.gradient.addColorStop("0.2", "#ff66b3")
        this.gradient.addColorStop("0.4", "#ccccff")
        this.gradient.addColorStop("0.6", "#b3ffff")
        this.gradient.addColorStop("0.8", "#80ff80")
        this.gradient.addColorStop("0.9", "#ffff33");
    }
    
    // a single animation
    #drawLine(angle, x, y){
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;

        if(distance > 500000) distance = 500000;
        else if (distance < 50000) distance = 500000;
        const length = distance/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.sin(angle) * length, y + Math.cos(angle) * length);
        // this.#ctx.lineTo(mouse.x, mouse.y);
        this.#ctx.stroke();

    }
    animate(timeStamp){
        // note time passed => deltaTime
        // store current time in this.lastTime
        const deltaTime =  timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        // matches stroke with the refrech rate of any computer
        if (this.timer > this.interval){
                // this.angle += 0.1;
                //clears
                this.#ctx.clearRect(0, 0, this.#width, this.#height)
                this.radius += this.vr;
                if(this.radius  > 5 || this.radius < -5) this.vr *= -1

                for (let y = 0; y < this.#height; y += this.cellSize){
                    for (let x = 0; x < this.#width; x += this.cellSize){
                        const angle = (Math.cos(x * 0.004) + Math.sin(y * 0.004)) * this.radius;
                        this.#drawLine(angle,x, y);                            
                    }
                }
                
                // rotating animation
                // this.#draw(this.#width/2 + Math.sin(this.angle) * 100, this.#height/2 + Math.cos(this.angle) * 100);
                
                // this.#drawLine(this.#width/2, this.#height/2);
                // console.log(deltaTime);
                
                // requestAnimationFrame takes one arg, DOMHighResTimeStamp, whick is the curr time based on milliseconds from time origin. catches refresh rate.

                this.timer = 0;
        } else {
            this.timer += deltaTime;
            
        }
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
};