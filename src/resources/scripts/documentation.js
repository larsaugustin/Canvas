// Documentation code

var isDocumentationVisible = true;

function toggleDocumentation() {
    if (isDocumentationVisible) {
        document.getElementById("documentationFrame").style.right = "-300px";
        document.getElementById("documentationButton").style.right = "20px";
        document.getElementById("documentationButton").innerHTML = "←";
        isDocumentationVisible = false;
    } else {
        document.getElementById("documentationFrame").style.right = "20px";
        document.getElementById("documentationButton").style.right = "330px";
        document.getElementById("documentationButton").innerHTML = "→";
        isDocumentationVisible = true;
    }
}