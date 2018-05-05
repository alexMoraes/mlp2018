var a;
var colorMap;
var XX = 1000;
var YY = 600;
var img;

function setup() {
    createCanvas(XX, YY);
    risk = new RiskEngine();
    console.log(risk)
    noLoop();
    textSize(25);
    colorMap = [];
    colorMap[0] = [66, 191, 237]; // Água
    for(var i = 1; i <= risk.tiles.length; i++) {
        colorMap[i] = [180, 198, 123]; // Terra
    }
    img = createImage(XX, YY);
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            // If it's a border
            if (x != 0 && y != 0 &&  x != img.width - 1 && y != img.height - 1 && (risk.matrix[x+1][y] != risk.matrix[x][y] || 
                                                                                   risk.matrix[x-1][y] != risk.matrix[x][y] ||
                                                                                   risk.matrix[x][y+1] != risk.matrix[x][y] || 
                                                                                   risk.matrix[x][y-1] != risk.matrix[x][y] || 
                                                                                   risk.matrix[x+1][y+1] != risk.matrix[x][y] ||
                                                                                   risk.matrix[x+1][y-1] != risk.matrix[x][y] ||
                                                                                   risk.matrix[x-1][y-1] != risk.matrix[x][y] ||
                                                                                   risk.matrix[x-1][y+1] != risk.matrix[x][y]))
              img.set(x, y, color(0, 0, 0));
            else
              img.set(x, y, color(colorMap[risk.matrix[x][y]][0], colorMap[risk.matrix[x][y]][1], colorMap[risk.matrix[x][y]][2]));
        }
    }
    img.updatePixels();
    image(img, 0, 0);
    risk.gameState = GameState.POSITIONING_ARMY;
}

function draw() {
    for (var i = 0; i < risk.tiles.length; i++) {
        tile = risk.tiles[i]
        if (tile.owner != 0) {
            color = risk.players[tile.owner - 1].color;
            x = risk.tiles[i].center[0];
            y = risk.tiles[i].center[1];
            fill(color[0], color[1], color[2]);
            ellipse(x, y, 40, 40);
            fill(0, 0, 0);
            text(String(tile.armies), x - 7, y + 9);
        }
    }
}

function mouseClicked() {
    var tileId = risk.matrix[Math.floor(mouseX)][Math.floor(mouseY)];
    if (tileId > 0) {
        tileIndex = tileId - 1;
        risk.click(tileIndex);
        draw();
    }
}