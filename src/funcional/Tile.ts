/// <reference path="Common.ts"/>

namespace Functional {
    export type Tile = FreeTile | OwnedTile;
    export type FreeTile = { Id: number,
                             Sqms: [number, number][],
                             Borderers: Tile[],
                             Center: [number, number],
                             Claim: (player: Player) => OwnedTile };
    export type OwnedTile = { Id: number,
                              Sqms: [number, number][],
                              Borderers: Tile[],
                              Center: [number, number],
                              Owner: Player,
                              Armies: number }

    export var isFree = function(tile: Tile): tile is FreeTile {
        return (<FreeTile>tile).Claim !== undefined;
    }

    let createTile = function(id: number): FreeTile {

        let row = Math.floor(Math.random() * X);
        let column = Math.floor(Math.random() * Y);        

        return {
            Id:id,
            Sqms: [[row, column]],
            Borderers: [],
            Center: [row, column],
            Claim: function(player: Player): OwnedTile {
                return {
                    Id: id,
                    Sqms: [[row, column]],
                    Borderers: [],
                    Center: [row, column],
                    Owner: player,
                    Armies: 1
                }
            }
        };
    }

    export var expandTiles = function(tiles: FreeTile[]): [FreeTile[], number[][]] {
        let matrix:number[][] = [];
        let numberFilled = 0;
        let max = 0;

        // Create matrix
        for(var i = 0; i < X; i++){
            matrix[i] = new Array(Y).fill(0);
        }
        

        // Trocar por map
        tiles.forEach(tile => {
            matrix[tile.Center[0]][tile.Center[1]] = tile.Id;
        });
    
        // Expand the tiles (fill the matrix)
        
        while(numberFilled < X*Y && max < 1000) {
            let tileToTryAdd = Math.floor(Math.random() * TILES);
            let added = addSqm(tiles[tileToTryAdd], matrix)[2]
            numberFilled += added;
            if (added == 0) {
                max++;
            } else {
                max = 0;
            }
            console.log(numberFilled);
        }

        // Remove water tiles
        tiles = tiles.slice(0, TILES/2)

    
        // Fill water tiles positions with 0's
        for(var i = 0; i < X; i++) {
            for(var j = 0; j < Y; j++) {
                if (matrix[i][j] > TILES/2)
                    matrix[i][j] = 0
            }
        }

        console.log(matrix);
        

        // Calculate the center and borderers of the tiles for drawing the army circles
        for(var i = 0; i < tiles.length; i++) {
            tiles[i] = calculateCenter(tiles[i]);
            tiles[i] = calculateBorderers(matrix, tiles[i], tiles);
        }
        
        
        return [tiles, matrix];
    }

    let addSqm = function(tile: FreeTile, matrix: number[][]): [FreeTile, number[][], number] {
        var borders = getBorder(tile, matrix);
        if(borders.length > 0) {
            var sqmAddedAmount = 0;
            var amountChosen = Math.floor(Math.random()*borders.length);
            while(amountChosen > 0) {
                var chosen = borders[Math.floor(Math.random()*borders.length)];
                if(matrix[chosen[0]][chosen[1]] == 0) {
                    matrix[chosen[0]][chosen[1]] = tile.Id;
                    sqmAddedAmount++;
                    tile.Sqms.push(chosen);
                }
                amountChosen--;
            }
            return [tile, matrix, sqmAddedAmount];
        } else {
            return [tile, matrix, 0];
        }
    }

    let getBorder = function(tile: FreeTile, matrix: number[][]): [number, number][] {
        var borders:[number, number][] = [];

        var min = 0;
        var maxX = X-1;
        var maxY = Y-1;
        tile.Sqms.forEach(sqm => {
            var row = sqm[0];
            var column = sqm[1];
            var key: [number, number];
            if(row + 1 <= maxX && matrix[row+1][column] == 0) {
                key = [row+1, column];
                borders.push(key); 
            } 
            if(row - 1 >= min && matrix[row-1][column] == 0) {
                key = [row-1, column];
                borders.push(key); 
            } 
            if(column - 1 >= min && matrix[row][column-1] == 0) {
                key = [row, column-1];
                borders.push(key); 
            }
            if(column + 1 <= maxY && matrix[row][column+1] == 0) {
                key = [row, column+1];
                borders.push(key); 
            }
        });
        
        return borders;
    }

    let calculateCenter = function(tile: FreeTile): FreeTile {

        var points = tile.Sqms.length
        var x = 0;
        var y = 0;
        tile.Sqms.forEach(sqm => {
            x += sqm[0]
            y += sqm[1]
        });

        tile.Center = [x / points, y / points];

        return tile;
    }

    let calculateBorderers = function(matrix: number[][], tile: FreeTile, tiles: FreeTile[]): FreeTile {
        var min = 0;
        var maxX = X-1;
        var maxY = Y-1;
        tile.Sqms.forEach(sqm => {
            var row = sqm[0];
            var column = sqm[1];
            var key: [number, number];
            if(row + 1 <= maxX && matrix[row+1][column] != 0 && matrix[row+1][column] != tile.Id && !tile.Borderers.some(c => c.Id == matrix[row+1][column])) {
                tile.Borderers.push(tiles[matrix[row+1][column]-1]);
            } 
            if(row - 1 >= min && matrix[row-1][column] != 0 && matrix[row-1][column] != tile.Id && !tile.Borderers.some(c => c.Id == matrix[row-1][column])) {
                tile.Borderers.push(tiles[matrix[row-1][column]-1]);
            } 
            if(column - 1 >= min && matrix[row][column-1] != 0 && matrix[row][column-1] != tile.Id && !tile.Borderers.some(c => c.Id == matrix[row][column-1])) {
                tile.Borderers.push(tiles[matrix[row][column-1]-1]);
            }
            if(column + 1 <= maxY && matrix[row][column+1] != 0 && matrix[row][column+1] != tile.Id && !tile.Borderers.some(c => c.Id == matrix[row][column+1])) {
                tile.Borderers.push(tiles[matrix[row][column+1]-1]);
            }
        });

        return tile;
    }

    export var  createTiles = arrayCreator(createTile)
}