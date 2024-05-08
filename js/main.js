const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Almacenar el color original
        this.text = text;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
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

        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;

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
for (let i = 0; i < 10; i++) {
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    let randomX, randomY;

    do {
        randomX = Math.random() * (window_width - 2 * randomRadius) + randomRadius; // Asegura que el círculo esté completamente dentro del canvas
        randomY = Math.random() * (window_height - 2 * randomRadius) + randomRadius; // Asegura que el círculo esté completamente dentro del canvas
    } while (circles.some(circle => getDistance(randomX, randomY, circle.posX, circle.posY) < (randomRadius + circle.radius)));

    let newCircle = new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), 1);
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
};

updateCircle();
