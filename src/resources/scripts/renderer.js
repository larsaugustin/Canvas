// Main draw function

function draw() {

    // Clear everything
    context.clearRect(0, 0, canvas.width, canvas.height);
    hitboxes = [];

    // Draw
    drawArtboards(context);
    drawSelection(context);
    drawHighlight(context);
    drawCursor(context);
}


// Artboards

function drawArtboards(context) {
    var offsetX = file.offsetX * file.scale;
    var offsetY = file.offsetY * file.scale;

    for (const a in file.artboards) {
        var artboard = file.artboards[a];
        context.fillStyle = artboard.color;

        context.shadowColor = "rgba(0, 0, 0, 0.1)";
        context.shadowBlur = 5;
        context.shadowOffsetY = 2;

        var artboardX = artboard.x * file.scale + ((canvas.width / (pixelRatio * 2)) - offsetX);
        var artboardY = artboard.y * file.scale + ((canvas.height / (pixelRatio * 2)) - offsetY);

        context.fillRect(artboardX, artboardY,
            artboard.width * file.scale, artboard.height * file.scale);


        // Draw all layers and generate hit boxes
        var layerHitboxes = drawLayers(context, artboard, artboardX, artboardY);
        hitboxes.push({
            "index": a,
            "x": artboardX,
            "y": artboardY,
            "width": artboard.width * file.scale,
            "height": artboard.height * file.scale,
            "layers": layerHitboxes
        });

        // Draw grid if necessary
        if (file.scale > 7) {
            context.fillStyle = "rgba(0, 0, 0, 0.1)";
            var currentPosition = 1;
            while (currentPosition < artboard.width) {
                context.fillRect(currentPosition * file.scale + artboardX, artboardY, 1, artboard.height * file.scale);
                currentPosition++;
            }
            currentPosition = 1;
            while (currentPosition < artboard.height) {
                context.fillRect(artboardX, currentPosition * file.scale + artboardY, artboard.width * file.scale, 1);
                currentPosition++;
            }
        }
    }
}


// Layers

function drawLayers(context, artboard, artboardX, artboardY) {
    var finalHitboxes = [];

    for (const l in artboard.layers) {
        var layer = artboard.layers[l];
        context.fillStyle = layer.color;

        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        // Layer types
        if (layer.type == "rect") {
            context.fillRect(artboardX + layer.x * file.scale, artboardY + layer.y * file.scale, layer.width * file.scale, layer.height * file.scale);

            finalHitboxes.push({
                "index": l,
                "x": artboardX + layer.x * file.scale,
                "y": artboardY + layer.y * file.scale,
                "width": layer.width * file.scale,
                "height": layer.height * file.scale
            });
        } else if (layer.type == "triangle") {
            context.beginPath();
            var height = Math.round(Math.pow(3, 0.5) * 0.5 * layer.length);
            var layerX = artboardX / file.scale + layer.x;
            var layerY = artboardY / file.scale + layer.y;
            context.moveTo((layerX + 0.5 * layer.length) * file.scale, layerY * file.scale);
            context.lineTo((layerX + layer.length) * file.scale, (layerY + height) * file.scale);
            context.lineTo(layerX * file.scale, (layerY + height) * file.scale);
            context.lineTo((layerX + 0.5 * layer.length) * file.scale, layerY * file.scale);
            context.fill();

            finalHitboxes.push({
                "index": l,
                "x": layerX * file.scale,
                "y": layerY * file.scale,
                "width": layer.length * file.scale,
                "height": height * file.scale
            });
        } else if (layer.type == "circle") {
            context.beginPath();
            context.arc(artboardX + layer.radius * file.scale + layer.x * file.scale, artboardY + layer.radius * file.scale + layer.y * file.scale, layer.radius * file.scale, 0, 2 * Math.PI);
            context.fill();

            finalHitboxes.push({
                "index": l,
                "x": artboardX + layer.x * file.scale,
                "y": artboardY + layer.y * file.scale,
                "width": layer.radius * 2 * file.scale,
                "height": layer.radius * 2 * file.scale
            });
        } else if (layer.type == "text") {
            var fontSize = layer.fontSize * file.scale;
            context.font = layer.fontStyle + " " + fontSize + "px " + layer.font;

            var lines = layer.text.split(";");
            var currentY = artboardY + layer.y * file.scale + fontSize;
            var maxWidth = 0;
            for (const l in lines) {
                var line = lines[l];
                context.fillText(line, artboardX + layer.x * file.scale, currentY);
                currentY += fontSize * 1.2;
                if (maxWidth < context.measureText(line).width) {
                    maxWidth = context.measureText(line).width;
                }
            }

            finalHitboxes.push({
                "index": l,
                "x": artboardX + layer.x * file.scale,
                "y": artboardY + layer.y * file.scale,
                "width": maxWidth,
                "height": fontSize * 1.2 * lines.length
            });
        }
    }
    return finalHitboxes;
}


// Selection rectangle

function drawSelection(context) {
    if (selectedObject.artboard != null) {
        context.lineWidth = 1.5;
        if (selectedObject.layer == null) {
            let artboard = hitboxes[selectedObject.artboard];
            context.strokeStyle = tintColor;
            context.strokeRect(artboard.x, artboard.y, artboard.width, artboard.height);
        } else {
            let layer = hitboxes[selectedObject.artboard].layers[selectedObject.layer];
            context.strokeStyle = tintColor;
            context.strokeRect(layer.x, layer.y, layer.width, layer.height);
        }
    }
}


// Highlight

function drawHighlight(context) {
    if ((highlight.width != 0) && (highlight.height != 0)) {
        context.fillStyle = "rgba(255, 255, 255, 0.15)";
        context.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);
    }
}


// Cursor

function drawCursor(context) {
    if ((currentText.length != 0) && (cursorHasText)) {
        context.beginPath();
        context.bubble(cursorX + 15, cursorY + 15, currentText.length * 10.9 + 20, 30);
        context.fillStyle = tintColor;
        context.fill();
        context.font = "18px IBM Plex Mono";
        context.fillStyle = "#FFFFFF";

        context.fillText(currentText, cursorX + 15 + 10, cursorY + 15 + 21);
    }
}