var a;
var colorMap;
var XX = 1000;
var YY = 600;
var img;

function setup() {
    createCanvas(XX, YY);
    a = run();
    noLoop();
    colorMap = [];
    for(var i = 1; i <= 70; i++) {
        if(i < 40)
            colorMap[i] = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 80)];
        else 
            colorMap[i] = [0, 0, 255];
    }
    img = createImage(XX, YY);
    img.loadPixels();
}

function draw() {
    // background(0);
    // for(var x = 0; x < XX; x++) {
    //     for(var y = 0; y < YY; y++) {
    //         stroke(colorMap[a[x][y]][0], colorMap[a[x][y]][1], colorMap[a[x][y]][2]);
    //         fill(colorMap[a[x][y]][0], colorMap[a[x][y]][1], colorMap[a[x][y]][2]);
    //         point(x,y);
    //     }
    // }

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            img.set(x, y, color(colorMap[a[x][y]][0], colorMap[a[x][y]][1], colorMap[a[x][y]][2]));
        }
    }
    img.updatePixels();
    image(img, 0, 0);
}

function mouseClicked() {
    colorMap[a[mouseX][mouseY]] = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 80)];
    draw();
}