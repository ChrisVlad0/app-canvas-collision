const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Variables para almacenar las coordenadas del mouse
let mouseX = 0;
let mouseY = 0;

// Obtener las coordenadas del mouse
function obtenerCoordenadas(evento) {
    // Obtener las coordenadas relativas al canvas
    var rect = canvas.getBoundingClientRect();
    mouseX = evento.clientX - rect.left;
    mouseY = evento.clientY - rect.top;

    console.log("Coordenada X: " + mouseX + " Coordenada Y: " + mouseY);
}

// Agregar un evento de escucha para el movimiento del mouse en el canvas
canvas.addEventListener("mousemove", obtenerCoordenadas);

// Agregar un evento de escucha para clics en el canvas
canvas.addEventListener("click", function(evento) {
    // Verificar si las coordenadas del clic están dentro de algún círculo
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        let distance = getDistance(mouseX, mouseY, circle.posX, circle.posY);
        if (distance < circle.radius) {
            // Eliminar el círculo del arreglo
            circles.splice(i, 1);
            break;
        }
    }
});

//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight * 0.7;
const window_width = window.innerWidth * 0.7;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speedX, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Almacenar el color original
        this.text = text;
        this.speedX = speedX; // Velocidad horizontal aleatoria
        this.speedY = speedY; // Velocidad vertical hacia arriba

        this.dx = 1 * this.speedX;
        this.dy = 1 * this.speedY;
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.draw(context);

        this.posX += this.dx; // Mover horizontalmente
        this.posY -= this.dy; // Mover verticalmente hacia arriba

        // Verificar colisiones con otros círculos
        for (let circle of circles) {
            if (circle !== this) {
                let distance = getDistance(this.posX, this.posY, circle.posX, circle.posY);
                if (distance < (this.radius + circle.radius)) {
                    // Cambiar la dirección de movimiento
                    let tempDx = this.dx;
                    let tempDy = this.dy;
                    this.dx = circle.dx;
                    this.dy = circle.dy;
                    circle.dx = tempDx;
                    circle.dy = tempDy;

                    // Cambiar los colores al detectar una colisión
                    this.color = "red";
                    circle.color = "red";
                }
            }
        }
    }
}

function getDistance(posX1, posY1, posX2, posY2) {
    return Math.sqrt(Math.pow((posX2 - posX1), 2) + Math.pow((posY2 - posY1), 2));
}

let circles = [];

// Agregar hasta 10 círculos al arreglo
for (let i = 0; i < 6; i++) {
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    let randomX, randomY;

    do {
        randomX = Math.random() * (window_width - 2 * randomRadius) + randomRadius; // Asegura que el círculo esté completamente dentro del canvas
        randomY = window_height - 2 * randomRadius; // Comienza desde la parte inferior de la pantalla
    } while (circles.some(circle => getDistance(randomX, randomY, circle.posX, circle.posY) < (randomRadius + circle.radius)));

    let randomSpeedX = (Math.random() - 0.5) * 2; // Velocidad horizontal aleatoria
    let randomSpeedY = Math.random() * 2 + 1; // Velocidad vertical hacia arriba

    let newCircle = new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), randomSpeedX, randomSpeedY);
    circles.push(newCircle);
}

let updateCircle = function () {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, window_width, window_height);

    // Iterar sobre cada círculo en el arreglo
    for (let circle of circles) {
        circle.update(ctx, circles);
    }

    // Restaurar el color original de los círculos que no están en colisión
    for (let circle of circles) {
        if (circle.color === "red" && !circles.some(otherCircle => circle !== otherCircle && getDistance(circle.posX, circle.posY, otherCircle.posX, otherCircle.posY) < (circle.radius + otherCircle.radius))) {
            circle.color = circle.originalColor;
        }
    }

    // Mostrar las coordenadas del mouse
    xymouse(ctx);
};

function xymouse(context) {
    context.font = "bold 10px cursive";
    context.fillStyle = "black";
    context.fillText("x: " + mouseX, 20, 10);
    context.fillText("y: " + mouseY, 20, 25);
}

updateCircle();
