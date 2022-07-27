const downloadBtn = document.querySelector(".download"),
    undoBtn = document.querySelector(".undo-btn"),
    redoBtn = document.querySelector(".redo-btn"),    
    colorList = document.querySelectorAll(".color"),
    pencilThickness = document.querySelector(".pencil-thickness"),
    eraserThickness = document.querySelector(".eraser-thickness");

let canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    pencilStrokeWidth = pencilThickness.value,
    eraserStrokeWidth = eraserThickness.value,
    mouseDownCanvas = false,
    undoRedoArr = [],
    index = -1,
    pencilStrokeColor = "#db4437";

const eraserStrokeColor = "#f2f2f2";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = pencilStrokeColor;
ctx.lineWidth = pencilStrokeWidth;

// initialize empty screen
let url = canvas.toDataURL();
undoRedoArr.push(url);
index = undoRedoArr.length - 1;

canvas.addEventListener("mousedown", (evt) => {
    let coord = {
        x: evt.clientX,
        y: evt.clientY
    }
    mouseDownCanvas = true;
    socket.emit("beginPath", coord);
});

canvas.addEventListener("mousemove", (evt) => {
    if(mouseDownCanvas) {
        let coord = {
            x: evt.clientX,
            y: evt.clientY,
            color: isEraserControlVisible ? eraserStrokeColor : pencilStrokeColor,
            width: isEraserControlVisible ? eraserStrokeWidth : pencilStrokeWidth
        }
        socket.emit("drawPath", coord);
    }
});

canvas.addEventListener("mouseup", () => {
    if(mouseDownCanvas) {
        mouseDownCanvas = false;
        let url = canvas.toDataURL();
        undoRedoArr.push(url);
        index = undoRedoArr.length - 1;
    }
});


for(let i = 0; i < colorList.length; i++) {
    colorList[i].addEventListener("click", () => {
        pencilStrokeColor = colorList[i].classList[0];
        ctx.strokeStyle = pencilStrokeColor;
        ctx.lineWidth = pencilStrokeWidth;
    });
}

pencilThickness.addEventListener("change", () => {
    pencilStrokeWidth = pencilThickness.value;
    ctx.lineWidth = pencilStrokeWidth;
    ctx.strokeStyle = pencilStrokeColor;
});

eraserThickness.addEventListener("change", () => {
    eraserStrokeWidth = eraserThickness.value;
    ctx.lineWidth = eraserStrokeWidth;
    ctx.strokeStyle = eraserStrokeColor;
});

eraser.addEventListener("click", () => {
    if(isEraserControlVisible) {
        ctx.strokeStyle = eraserStrokeColor;
        ctx.lineWidth = eraserStrokeWidth;
    } else {
        ctx.strokeStyle = pencilStrokeColor;
        ctx.lineWidth = pencilStrokeWidth;
    }
});

downloadBtn.addEventListener("click", () => {
    let URL = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = URL;
    a.download = "board";
    a.click();
});

undoBtn.addEventListener("click", () => {
    if(index > 0) {
        index--;
        let obj = {
            index: index,
            undoRedoArr: undoRedoArr
        };
        socket.emit("undoRedoFn", obj);
    }
});

redoBtn.addEventListener("click", () => {
    if(index < undoRedoArr.length - 1) {
        index++;
        let obj = {
            index: index,
            undoRedoArr: undoRedoArr
        };
        socket.emit("undoRedoFn", obj);
    }
});

socket.on("beginPath", (coord) => {
    beginPath(coord);
});

socket.on("drawPath", (coord) => {
    drawPath(coord);
});

socket.on("undoRedoFn", (data) => {
    undoRedoFn(data);
});

const beginPath = (obj) => {
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
}

const drawPath = (obj) => {
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = obj.width;
    ctx.lineTo(obj.x, obj.y);
    ctx.stroke();
}

const undoRedoFn = (obj) => {

    let img = new Image();
    img.src = obj.undoRedoArr[obj.index];
    img.onload = () => {
        ctx.fillStyle = eraserStrokeColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}