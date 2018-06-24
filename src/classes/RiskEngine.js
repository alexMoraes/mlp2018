var X = 1000;
var Y = 600;
var TILES = 52;
var PLAYERS = 2;
var COLORS = [[255, 0, 0],
    [0, 0, 255]];
// type FAction = (tileId: number) => GameStatus;
// type GameStatus = { Players: FPlayer[], Tiles: FTile[], NextAction: FAction };
// type FPlayer = { Id : number, Code: number, Color: number[]};
// type FTile = { Id: number };
// let InitGame = function(players: number, tiles: number) : GameStatus {
//     console.log("Initializing game with " + players + " players and " + tiles + " tiles")
//     return {
//         Players: createPlayers(numberOfPlayers),
//         Tiles: [],
//         NextAction: function(tileId: number) { return InitGame(players, tiles) }
//     }
// }
// let playerColors = [[255,0,0], [0,0,255]];
// let createPlayer = function(id: number) : FPlayer {
//     return { Id: id, Code: id + 1, Color: playerColors[id] };
// }
// let createPlayers = function(n: number) : FPlayer[] {
//     if(n == 0) return [ createPlayer(0) ];
//     return createPlayers(n - 1).concat([ createPlayer(n) ]);
// }
// let numberOfPlayers = 2;
// let players = createPlayers(numberOfPlayers);
// let define = function<T>(a: T | null | undefined) : T {
//     if(a === undefined || a === null) throw new TypeError("Could not define");
//     return a;
// }
// // Closure sobre players e define()
// let getTurnPlayer = function(turn: number): FPlayer {
//     let p = players.find(player => player.Id == turn % 2);
//     return define(p);
// }
var RiskEngine = /** @class */ (function () {
    function RiskEngine() {
        var _this = this;
        this.matrix = [];
        this.tiles = [];
        this.players = [];
        var tilesNumber = Math.floor(TILES / 2);
        var numberFilled = 0;
        var restTiles = tilesNumber;
        // Create players
        for (var i = PLAYERS; i >= 1; i--) {
            var tilesToPlayer = 0;
            if (i == 1) {
                tilesToPlayer = restTiles;
            }
            else {
                tilesToPlayer = Math.floor((TILES - tilesNumber) / PLAYERS);
                restTiles -= tilesToPlayer;
            }
            this.players.unshift(new Player(i, COLORS[i - 1], tilesToPlayer));
        }
        // Create matrix
        for (var i = 0; i < X; i++) {
            this.matrix[i] = new Array(Y).fill(0);
        }
        // Create tiles
        for (var i = 1; i <= TILES; i++) {
            this.tiles.push(new Tile(i, this.matrix));
            numberFilled++;
        }
        // Expand the tiles (fill the matrix)
        while (numberFilled < X * Y) {
            var tileToTryAdd = Math.floor(Math.random() * TILES);
            numberFilled += this.tiles[tileToTryAdd].addSqm(this.matrix);
        }
        // Remove water tiles
        this.tiles = this.tiles.slice(0, tilesNumber);
        // Fill water tiles positions with 0's
        for (var i = 0; i < X; i++) {
            for (var j = 0; j < Y; j++) {
                if (this.matrix[i][j] > tilesNumber)
                    this.matrix[i][j] = 0;
            }
        }
        // Calculate the center and borderers of the tiles for drawing the army circles
        this.tiles.forEach(function (tile) {
            tile.calculateCenter();
            tile.calculateBorderers(_this.matrix, _this.tiles);
        });
        this.phases = [
            new SetupBoardPhase(this.players, this.tiles),
            new TurnsPhase(this.players),
            new EndPhase(this.players)
        ];
        this.phasePointer = 0;
        this.currentPhase = this.phases[0];
    }
    RiskEngine.prototype.getMessage = function () {
        return this.currentPhase.getMessage();
    };
    RiskEngine.prototype.action = function (tileNumber) {
        this.currentPhase.takeAction(this.tiles[tileNumber]);
        if (this.currentPhase.finished())
            this.nextPhase();
    };
    RiskEngine.prototype.nextPhase = function () {
        this.phasePointer++;
        this.currentPhase = this.phases[this.phasePointer];
    };
    return RiskEngine;
}());
