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

class RiskEngine {
    turn_player_id : number;
    matrix : number[][];
    tiles : Tile[];
    players : Player[];
    game_state : GameState;
    constructor(initial_army_number : number) {
        this.turn_player_id = 1;
        this.game_state = GameState.INITIALIZING;
        this.matrix = [];
        this.tiles = [];
        this.players = [];
              
        var tiles_number = Math.floor(TILES / 2)
        var numberFilled = 0;

        // Create players
        for(var i = 1; i <= PLAYERS; i++){
            this.players.push(new Player(i, COLORS[i-1], INITIAL_ARMY_NUMBER))
        }

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
        this.tiles = this.tiles.slice(0, tiles_number)

        // Calculate the center of the tiles for drawing the army circles
        this.tiles.forEach(tile => {
            tile.calculateCenter();
        });
    
        // Fill water tiles positions with 0's
        for(var i = 0; i < X; i++) {
            for(var j = 0; j < Y; j++) {
                if (this.matrix[i][j] > tiles_number)
                    this.matrix[i][j] = 0
            }
        }
    }

    click(tile_number: number) {
        switch (this.game_state) {
            case GameState.INITIALIZING:
                console.log("Tile " + tile_number + " clicked, current state: initializing");
                break;
            case GameState.POSITIONING_ARMY:
                console.log("Tile " + tile_number + " clicked, current state: positioning army");
                
                var player = this.players[this.turn_player_id - 1]
                var owner = this.tiles[tile_number].owner

                if (owner == 0 || owner == player.id) {
                    this.tiles[tile_number].owner = player.id;
                    this.tiles[tile_number].armies += 1;
                    player.army_to_position -= 1;
                    this.turn_player_id = player.id == 1 ? 2 : 1;
                    if (this.players[0].army_to_position == 0 && this.players[1].army_to_position == 0)
                        this.game_state = GameState.SELECTING_ATTACK_SOURCE
                }
                break;
            case GameState.SELECTING_ATTACK_SOURCE:
                console.log("Tile " + tile_number + " clicked, current state: selecting attack source");

                break;
            case GameState.SELECTING_ATTACK_TARGET:
                console.log("Tile " + tile_number + " clicked, current state: selecting attack target");
                break;
            default:
                
                break;
        }
    }
}
