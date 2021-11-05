const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext('2d');
// returns an object that provides methods/properties for 
    // drawing/manipulation objects on a canvas

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
//Contains all particle objects


// object to get coordinates
// handle mouse interactions
const mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener("mousemove", function(e){
    mouse.x = e.x;
    mouse.y = e.y;
    // console.log(mouse.x, mouse.y);
} );



ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('A', 0, 40);
// First argument is text to add SFX to
// Second argument is x coordinate
// Third argument is y coordinate
// Fourth argument would be max-width of text in pixels
// ctx.stokeStyle = 'white';
// ctx.strokeRect = (0, 0, 100, 100);

const data = ctx.getImageData(0, 0, 100, 100);
//grabs array of data around mouse 0,0 coordinates 100x100 square area.


// Class to act as one particle
// Creates a single particle
class Particle {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 3; //pixels
        this.baseX = this.x;
        this.baseX = this.y;// baseX rememver original position
        this.density = (Math.random() * 30) + 1;
        // Random num 1 - 30 how fast particle moves away from mouse and how heavy particles are.
    }
    draw(){
        ctx.fillStyle = 'white';
        // start drawing
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // arguments(coord.x, coord.y, size of radius, start point,360 deg in radians)
        ctx.closePath();
        ctx.fill();
    }
    // find mouse position and particle position
    update(){
        // how to calculate distance between two points
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300){
            this.size = 30;
        } else {
            this.size = 3;
        }
    }
}

// custom draw method, draw circle representing particle


function init(){
    particleArray = [];
    // particleArray.push(new Particle(50, 50));
    // particleArray.push(new Particle(80, 50));
    for (let i = 0; i < 1000; i++){
        // x and y random movement
        let x = Math.random() * canvas.height;
        let y = Math.random() * canvas.width;
        particleArray.push(new Particle(x,y));
    }
}

init();
console.log(particleArray);

// Animation that will handle animation loop
function animate(){
    // clearRect clears screen between every animation frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // loop over particle array, will call draw method for each
    for (let i = 0; i < particleArray.length; i++ ){
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate)
};

animate();