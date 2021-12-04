// Global Variables

// Rendering
var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
var pixelRatio = window.devicePixelRatio;

// Input
var previousCursorX = 0;
var previousCursorY = 0;

// Selection
var hitboxes = [];
var selectedObject = {"artboard": null, "layer": null};

// Highlighting
var highlight = {
    "x": 0,
    "y": 0,
    "width": 0,
    "height": 0
}

// Cursor text
var currentText = "";
var cursorX = 0;
var cursorY = 0;
var cursorHasText = true;

var isSpaceDown = false;
var isAltDown = false;
var isShiftDown = false;


// Constants
const tintColor = "#FF7E9E";




// Utility functions

// Resize event

window.addEventListener("resize", function () {
    resize();
});

function resize() {
    canvas.width = window.innerWidth * pixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.height = window.innerHeight + "px";
    context.scale(pixelRatio, pixelRatio);

    draw();
}


// Default colors

function setToDefaultColor(input) {
    if (input.color == ".orange") {
        input.color = "#FF6D47";
    } else if (input.color == ".blue") {
        input.color = "#25DFE0";
    } else if (input.color == ".green") {
        input.color = "#19E0A3";
    } else if (input.color == ".red") {
        input.color = "#FD3D23";
    } else if (input.color == ".yellow") {
        input.color = "#FFBF1B";
    } else if (input.color == ".pink") {
        input.color = "#FF7E9E";
    } else if (input.color == ".mint") {
        input.color = "#7EFFC3";
    }
}


// Documentation

function showDocumentation() {
    var parameters = "location=no,toolbar=no,menubar=no,width=520,height=420,left=100,top=300";
    window.open("/resources/documentation/index.html", "Documentation", parameters);
}

// Safe(r) prompt wrapper

function safePrompt(question, value) {
    var newValue = window.prompt(question, value);
    if ((value == parseInt(value)) && (parseInt(value) == NaN)) {
        return value;
    } else if (newValue == null) {
        return value;
    }
    return newValue;
}


// Rendering utilities

CanvasRenderingContext2D.prototype.bubble = function (x, y, width, height) {
    var topLeftRadius = 3;
    this.beginPath();
    this.moveTo(x + height / 2, y);
    this.lineTo(x + width - height / 2, y);
    this.arcTo(x + width, y, x + width, y + height / 2, height / 2);
    this.arcTo(x + width, y + height, x + width - height / 2, y + height, height / 2);

    this.lineTo(x + height / 2, y + height);
    this.arcTo(x, y + height, x, y + height / 2, height / 2);
    this.arcTo(x, y, x + height / 2, y , topLeftRadius);

    this.closePath();
    return this;
}
