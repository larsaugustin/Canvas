// Default File

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

