const pencil = document.querySelector(".pencil"),
    eraser = document.querySelector(".eraser"),
    imageUpload = document.querySelector(".image"),
    shareBtn = document.querySelector(".share-btn"),
    copyLinkBtn = document.querySelector(".copy-link-btn"),
    closePopupBtn = document.querySelector(".close-popup-btn"),
    stickyNoteBtn = document.querySelector(".sticky-note-btn"),
    sharePopup = document.querySelector(".share-popup"),
    overlay = document.querySelector(".overlay"),
    linkText = document.querySelector(".link-text"),
    pencilControls = document.querySelector(".pencil-controls"),
    eraserControls = document.querySelector(".eraser-controls");

let isPencilControlVisible = false,
    isEraserControlVisible = false,
    isShapesControlVisible = false;

pencil.addEventListener("click", () => {
    if(isPencilControlVisible) {
        pencilControls.classList.add("hide");
        isPencilControlVisible = false;
    } else {
        pencilControls.classList.remove("hide");
        isPencilControlVisible = true;
        eraserControls.classList.add("hide");
        isEraserControlVisible = false;
    }
});

eraser.addEventListener("click", () => {
    if(isEraserControlVisible) {
        eraserControls.classList.add("hide");
        isEraserControlVisible = false;
    } else {
        eraserControls.classList.remove("hide");
        isEraserControlVisible = true;
        pencilControls.classList.add("hide");
        isPencilControlVisible = false;
    }
});

shareBtn.addEventListener("click", () => {
    linkText.value = socket.io.uri;
    overlay.classList.remove("hide");
    sharePopup.classList.remove("hide");
});

closePopupBtn.addEventListener("click", () => {
    overlay.classList.add("hide");
    sharePopup.classList.add("hide");
});

copyLinkBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(linkText.value);
    alert("Link copied to clipboard.");
});

imageUpload.addEventListener("click", () => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", () => {
        const image = input.files[0];
        const url = URL.createObjectURL(image);
        let note = document.createElement("div");
        note.setAttribute("class", "sticky-note flex");
        note.innerHTML = `
        <div class="sticky-note__header flex flex-ai-c">
            <img class="remove-sticky-note" src="./img/close.png" alt="">
        </div>
        <div class="sticky-note__text-wrap">
            <img src="${url}" alt="">
        </div>
        `;
        document.body.appendChild(note);
    
        const removeBtn = note.querySelector(".remove-sticky-note");

        removeStickyNote(note, removeBtn);

        note.onmousedown = function(evt) {
            dragAndDrop(note, evt);
        };
        
        note.ondragstart = function() {
            return false;
        };
    });
});

stickyNoteBtn.addEventListener("click", () => {
    let note = document.createElement("div");
    note.setAttribute("class", "sticky-note flex");
    note.innerHTML = `
    <div class="sticky-note__header flex flex-ai-c">
        <img class="remove-sticky-note" src="./img/close.png" alt="">
    </div>
    <div class="sticky-note__text-wrap">
        <textarea name="sticky-text" id="" cols="30" rows="10"></textarea>
    </div>
    `;
    document.body.appendChild(note);
    
    const removeBtn = note.querySelector(".remove-sticky-note");

    removeStickyNote(note, removeBtn);

    note.onmousedown = function(evt) {
        dragAndDrop(note, evt);
    };
    
    note.ondragstart = function() {
        return false;
    };
});

const dragAndDrop = (ele, evt) => {
    let shiftX = evt.clientX - ele.getBoundingClientRect().left;
    let shiftY = evt.clientY - ele.getBoundingClientRect().top;

    ele.style.position = 'absolute';
    ele.style.zIndex = 1000;
    
    moveAt(evt.pageX, evt.pageY);
    
    function moveAt(pageX, pageY) {
        ele.style.left = pageX - shiftX + 'px';
        ele.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    
    ele.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        ele.onmouseup = null;
    };
}

const removeStickyNote = (ele, btn) => {
    btn.addEventListener("click", () => {
        document.body.removeChild(ele);
    });
}