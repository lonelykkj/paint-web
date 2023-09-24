const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
ctx = canvas.getContext("2d");

let isDrawing = false,
brushWidth = 5;


window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDraw = () => {
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY); //criando linha de acordo com o ponteiro do mouse
    ctx.stroke(); //linha de desenho com cor
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        console.log(btn.id);
    })
})

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);