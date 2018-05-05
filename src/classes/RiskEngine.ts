const X = 1000;
const Y = 600;
const TILES = 50;
const PLAYERS = 2;
const INITIAL_ARMY_NUMBER = 20;
const COLORS = [[255,0,0],
                [0,0,255]];

enum GameState {
    INITIALIZING,
    POSITIONING_ARMY,
    SELECTING_ATTACK_SOURCE,
    SELECTING_ATTACK_TARGET,
}

type Nullable<T> = T | null;

class RiskEngine {
    turnPlayerId : number;
    matrix : number[][];
    tiles : ITile[];
    players : IPlayer[];
    gameState : GameState;
    private currentTurn: ITakesAction;
    constructor(initialArmyNumber : number) {
        this.turnPlayerId = 1;
        this.gameState = GameState.INITIALIZING;
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

        // Calculate the center and borderers of the tiles for drawing the army circles
        this.tiles.forEach(tile => {
            tile.calculateCenter();
            tile.calculateBorderers(this.matrix, this.tiles);
        });
    
        // Fill water tiles positions with 0's
        for(var i = 0; i < X; i++) {
            for(var j = 0; j < Y; j++) {
                if (this.matrix[i][j] > tilesNumber)
                    this.matrix[i][j] = 0
            }
        }
    }

    click(tileNumber: number) {
        this.currentTurn.takeAction(this.tiles[tileNumber]);
        this.currentTurn = this.currentTurn.nextAction();

        // switch (this.gameState) {
        //     case GameState.INITIALIZING:
        //         console.log("Tile " + tileNumber + " clicked, current state: initializing");
        //         break;
        //     case GameState.POSITIONING_ARMY:
        //         console.log("Tile " + tileNumber + " clicked, current state: positioning army");
                
        //         var player = this.players[this.turnPlayerId - 1]
        //         var owner = this.tiles[tileNumber].owner

        //         if (owner == 0 || owner == player.id) {
        //             this.tiles[tileNumber].owner = player.id;
        //             this.tiles[tileNumber].armies += 1;
        //             player.armyToPosition -= 1;
        //             this.turnPlayerId = player.id == 1 ? 2 : 1;
        //             if (this.players[0].armyToPosition == 0 && this.players[1].armyToPosition == 0)
        //                 this.gameState = GameState.SELECTING_ATTACK_SOURCE
        //         }
        //         break;
        //     case GameState.SELECTING_ATTACK_SOURCE:
        //         console.log("Tile " + tileNumber + " clicked, current state: selecting attack source");

        //         break;
        //     case GameState.SELECTING_ATTACK_TARGET:
        //         console.log("Tile " + tileNumber + " clicked, current state: selecting attack target");
        //         break;
        //     default:
                
        //         break;
        // }
    }
}
