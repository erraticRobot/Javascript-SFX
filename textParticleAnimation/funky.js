// Options control
let txt = 'ONE';
let speed = 100;
let returnSpeed = 10;
let adjustx = 0;
let adjusty = 0;
let spread = 14;
let spreadDistance = 55;
let red = 255
let green = 255
let blue = 255


/**
 * TODO LIST
 * 
 * Make the colors change in the area around the mouse.
 */



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
    radius: 166
};

window.addEventListener("mousemove", function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
    // console.log(mouse.x, mouse.y);
});



ctx.fillStyle = 'white';
ctx.font = '30px Cursive';
ctx.fillText(txt, 0, 30);
// First argument is text to add SFX to
// Second argument is x coordinate
// Third argument is y coordinate
// Fourth argument would be max-width of text in pixels
// ctx.stokeStyle = 'white';
// ctx.strokeRect = (0, 0, 100, 100);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

const data = ctx.getImageData(0, 0, 100, 100);
//grabs array of data around mouse 0,0 coordinates 100x100 square area.


// Class to act as one particle
// Creates a single particle
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 1; //pixels
        this.baseX = this.x;
        this.baseY = this.y; // baseX rememver original position
        this.density = (Math.random() * speed) + 1;
        // Random num 1 - 30 how fast particle moves away from mouse and how heavy particles are.
    }
    draw() {
            ctx.fillStyle = 'white';
            // start drawing
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // arguments(coord.x, coord.y, size of radius, start point,360 deg in radians)
            ctx.closePath();
            ctx.fill();
        }
        // find mouse position and particle position
    update() {
        // how to calculate distance between two points
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // particles move away from mouse
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        // Distance speed of particle will drop off
        let maxDistance = mouse.radius;

        // grabs percentage of maxdistance moust is away from  pixel, which we'll use to add speed to particle
        let force = (maxDistance - distance) / maxDistance;

        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        // Push particles away
        if (distance < mouse.radius) {
            this.x -= directionX; // speed movement
            this.y -= directionY;
        } else {
            // Calculate distance between particle origin and current position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;

                // return particle back to origin dx/<speed>
                this.x -= dx / returnSpeed;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;

                // return particle back to origin dx/<speed>
                this.y -= dy / returnSpeed;
            }
        }
    }
}

// custom draw method, draw circle representing particle


function init() {
    particleArray = [];
    // particleArray.push(new Particle(50, 50));
    // particleArray.push(new Particle(80, 50));
    // for (let i = 0; i < 1000; i++){
    // x and y random movement
    //     let x = Math.random() * canvas.height;
    //     let y = Math.random() * canvas.width;
    //     particleArray.push(new Particle(x,y));
    // }
    // allow space for letters to show

    // Iter through all 100 rows
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {

            // .data holds properties from getImageData
            // as clamped array 40,000 objects
            // 120 is between the 255 value limit
            // every 4th value is opacity that's what we're grabbing


            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustx;
                let positionY = y + adjusty;

                // Change spread particle y
                particleArray.push(new Particle(positionX * spread, positionY * spread)

                )
            }
        }

    }

}

init();
console.log(particleArray);

// Animation that will handle animation loop
function animate() {
    // clearRect clears screen between every animation frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // loop over particle array, will call draw method for each
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect()
    requestAnimationFrame(animate)
};

animate();




function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            // let distance = Math.sqrt(dx * dx + dy * dy);

            // let forceDirectionX = dx / distance;
            // let forceDirectionY = dy / distance;      
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < spreadDistance) {
                opacityValue = 1 - (distance / 50);
                ctx.strokeStyle = `rgba(${red},${green},${blue},${opacityValue})`
                ctx.lineWidth - 3;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }


        }
    }
}