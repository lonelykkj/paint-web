const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorsBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");

const undoStack = [];

// Função para desfazer a última ação
const undoAction = () => {
    if (undoStack.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(undoStack.pop(), 0, 0);
    }
}

// Adicione um ouvinte de evento para a tecla "Ctrl + Z" (undo)
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        undoAction();
    }
});


let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
    brushWidth = 5,
selectedColor = "#000"


window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY );
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY );
}

const drawLosang = (e) => {
    ctx.beginPath();
    ctx.moveTo((prevMouseX + e.offsetX) / 2, prevMouseY);
    ctx.lineTo(e.offsetX, (prevMouseY + e.offsetY) / 2);
    ctx.lineTo((prevMouseX + e.offsetX) / 2, e.offsetY);
    ctx.lineTo(prevMouseX, (prevMouseY + e.offsetY) / 2);
    ctx.closePath();
    ctx.stroke();
    if (!fillColor.checked) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
};

const drawLinha = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};


const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    ctx.stroke();
    if (!fillColor.checked) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(snapshot);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "pincel" || selectedTool === "borracha") {
        ctx.strokeStyle = selectedTool === "borracha" ? "#fff" : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY); //criando linha de acordo com o ponteiro do mouse
        ctx.stroke(); //linha de desenho com cor    
    } else if (selectedTool === "square") {
        drawRect(e);
    }else if (selectedTool === "circle") {
        drawCircle(e);
    }else if (selectedTool === "losang") {
        drawLosang(e);
    }else if (selectedTool === "linha") {
        drawLinha(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id);
    })
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

