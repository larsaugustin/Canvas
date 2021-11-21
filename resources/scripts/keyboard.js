// Keyboard event handling

document.addEventListener("keydown", function(keyEvent) {
    if ((currentText == "") && (keyEvent.keyCode == 32)) {
        isSpaceDown = true;
        canvas.style.cursor = "grab";
    } else {
        if ((48 <= keyEvent.keyCode) && (90 >= keyEvent.keyCode)) {
            currentText += String.fromCharCode(keyEvent.keyCode).toLowerCase();
        } else if (keyEvent.keyCode == 8) {
            if (currentText.length != 0) {
                currentText = currentText.substring(0, currentText.length - 1);
            } else {
                currentText = "delete";
                didPressEnter();
            }
        } else if (keyEvent.keyCode == 32) {
            currentText += " ";
        } else if (keyEvent.keyCode == 37) {
            move("left");
        } else if (keyEvent.keyCode == 38) {
            move("up");
        } else if (keyEvent.keyCode == 39) {
            move("right");
        } else if (keyEvent.keyCode == 40) {
            move("down");
        } else if (keyEvent.keyCode == 18) {
            isAltDown = true;
        } else if (keyEvent.keyCode == 16) {
            isShiftDown = true;
        } else if (keyEvent.keyCode == 13) {
            didPressEnter();
        } else if (keyEvent.keyCode == 27) {
            if (currentText.length != 0) {
                currentText = "";
            } else if (selectedObject.layer != null) {
                selectedObject.layer = null;
            } else {
                selectedObject.artboard = null;
            }
        }
    }
    draw();
});


// Keyboard end event handling (modifiers were released)

document.addEventListener("keyup", function(keyEvent) {
    if (keyEvent.keyCode == 18) {
        isAltDown = false;
    } else if (keyEvent.keyCode == 16) {
        isShiftDown = false;
    } else if ((currentText == "") && (keyEvent.keyCode == 32)) {
        isSpaceDown = false;
        canvas.style.cursor = "crosshair";
    }
});

// Keyboard move events

function move(direction) {
    if ((selectedObject.artboard == null) || (selectedObject.layer == null)) { return };
    var layer = file.artboards[selectedObject.artboard].layers[selectedObject.layer];
    var increment = isShiftDown ? 10 : 1;
    if (isAltDown) {
        if (layer.type == "text") {
            if (direction == "left") {
                layer.fontSize -= increment;
            } else if (direction == "right") {
                layer.fontSize += increment;
            }
        } else if (layer.type == "triangle") {
            if (direction == "left") {
                layer.length -= increment;
            } else if (direction == "right") {
                layer.length += increment;
            }
        } else if (layer.type == "circle") {
            if (direction == "left") {
                layer.radius -= increment;
            } else if (direction == "right") {
                layer.radius += increment;
            }
        } else if (layer.type == "rect") {
            if (direction == "left") {
                layer.width -= increment;
            } else if (direction == "right") {
                layer.width += increment;
            } else if (direction == "up") {
                layer.height -= increment;
            } else if (direction == "down") {
                layer.height += increment;
            }
        }
    } else {
        if (direction == "left") {
            layer.x -= increment;
        } else if (direction == "up") {
            layer.y -= increment;
        } else if (direction == "right") {
            layer.x += increment;
        } else if (direction == "down") {
            layer.y += increment;
        }
    }
    draw();
}


// Keyboard confirmation: Run command

