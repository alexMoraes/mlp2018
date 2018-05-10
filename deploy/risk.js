"use strict";
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
    takeTile(tile) {
        if (tile) {
            if (!tile.hasOwner()) {
                tile.setOwner(this.id);
                console.debug("Pushing");
                this.ownedTiles.push(tile);
                tile.addArmy(1);
                this.armies -= 1;
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
        return this.ownedTiles.length;
    }
}
const X = 1000;
const Y = 600;
const TILES = 4 * 3 * 2 * 2;
const PLAYERS = 2;
const COLORS = [[255, 0, 0],
    [0, 0, 255]];
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
            new DeployPhase(player)
        ];
        this.currentPhase = this.phases[0];
    }
    nextPhase() {
        this.currentPhase = this.phases[this.phasePointer++];
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
        var success = this.players[this.playerPointer].takeTile(tile);
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
        return false;
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
class Step {
}
class TurnPhase {
    constructor(player) {
        this.stepPointer = 0;
        this.player = player;
    }
}
/// <reference path="TurnPhase.ts"/>
class DeployPhase extends TurnPhase {
    constructor(player) {
        super(player);
    }
    getMessage() {
        return "Jogador " + this.player.id + ": escolha um territorio para reforcar. Voce possui " + this.player.armiesToPlace() + " exercitos restantes";
    }
    setup() {
        var armiesToDeploy = this.player.totalTiles() / 3;
        armiesToDeploy = Math.max(armiesToDeploy, 3);
        this.player.giveArmies(armiesToDeploy);
    }
    takeAction(tile) {
        this.player.placeArmies(tile, 1);
    }
    finished() {
        return this.player.armiesToPlace() <= 0;
    }
}
