"use strict";
class Die {
    constructor() {
        this.result = 0;
    }
    roll() {
        this.result = Math.ceil(Math.random() * 6);
    }
    getResult() {
        return this.result;
    }
}
class Attack {
    constructor(player) {
        this.attackingTile = null;
        this.defendingTile = null;
        this.player = player;
    }
    setAttackingTile(tile) {
        this.attackingTile = tile;
    }
    setDefendingTile(tile) {
        this.defendingTile = tile;
    }
    resolve() {
        if (this.attackingTile == null || this.defendingTile == null)
            return;
        var attackers = Math.min(this.attackingTile.armies - 1, 3);
        var defenders = Math.min(this.defendingTile.armies, 2);
        var attackingDice = [];
        var defendingDice = [];
        for (var i = 0; i < attackers; i++) {
            var die = new Die();
            die.roll();
            attackingDice.push(die);
        }
        attackingDice = attackingDice.sort((x, y) => y.getResult() - x.getResult());
        for (var i = 0; i < defenders; i++) {
            var die = new Die();
            die.roll();
            defendingDice.push(die);
        }
        defendingDice = defendingDice.sort((x, y) => y.getResult() - x.getResult());
        var takenDice = Math.min(defenders, attackers);
        for (var i = 0; i < takenDice; i++) {
            if (attackingDice[i].getResult() > defendingDice[i].getResult())
                this.defendingTile.addArmy(-1);
            else {
                this.attackingTile.addArmy(-1);
                attackers--;
            }
        }
        if (this.defendingTile.armies == 0) {
            this.defendingTile.owner = 0;
            this.player.takeTile(this.defendingTile, attackers);
            this.attackingTile.addArmy(-attackers);
        }
    }
    reset() {
        this.attackingTile = null;
        this.defendingTile = null;
    }
}
class Player {
    constructor(id, color, armies) {
        this.id = id;
        this.color = color;
        this.armies = armies;
        this.ownedTiles = [];
        this.selectedTile = null;
    }
    giveArmies(armies) {
        this.armies = this.armies + armies;
    }
    placeArmies(tile, armies) {
        if (tile) {
            if (!tile.hasOwner() || tile.owner != this.id) {
                // must have an owner at this time of game
                return false;
            }
            tile.addArmy(armies);
            this.armies -= armies;
            return true;
        }
        else {
            return false;
        }
    }
    armiesToPlace() {
        return this.armies;
    }
    selectTile(tile) {
        this.clearSelectedTile();
        if (tile.owner == this.id) {
            this.selectedTile = tile;
            return true;
        }
        else {
            return false;
        }
    }
    clearSelectedTile() {
        this.selectedTile = null;
    }
    takeTile(tile, armies) {
        if (tile) {
            if (!tile.hasOwner()) {
                tile.setOwner(this.id);
                this.ownedTiles.push(tile);
                tile.addArmy(armies);
                this.armies -= armies;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    getSelectedTile() {
        return this.selectedTile;
    }
    ownsTile(tile) {
        return tile.owner == this.id;
    }
    totalTiles() {
        this.ownedTiles = this.ownedTiles.filter(x => x.owner == this.id);
        return this.ownedTiles.length;
    }
    attackOptions() {
        return this.ownedTiles.filter(x => x.armies > 1 && x.borderers.filter(y => y.owner != this.id).length > 0);
    }
}
const X = 1000;
const Y = 600;
const TILES = 52;
const PLAYERS = 2;
const COLORS = [[255, 0, 0],
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
class RiskEngine {
    constructor() {
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
        this.tiles.forEach(tile => {
            tile.calculateCenter();
            tile.calculateBorderers(this.matrix, this.tiles);
        });
        this.phases = [
            new SetupBoardPhase(this.players, this.tiles),
            new TurnsPhase(this.players),
            new EndPhase(this.players)
        ];
        this.phasePointer = 0;
        this.currentPhase = this.phases[0];
    }
    getMessage() {
        return this.currentPhase.getMessage();
    }
    action(tileNumber) {
        this.currentPhase.takeAction(this.tiles[tileNumber]);
        if (this.currentPhase.finished())
            this.nextPhase();
    }
    nextPhase() {
        this.phasePointer++;
        this.currentPhase = this.phases[this.phasePointer];
    }
}
class Tile {
    constructor(id, matrix) {
        this.id = id;
        do {
            var row = Math.floor(Math.random() * X);
            var column = Math.floor(Math.random() * Y);
        } while (matrix[row][column] != 0);
        matrix[row][column] = this.id;
        this.borderers = [];
        this.sqms = [];
        this.sqms.push([row, column]);
        this.owner = 0;
        this.armies = 0;
        this.center = [0, 0];
    }
    isAbleToAttack() {
        return this.armies > 1;
    }
    addArmy(armies) {
        this.armies += armies;
    }
    setArmy(armies) {
        this.armies = armies;
    }
    hasOwner() {
        return this.owner > 0;
    }
    setOwner(ownerId) {
        this.owner = ownerId;
    }
    addSqm(matrix) {
        var borders = this.getBorder(matrix);
        if (borders.length > 0) {
            var sqmAddedAmount = 0;
            var amountChosen = Math.floor(Math.random() * borders.length);
            while (amountChosen > 0) {
                var chosen = borders[Math.floor(Math.random() * borders.length)];
                if (matrix[chosen[0]][chosen[1]] == 0) {
                    matrix[chosen[0]][chosen[1]] = this.id;
                    sqmAddedAmount++;
                    this.sqms.push(chosen);
                }
                amountChosen--;
            }
            return sqmAddedAmount;
        }
        else {
            return 0;
        }
    }
    getBorder(matrix) {
        var borders = [];
        var min = 0;
        var maxX = X - 1;
        var maxY = Y - 1;
        this.sqms.forEach(sqm => {
            var row = sqm[0];
            var column = sqm[1];
            var key;
            if (row + 1 <= maxX && matrix[row + 1][column] == 0) {
                key = [row + 1, column];
                borders.push(key);
            }
            if (row - 1 >= min && matrix[row - 1][column] == 0) {
                key = [row - 1, column];
                borders.push(key);
            }
            if (column - 1 >= min && matrix[row][column - 1] == 0) {
                key = [row, column - 1];
                borders.push(key);
            }
            if (column + 1 <= maxY && matrix[row][column + 1] == 0) {
                key = [row, column + 1];
                borders.push(key);
            }
        });
        return borders;
    }
    calculateCenter() {
        var points = this.sqms.length;
        var x = 0;
        var y = 0;
        this.sqms.forEach(sqm => {
            x += sqm[0];
            y += sqm[1];
        });
        this.center = [x / points, y / points];
    }
    calculateBorderers(matrix, tiles) {
        var min = 0;
        var maxX = X - 1;
        var maxY = Y - 1;
        this.sqms.forEach(sqm => {
            var row = sqm[0];
            var column = sqm[1];
            var key;
            if (row + 1 <= maxX && matrix[row + 1][column] != 0 && matrix[row + 1][column] != this.id && !this.borderers.some(c => c.id == matrix[row + 1][column])) {
                this.borderers.push(tiles[matrix[row + 1][column] - 1]);
            }
            if (row - 1 >= min && matrix[row - 1][column] != 0 && matrix[row - 1][column] != this.id && !this.borderers.some(c => c.id == matrix[row - 1][column])) {
                this.borderers.push(tiles[matrix[row - 1][column] - 1]);
            }
            if (column - 1 >= min && matrix[row][column - 1] != 0 && matrix[row][column - 1] != this.id && !this.borderers.some(c => c.id == matrix[row][column - 1])) {
                this.borderers.push(tiles[matrix[row][column - 1] - 1]);
            }
            if (column + 1 <= maxY && matrix[row][column + 1] != 0 && matrix[row][column + 1] != this.id && !this.borderers.some(c => c.id == matrix[row][column + 1])) {
                this.borderers.push(tiles[matrix[row][column + 1] - 1]);
            }
        });
    }
}
class Turn {
    constructor(player) {
        this.phasePointer = 0;
        this.initialized = false;
        this.player = player;
        this.phases = [
            new DeployPhase(player),
            new AttackPhase(player)
        ];
        this.currentPhase = this.phases[0];
    }
    nextPhase() {
        this.phasePointer++;
        this.currentPhase = this.phases[this.phasePointer];
        this.initialized = false;
    }
    getMessage() {
        if (!this.initialized) {
            this.currentPhase.setup();
            this.initialized = true;
        }
        return this.currentPhase.getMessage();
    }
    takeAction(tile) {
        this.currentPhase.takeAction(tile);
        if (this.currentPhase.finished())
            this.nextPhase();
    }
    finished() {
        return this.phasePointer == this.phases.length;
    }
}
class GamePhase {
    constructor(players) {
        this.playerPointer = 0;
        this.players = players;
    }
    nextPlayer() {
        this.playerPointer = (this.playerPointer + 1) % this.players.length;
    }
}
/// <reference path="GamePhase.ts"/>
class EndPhase extends GamePhase {
    getMessage() {
        return "Game over";
    }
    takeAction(tile) {
    }
    finished() {
        return false;
    }
}
class SetupBoardPhase extends GamePhase {
    constructor(players, tiles) {
        super(players);
        this.tilesTaken = 0;
        this.players = players;
        this.tiles = tiles;
    }
    finished() {
        return this.tilesTaken == this.tiles.length;
    }
    takeAction(tile) {
        var success = this.players[this.playerPointer].takeTile(tile, 1);
        if (success) {
            this.tilesTaken++;
            this.nextPlayer();
        }
    }
    getMessage() {
        return "Jogador " + this.players[this.playerPointer].id + ": escolha um territorio para dominar";
    }
}
class TurnsPhase extends GamePhase {
    constructor(players) {
        super(players);
        this.players = players;
        this.currentTurn = new Turn(players[0]);
    }
    nextTurn() {
        this.nextPlayer();
        this.currentTurn = new Turn(this.players[this.playerPointer]);
    }
    finished() {
        return this.players.filter(x => x.totalTiles() > 0).length == 1;
    }
    takeAction(tile) {
        this.currentTurn.takeAction(tile);
        if (this.currentTurn.finished())
            this.nextTurn();
    }
    getMessage() {
        return this.currentTurn.getMessage();
    }
}
class SelectAttackerStep {
    constructor(player, attack) {
        this.success = false;
        this.player = player;
        this.attack = attack;
    }
    getMessage() {
        return "Jogador " + this.player.id + ": escolha um de seus territorios para atacar.";
    }
    takeAction(tile) {
        if (!tile.isAbleToAttack())
            this.success = false;
        else {
            this.success = this.player.selectTile(tile);
            this.attack.setAttackingTile(tile);
        }
    }
    finished() {
        return this.success;
    }
}
class SelectDefenderStep {
    constructor(player, attack) {
        this.success = false;
        this.player = player;
        this.attack = attack;
    }
    getMessage() {
        return "Jogador " + this.player.id + ": escolha um territorio inimigo para atacar.";
    }
    takeAction(tile) {
        if (tile.owner == this.player.id) {
            this.player.selectTile(tile);
            this.success = false;
        }
        else {
            var ownerTile = this.player.getSelectedTile();
            if (ownerTile != null) {
                var ownerTileId = ownerTile.id;
                if (tile.borderers.some(b => b.id == ownerTileId) && tile.owner != this.player.id) {
                    this.attack.setDefendingTile(tile);
                    this.success = true;
                }
                else {
                    this.success = false;
                }
            }
            else {
                this.success = false;
            }
        }
    }
    finished() {
        return this.success;
    }
}
// abstract class Step implements ITakesAction {
//     public abstract getMessage(): string;
//     public abstract takeAction(tile: ITile): void;
// }
class TurnPhase {
    constructor(player) {
        this.player = player;
    }
}
/// <reference path="TurnPhase.ts"/>
class AttackPhase extends TurnPhase {
    constructor(player) {
        super(player);
        this.stepPointer = 0;
        this.attack = new Attack(player);
        this.steps = [
            new SelectAttackerStep(player, this.attack),
            new SelectDefenderStep(player, this.attack)
        ];
        this.currentStep = this.steps[0];
    }
    nextSetp() {
        this.stepPointer = (this.stepPointer + 1) % this.steps.length;
        this.currentStep = this.steps[this.stepPointer];
    }
    getMessage() {
        return this.currentStep.getMessage();
    }
    setup() {
    }
    takeAction(tile) {
        this.currentStep.takeAction(tile);
        if (this.currentStep.finished()) {
            this.nextSetp();
            if (this.stepPointer == 0) {
                this.attack.resolve();
                this.attack.reset();
                this.player.clearSelectedTile();
            }
        }
    }
    finished() {
        return this.player.attackOptions().length == 0;
    }
}
/// <reference path="TurnPhase.ts"/>
class DeployPhase extends TurnPhase {
    getMessage() {
        return "Jogador " + this.player.id + ": escolha um territorio para reforcar. Voce possui " + this.player.armiesToPlace() + " exercitos restantes";
    }
    setup() {
        var armiesToDeploy = Math.floor(this.player.totalTiles() / 3);
        armiesToDeploy = Math.max(armiesToDeploy, 3);
        this.player.giveArmies(armiesToDeploy - this.player.armiesToPlace());
    }
    takeAction(tile) {
        this.player.placeArmies(tile, 1);
    }
    finished() {
        return this.player.armiesToPlace() <= 0;
    }
}
var Functional;
(function (Functional) {
    Functional.arrayCreator = function (createElement) {
        let rec = function (n) {
            if (n == 0)
                return [];
            return rec(n - 1).concat([createElement(n)]);
        };
        return rec;
    };
    Functional.define = function (a) {
        if (a === undefined || a === null)
            throw new TypeError("Could not define");
        return a;
    };
    // // Closure sobre players e define()
    // let getTurnPlayer = function(turn: number): Player {
    //     let p = players.find(player => player.Id == turn % 2);
    //     return define(p);
    // }
})(Functional || (Functional = {}));
/// <reference path="Common.ts"/>
var Functional;
(function (Functional) {
    Functional.InitGame = function (players, tiles) {
        let pl = Functional.createPlayers(players);
        let incompleteStatus = {
            Players: pl,
            ActivePlayerId: 0,
            Tiles: Functional.createTiles(tiles)
        };
        return {
            Players: incompleteStatus.Players,
            ActivePlayerId: incompleteStatus.ActivePlayerId,
            Tiles: incompleteStatus.Tiles,
            NextAction: claimTile(incompleteStatus)
        };
    };
    let claimTile = function (status) {
        return function (tileId) {
            let tiles = status.Tiles;
            let tileIndex = tiles.findIndex(tile => tile.Id == tileId);
            let tile = tiles[tileIndex];
            if (Functional.isFree(tile)) {
                tiles[tileIndex] = tile.Claim(status.Players[0]);
                status.ActivePlayerId = (status.ActivePlayerId + 1) % status.Players.length;
            }
            return {
                Players: status.Players,
                ActivePlayerId: status.ActivePlayerId,
                Tiles: tiles,
                NextAction: claimTile(status)
            };
        };
    };
})(Functional || (Functional = {}));
/// <reference path="Common.ts"/>
var Functional;
(function (Functional) {
    let playerColors = [[255, 0, 0], [0, 0, 255]];
    let createPlayer = function (id) {
        return { Id: id, Code: id + 1, Color: playerColors[id] };
    };
    Functional.createPlayers = Functional.arrayCreator(createPlayer);
})(Functional || (Functional = {}));
/// <reference path="Common.ts"/>
var Functional;
(function (Functional) {
    Functional.isFree = function (tile) {
        return tile.Claim !== undefined;
    };
    let createTile = function (id) {
        return {
            Id: id,
            Claim: function (player) {
                return {
                    Id: id,
                    Owner: player,
                    Armies: 1
                };
            }
        };
    };
    Functional.createTiles = Functional.arrayCreator(createTile);
})(Functional || (Functional = {}));
