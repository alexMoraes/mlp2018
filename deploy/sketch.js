var a;
var colorMap;
var XX = 1000;
var YY = 600;
var img;

function setup() {
    createCanvas(XX, YY);
<<<<<<< HEAD
    riskOO = new RiskEngine();
    risk = Functional.InitGame(riskOO.players.length, riskOO.tiles);
    console.log("Initializing game with " + risk.Players.length + " players and " + risk.Tiles.length + " tiles")
    risk.matrix = riskOO.matrix;
=======
    risk = Functional.InitGame(2, 52);
    console.log("Initializing game with " + risk.Players.length + " players and " + risk.Tiles.length + " tiles")
    console.log(risk);
    
    //riskOO = new RiskEngine();
    risk.matrix = risk.Matrix;
>>>>>>> Tile methods to functions
    //console.log(risk)
    noLoop();
    textSize(25);
    colorMap = [];
    colorMap[0] = [66, 191, 237]; // Água
    risk.tiles = risk.Tiles;
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
    if(risk.getMessage)
        console.log(risk.getMessage());
}

function draw() {
<<<<<<< HEAD
    console.log(risk.GamePhase + ": " + risk.Message);
    for (var i = 0; i < risk.Tiles.length; i++) {
        tile = risk.Tiles[i]
        if (tile.Owner !== undefined) {
            // var player = risk.players[tile.owner - 1]
            var player = tile.Owner
            color = player.Color;
            x = risk.Tiles[i].center[0];
            y = risk.Tiles[i].center[1];
=======
    for (var i = 0; i < risk.tiles.length; i++) {
        tile = risk.tiles[i]
        if (!Functional.isFree(tile)) {
            var player = risk.players[tile.owner - 1]
            color = player.color;
            x = risk.tiles[i].center[0];
            y = risk.tiles[i].center[1];
>>>>>>> Tile methods to functions
            if (player.selectedTile != null && player.selectedTile.id == tile.id)
                fill(color[0]-100, color[1]-100, color[2]-100);
            else
                fill(color[0], color[1], color[2]);
            ellipse(x, y, 40, 40);
            fill(0, 0, 0);
            text(String(tile.Armies), x - 7, y + 9);
        }
    }
}

function mouseClicked() {
    var tileId = risk.matrix[Math.floor(mouseX)][Math.floor(mouseY)];
    risk = Functional.takeAction(risk, tileId);
    risk = Functional.nextState(risk);
    risk.matrix = riskOO.matrix;
    draw();
    //risk.NextAction(tileId);
    // if (tileId > 0) {
    //     tileIndex = tileId - 1;
    //     risk.action(tileIndex);
    //     console.clear();
    //     console.log(risk.getMessage());
    //     draw();
    // }
}