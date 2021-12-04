// Default mouse move event

var defaultMouseMove = (function (moveEvent) {
    cursorX = moveEvent.clientX;
    cursorY = moveEvent.clientY;
    draw();
});

// Mouse move event

document.onmousemove = defaultMouseMove;


// Mouse down event

document.onmousedown = (function (mouseEvent) {
    var previousX = 0
    var previousY = 0

    // Check for space modifier (pan around)
    if (isSpaceDown) {
        document.onmousemove = (function (moveEvent) {
            if (previousX == 0) {
                previousX = moveEvent.clientX;
                previousY = moveEvent.clientY;
            } else {
                file.offsetX -= (moveEvent.clientX - previousX) / file.scale;
                file.offsetY -= (moveEvent.clientY - previousY) / file.scale;
                previousX = moveEvent.clientX;
                previousY = moveEvent.clientY;
                draw();
            }
        });
    } else {
        // Highlight
        highlight.x = mouseEvent.clientX;
        highlight.y = mouseEvent.clientY;
        cursorHasText = false;
        document.onmousemove = (function (moveEvent) {
            highlight.width = moveEvent.clientX - mouseEvent.clientX;
            highlight.height = moveEvent.clientY - mouseEvent.clientY;
            draw();
        });
    }

    // Set end event
    document.onmouseup = (function (endEvent) {
        cursorX = endEvent.clientX;
        cursorY = endEvent.clientY;

        // Reset mouse move and selection
        document.onmousemove = defaultMouseMove;
        document.onmouseup = null;
        selectedObject = {"artboard": null, "layer": null};

        if (!cursorHasText) {
            if ((highlight.width == 0) && (highlight.height == 0)) {
                didClickAtPosition(endEvent.clientX, endEvent.clientY);
            }
        }

        cursorHasText = true;
        highlight = { "x": 0, "y": 0, "width": 0, "height": 0 };
        draw();
    });
});

// Click action

function didClickAtPosition(cursorX, cursorY) {
    // Find intersecting artboard
    var artboardIndex = null;
    hitboxes.find(function (value, index) {
        if ((cursorX >= value.x) && (cursorY >= value.y)) {
            if ((cursorX <= value.x + value.width) && (cursorY <= value.y + value.height)) {
                artboardIndex = index;
            }
        }
    });

    if (artboardIndex == null) { return };

    // Find intersecting layer
    var layerIndex = null;
    hitboxes[artboardIndex].layers.find(function (value, index) {
        if ((cursorX >= value.x) && (cursorY >= value.y)) {
            if ((cursorX <= value.x + value.width) && (cursorY <= value.y + value.height)) {
                layerIndex = index;
            }
        }
    });

    selectedObject = {"artboard": artboardIndex, "layer": layerIndex};
}

// Zoom action

document.onwheel = (function (zoomEvent) {
    file.scale += zoomEvent.deltaY * -0.01;
    if (file.scale < 0.3) {
        file.scale = 0.3;
    }
    draw();
});