const X = 1000;
const Y = 600;
const TILES = 50;
const PLAYERS = 2;
const COLORS = [[255,0,0],
                [0,0,255]];

type Nullable<T> = T | null;

class RiskEngine {
    matrix : number[][];
    tiles : ITile[];
    players : IPlayer[];
    private currentTurn: ITakesAction;
    constructor() {
        this.matrix = [];
        this.tiles = [];
        this.players = [];
              
        var tilesNumber = Math.floor(TILES / 2)
        var numberFilled = 0;
        var restTiles = tilesNumber;
        // Create players
        for(var i = PLAYERS; i >= 1; i--){
            var tilesToPlayer = 0;
            if(i == 1) {
                tilesToPlayer = restTiles;
            } else {
                tilesToPlayer = Math.floor((TILES-tilesNumber)/PLAYERS);
                restTiles -= tilesToPlayer;
            }
            this.players.unshift(new Player(i, COLORS[i-1], tilesToPlayer));
        }

        this.currentTurn = TurnFactory.getTurns(this.players)[0];

        // Create matrix
        for(var i = 0; i < X; i++){
            this.matrix[i] = new Array(Y).fill(0);
        }
        
        // Create tiles
        for(var i = 1; i <= TILES; i++) {
            this.tiles.push(new Tile(i, this.matrix));
            numberFilled++
        }
    
        // Expand the tiles (fill the matrix)
        while(numberFilled < X*Y) {
            var tileToTryAdd = Math.floor(Math.random() * TILES);
            numberFilled += this.tiles[tileToTryAdd].addSqm(this.matrix);
        }

        // Remove water tiles
        this.tiles = this.tiles.slice(0, tilesNumber)

    
        // Fill water tiles positions with 0's
        for(var i = 0; i < X; i++) {
            for(var j = 0; j < Y; j++) {
                if (this.matrix[i][j] > tilesNumber)
                    this.matrix[i][j] = 0
            }
        }

         // Calculate the center and borderers of the tiles for drawing the army circles
        this.tiles.forEach(tile => {
            tile.calculateCenter();
            tile.calculateBorderers(this.matrix, this.tiles);
        });
    }

    getMessage() : String {
        return this.currentTurn.getMessage();
    }

    action(tileNumber: number) {
        //console.log(this.tiles[tileNumber].borderers);
        this.currentTurn.takeAction(this.tiles[tileNumber]);
        this.currentTurn = this.currentTurn.nextAction();
    }
}