function didPressEnter() {
    if (currentText == "artboard") {
        var lastArtboard = file.artboards[file.artboards.length - 1];
        var newArtboard = {
            "color": "#FFFFFF",
            "x": lastArtboard.x + lastArtboard.width + 20,
            "y": 0,
            "width": 300,
            "height": 300,
            "layers": []
        };
        file.artboards.push(newArtboard);
    } else if (selectedObject.layer == null) {
        if (selectedObject.artboard != null) {
            var artboard = file.artboards[selectedObject.artboard];
            if (currentText == "rect") {
                var newLayer = {
                    "type": "rect",
                    "color": "#333333",
                    "x": 140,
                    "y": 140,
                    "width": 20,
                    "height": 20
                };
                artboard.layers.push(newLayer);
            } else if (currentText == "triangle") {
                var newLayer = {
                    "type": "triangle",
                    "color": "#333333",
                    "x": 140,
                    "y": 140,
                    "length": 20
                };
                artboard.layers.push(newLayer);
            } else if (currentText == "circle") {
                var newLayer = {
                    "type": "circle",
                    "color": "#333333",
                    "x": 140,
                    "y": 140,
                    "radius": 10
                };
                artboard.layers.push(newLayer);
            } else if (currentText == "text") {
                var newLayer = {
                    "type": "text",
                    "color": "#333333",
                    "x": 60,
                    "y": 140,
                    "text": safePrompt("Text"),
                    "font": "Inter",
                    "fontSize": 20,
                    "fontStyle": ""
                }
                artboard.layers.push(newLayer);
            } else if (currentText == "x") {
                artboard.x = parseInt(safePrompt("X", artboard.x));
            } else if (currentText == "y") {
                artboard.y = parseInt(safePrompt("Y", artboard.y));
            } else if (currentText == "width") {
                artboard.width = parseInt(safePrompt("Width", artboard.width));
            } else if (currentText == "height") {
                artboard.height = parseInt(safePrompt("Height", artboard.height));
            } else if (currentText == "color") {
                artboard.color = safePrompt("Color", artboard.color);
                setToDefaultColor(artboard);
            } else if (currentText == "clear") {
                artboard.layers = []
            } else if (currentText == "duplicate") {
                var currentArtboard = JSON.parse(JSON.stringify(file.artboards[selectedObject.artboard]));
                var lastArtboard = file.artboards[file.artboards.length - 1];
                currentArtboard.x = lastArtboard.x + lastArtboard.width + 20;
                file.artboards.push(currentArtboard);
            } else if (currentText == "delete") {
                file.artboards.splice(selectedObject.artboard, 1);
                selectedObject = {"artboard": null, "layer": null};
            }
        } else if (currentText == "name") {
            file.name = safePrompt("Name", file.name);
            document.title = file.name + " — Canvas";
        } else if (currentText == "download") {
            downloadFile();
        } else if (currentText == "import") {
            importFile();
        }
    } else {
        var layer = file.artboards[selectedObject.artboard].layers[selectedObject.layer];
        if (currentText == "color") {
            layer.color = safePrompt("Color", layer.color);
            setToDefaultColor(layer);
        } else if (currentText == "x") {
            layer.x = parseInt(safePrompt("X", layer.x));
        } else if (currentText == "y") {
            layer.y = parseInt(safePrompt("Y", layer.y));
        } else if (currentText == "delete") {
            file.artboards[selectedObject.artboard].layers.splice(selectedObject.layer, 1);
            selectedObject = {"artboard": selectedObject.artboard, "layer": null};
        } else if (currentText == "duplicate") {
            var currentLayer = Object.assign({}, layer);
            file.artboards[selectedObject.artboard].layers.push(currentLayer);
        } else if (layer.type == "text") {
            if (currentText == "text") {
                layer.text = safePrompt("Text", layer.text);
            } else if (currentText == "font") {
                layer.font = safePrompt("Font", layer.font);
            } else if (currentText == "size") {
                layer.fontSize = parseInt(safePrompt("Font Size", layer.fontSize));
            } else if (currentText == "style") {
                layer.fontStyle = safePrompt("Font Style", layer.fontStyle);
            }
        } else if (layer.type == "triangle") {
            if (currentText == "length") {
                layer.length = parseInt(safePrompt("Length", layer.length));
            }
        } else if (layer.type == "circle") {
            if (currentText == "radius") {
                layer.radius = parseInt(safePrompt("Radius", layer.radius));
            }
        } else if (layer.type == "rect") {
            if (currentText == "width") {
                layer.width = parseInt(safePrompt("Width", layer.width));
            } else if (currentText == "height") {
                layer.height = parseInt(safePrompt("Height", layer.height));
            }
        }
    }
    currentText = "";
    draw();
}