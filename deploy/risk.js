"use strict";
class Phase {
    constructor(player, firstStep) {
        this.player = player;
        this.currentStep = firstStep;
    }
    getCurrentStep() {
        return this.currentStep;
    }
    getPlayer() {
        return this.player;
    }
}
/// <reference path="Phase.ts"/>
class AttackPhase extends Phase {
    constructor(player) {
        super(player, new SelectTileStep(player));
    }
    takeAction(tileId) {
        this.getCurrentStep().takeAction(tileId);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        return this;
    }
}
class PlaceArmiesPhase extends Phase {
    constructor(player) {
        super(player, new SelectTileStep(player));
    }
    takeAction(tileId) {
        this.getCurrentStep().takeAction(tileId);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        if (this.getPlayer().armiesToPlace() > 0)
            return this;
        else
            return new AttackPhase(this.getPlayer());
        ;
    }
}
class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.armies = 0;
        this.ownedTiles = [];
        this.selectedTile = null;
    }
    giveArmies(armies) {
        this.armies = this.armies + armies;
    }
    takeArmies(armies) {
        this.armies -= armies;
    }
    armiesToPlace() {
        return this.armies;
    }
    selectTile(tileId) {
        this.selectedTile = null;
        for (var i = 0; i < this.ownedTiles.length; i++) {
            if (this.ownedTiles[i].id == tileId) {
                this.selectedTile = this.ownedTiles[i];
                break;
            }
        }
    }
    getSelectedTile() {
        return this.selectedTile;
    }
}
const X = 1000;
const Y = 600;
const TILES = 50;
const PLAYERS = 2;
const INITIAL_ARMY_NUMBER = 20;
const COLORS = [[255, 0, 0],
    [0, 0, 255]];
var GameState;
(function (GameState) {
    GameState[GameState["INITIALIZING"] = 0] = "INITIALIZING";
    GameState[GameState["POSITIONING_ARMY"] = 1] = "POSITIONING_ARMY";
    GameState[GameState["SELECTING_ATTACK_SOURCE"] = 2] = "SELECTING_ATTACK_SOURCE";
    GameState[GameState["SELECTING_ATTACK_TARGET"] = 3] = "SELECTING_ATTACK_TARGET";
})(GameState || (GameState = {}));
class RiskEngine {
    constructor(initial_army_number) {
        this.turnPlayerId = 1;
        this.gameState = GameState.INITIALIZING;
        this.matrix = [];
        this.tiles = [];
        this.players = [];
        var tilesNumber = Math.floor(TILES / 2);
        var numberFilled = 0;
        // Create players
        for (var i = 1; i <= PLAYERS; i++) {
            this.players.push(new Player(i, COLORS[i - 1]));
        }
        this.currentTurn = TurnFactory.getTurns(this.players)[0];
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
        // Calculate the center of the tiles for drawing the army circles
        this.tiles.forEach(tile => {
            tile.calculateCenter();
        });
        // Fill water tiles positions with 0's
        for (var i = 0; i < X; i++) {
            for (var j = 0; j < Y; j++) {
                if (this.matrix[i][j] > tilesNumber)
                    this.matrix[i][j] = 0;
            }
        }
    }
    click(tile_number) {
        this.currentTurn.takeAction(tile_number);
        this.currentTurn = this.currentTurn.nextAction();
        // switch (this.gameState) {
        //     case GameState.INITIALIZING:
        //         console.log("Tile " + tile_number + " clicked, current state: initializing");
        //         break;
        //     case GameState.POSITIONING_ARMY:
        //         console.log("Tile " + tile_number + " clicked, current state: positioning army");
        //         var player = this.players[this.turnPlayerId - 1]
        //         var owner = this.tiles[tile_number].owner
        //         if (owner == 0 || owner == player.id) {
        //             this.tiles[tile_number].owner = player.id;
        //             this.tiles[tile_number].armies += 1;
        //             player.army_to_position -= 1;
        //             this.turnPlayerId = player.id == 1 ? 2 : 1;
        //             if (this.players[0].army_to_position == 0 && this.players[1].army_to_position == 0)
        //                 this.gameState = GameState.SELECTING_ATTACK_SOURCE
        //         }
        //         break;
        //     case GameState.SELECTING_ATTACK_SOURCE:
        //         console.log("Tile " + tile_number + " clicked, current state: selecting attack source");
        //         break;
        //     case GameState.SELECTING_ATTACK_TARGET:
        //         console.log("Tile " + tile_number + " clicked, current state: selecting attack target");
        //         break;
        //     default:
        //         break;
        // }
    }
}
class Step {
    constructor(player) {
        this.player = player;
    }
    getPlayer() {
        return this.player;
    }
}
/// <reference path="Step.ts"/>
class SelectTileStep extends Step {
    takeAction(tileId) {
        this.getPlayer().selectTile(tileId);
        this.getPlayer().takeArmies(1);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        return this;
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
        this.sqms = [];
        this.sqms.push([row, column]);
        this.owner = 0;
        this.armies = 0;
        this.center = [0, 0];
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
}
class Turn {
    constructor(player) {
        this.nextTurn = null;
        this.player = player;
        this.currentPhase = new PlaceArmiesPhase(player);
    }
    takeAction(tileId) {
        this.currentPhase.takeAction(tileId);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        if (this.currentPhase.hasNext()) {
            this.currentPhase = this.currentPhase.nextAction();
            return this;
        }
        else {
            return this.nextTurn;
        }
    }
    setNextTurn(nextTurn) {
        this.nextTurn = nextTurn;
    }
}
class TurnFactory {
    static getTurns(players) {
        var turns = new Array();
        players.forEach(player => {
            turns.push(new Turn(player));
        });
        for (var i = 0; i < turns.length; i++) {
            turns[i].setNextTurn(turns[(i + 1) % turns.length]);
        }
        return turns;
    }
}
