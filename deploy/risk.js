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
            if (!tile.hasOwner()) {
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
}
const X = 1000;
const Y = 600;
const TILES = 50;
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
    }
    getMessage() {
        return this.currentTurn.getMessage();
    }
    action(tileNumber) {
        //console.log(this.tiles[tileNumber].borderers);
        this.currentTurn.takeAction(this.tiles[tileNumber]);
        this.currentTurn = this.currentTurn.nextAction();
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
        this.nextTurn = null;
        this.player = player;
        this.currentPhase = new ChooseTilesPhase(player);
    }
    takeAction(tile) {
        return this.currentPhase.takeAction(tile);
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
            var next = this.nextTurn;
            this.currentPhase = this.currentPhase.nextAction();
            return next;
        }
    }
    setNextTurn(nextTurn) {
        this.nextTurn = nextTurn;
    }
    getMessage() {
        return this.currentPhase.getMessage();
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
    getMessage() {
        return this.getCurrentStep().getMessage();
    }
}
/// <reference path="Phase.ts"/>
class AttackPhase extends Phase {
    constructor(player) {
        super(player, new SelectOwnerTileToAttackStep(player));
    }
    takeAction(tile) {
        return this.getCurrentStep().takeAction(tile);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        if (this.getCurrentStep().hasNext()) {
            return this.getCurrentStep().nextAction();
        }
        else {
            return new PlaceArmiesPhase(this.getPlayer());
        }
    }
}
class ChooseTilesPhase extends Phase {
    constructor(player) {
        super(player, new PlaceArmyToEmptyTileStep(player));
        this._validAction = true;
    }
    takeAction(tile) {
        this._validAction = this.getCurrentStep().takeAction(tile);
        return this._validAction;
    }
    hasNext() {
        return !this._validAction;
    }
    nextAction() {
        if (this.getPlayer().armiesToPlace() > 0)
            return this;
        else
            return new PlaceArmiesPhase(this.getPlayer());
    }
}
class PlaceArmiesPhase extends Phase {
    constructor(player) {
        super(player, new PlaceArmyToOwnerTileStep(player));
        this._validAction = true;
        player.giveArmies(5);
    }
    takeAction(tile) {
        this._validAction = this.getCurrentStep().takeAction(tile);
        return this._validAction;
    }
    hasNext() {
        return !this._validAction;
    }
    nextAction() {
        if (this.getPlayer().armiesToPlace() > 0)
            return this;
        else
            return new AttackPhase(this.getPlayer());
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
class PlaceArmyToEmptyTileStep extends Step {
    takeAction(tile) {
        return this.getPlayer().takeTile(tile);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        return this;
    }
    getMessage() {
        return "Jogador " + this.getPlayer().id + ": escolha um territorio para dominar";
    }
}
/// <reference path="Step.ts"/>
class PlaceArmyToOwnerTileStep extends Step {
    takeAction(tile) {
        return this.getPlayer().placeArmies(tile, 1);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        return this;
    }
    getMessage() {
        var player = this.getPlayer();
        return "Jogador " + player.id + ": escolha um territorio para reforcar. Voce possui " + player.armiesToPlace() + " exercitos restantes";
    }
}
/// <reference path="Step.ts"/>
class SelectEnemyTileToAttackStep extends Step {
    constructor() {
        super(...arguments);
        this._validAction = true;
    }
    takeAction(tile) {
        if (tile.owner == this.getPlayer().id) {
            this.getPlayer().selectTile(tile);
            this._validAction = false;
        }
        else {
            var ownerTile = this.getPlayer().getSelectedTile();
            if (ownerTile != null) {
                if (ownerTile.isAbleToAttack()) {
                    var ownerTileId = ownerTile.id;
                    if (tile.borderers.some(b => b.id == ownerTileId) && tile.owner != this.getPlayer().id) {
                        tile.addArmy(-1);
                        if (tile.armies == 0) {
                            tile.setOwner(this.getPlayer().id);
                            tile.addArmy(1);
                            ownerTile.addArmy(-1);
                        }
                        this.getPlayer().clearSelectedTile();
                        this._validAction = true;
                    }
                    else {
                        this._validAction = false;
                    }
                }
                else {
                    this._validAction = false;
                }
            }
            else {
                this._validAction = false;
            }
        }
        return this._validAction;
    }
    hasNext() {
        return !this._validAction;
    }
    nextAction() {
        if (this._validAction)
            return new SelectOwnerTileToAttackStep(this.getPlayer());
        else
            return this;
    }
    getMessage() {
        var player = this.getPlayer();
        return "Jogador " + player.id + ": escolha um territorio inimigo para atacar.";
    }
}
/// <reference path="Step.ts"/>
class SelectOwnerTileToAttackStep extends Step {
    constructor() {
        super(...arguments);
        this._validAction = true;
    }
    takeAction(tile) {
        if (this.getPlayer().selectTile(tile)) {
            this._validAction = tile.isAbleToAttack();
        }
        else {
            this._validAction = false;
        }
        return this._validAction;
    }
    hasNext() {
        return true;
    }
    nextAction() {
        if (this._validAction)
            return new SelectEnemyTileToAttackStep(this.getPlayer());
        else
            return this;
    }
    getMessage() {
        var player = this.getPlayer();
        return "Jogador " + player.id + ": escolha um de seus territorios para atacar.";
    }
}
/// <reference path="Step.ts"/>
class SelectTileStep extends Step {
    takeAction(tile) {
        return this.getPlayer().selectTile(tile);
    }
    hasNext() {
        return true;
    }
    nextAction() {
        return this;
    }
    getMessage() {
        return "N sei o q isso faz";
    }
}
