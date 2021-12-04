// Default file

var file = {
    "name": "New Document",
    "offsetX": 150,
    "offsetY": 150,
    "scale": 1.2,
    "artboards": [
        {
            "color": "#FFFFFF",
            "x": 0,
            "y": 0,
            "width": 300,
            "height": 300,
            "layers": []
        }
    ]
};


// File handling

function importFile() {
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("style", "display:none");
    input.setAttribute("id", "importPicker");
    document.body.appendChild(input);
    input.click();
    parseFile();
}

function parseFile() {
    var input = document.getElementById("importPicker");
    if (input.files.length == 0) {
        setTimeout(parseFile, 100);
    } else {
        var fileReader = new FileReader();
        fileReader.onload = (function (result) {
            var newFile = JSON.parse(result.target.result);
            if (newFile != null) {
                file = newFile;
                draw();
            }
            input.remove();
        });
        fileReader.readAsText(input.files[0]);
    }
}

function downloadFile() {
    var string = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
    var link = document.createElement("a");
    link.setAttribute("href", string);
    link.setAttribute("download", file.name + ".json");
    document.body.appendChild(link);
    link.click();
    link.remove();
}


// PNG export

function exportArtboard() {
    if (selectedObject.artboard != null) {
        var artboard = file.artboards[selectedObject.artboard];
        var currentScale = file.scale;
        file.scale = parseFloat(safePrompt("Scale"));
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvas.width = artboard.width * file.scale;
        canvas.height = artboard.height * file.scale;
        context.fillStyle = artboard.color;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawLayers(context, artboard, 0, 0);

        // Download image
        var string = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.setAttribute("href", string);
        link.setAttribute("download", file.name + ".png");
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Reset state
        file.scale = currentScale;
        canvas = document.getElementById("main-canvas");
        context = canvas.getContext("2d");
        draw();
    }
}
