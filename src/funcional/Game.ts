/// <reference path="Common.ts"/>

namespace Functional {
    type Action = (tileId: number) => GameStatus;
    type GameStatus = IncompleteStatus & { NextAction: Action };
    type IncompleteStatus = { Players: Player[], ActivePlayerId: number, Tiles: Tile[], Matrix: number[][] }

    export var InitGame = function(players: number, tilesNumber: number) : GameStatus {
        let pl = createPlayers(players);
        let tiles = createTiles(tilesNumber);
        let matrix:number[][] = [];
        [tiles, matrix] = expandTiles(tiles);
        let incompleteStatus = {
            Players: pl,
            ActivePlayerId: 0,
            Tiles: tiles,
            Matrix: matrix
        }

        return {
            Players: incompleteStatus.Players,
            ActivePlayerId: incompleteStatus.ActivePlayerId,
            Tiles: incompleteStatus.Tiles,
            NextAction: claimTile(incompleteStatus),
            Matrix: incompleteStatus.Matrix
        }
    }

    let claimTile = function(status: IncompleteStatus): Action {
        return function(tileId: number): GameStatus {
            let tiles = status.Tiles;
            let tileIndex = tiles.findIndex(tile => tile.Id == tileId);
            let tile = tiles[tileIndex];
            
            if(isFree(tile)) {
                tiles[tileIndex] = tile.Claim(status.Players[0]);
                status.ActivePlayerId = (status.ActivePlayerId + 1) % status.Players.length;
            }
            
            return {
                Players: status.Players,
                ActivePlayerId: status.ActivePlayerId,
                Tiles: tiles,
                NextAction: claimTile(status),
                Matrix: status.Matrix
            }
        }
    }
}