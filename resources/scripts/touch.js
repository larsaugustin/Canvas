// Basic touch support

if (navigator.maxTouchPoints != 0) {
    setupTouchEvents();
}

function setupTouchEvents() {
    var touchX = 0;
    var touchY = 0;

    canvas.ontouchstart = (function (event) {
        touchX = event.layerX;
        touchY = event.layerY;
    })
    canvas.ontouchmove = (function (event) {
        console.log(event);
        file.offsetX -= (event.layerX - touchX) / file.scale;
        file.offsetY -= (event.layerY - touchY) / file.scale;
        touchX = event.layerX;
        touchY = event.layerY;
        console.log(file.offsetX);
        console.log(file.offsetY);
        draw();
    })
}