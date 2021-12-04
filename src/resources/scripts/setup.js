// Setup code

resize();

setTimeout(draw, 5); // Draw a second time when fonts are loaded
setTimeout(draw, 700); // Draw another time once fonts are downloaded for new users

window.onbeforeunload = function (unloadEvent) {
       return ""; // Prevent accidents
};