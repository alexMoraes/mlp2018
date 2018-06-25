/// <reference path="Common.ts"/>

namespace Functional {
    type Action = (tileId: number) => GameStatus;
    type GameStatus = IncompleteStatus & { NextAction: Action };
    type IncompleteStatus = { Players: Player[], ActivePlayerId: number, Tiles: Tile[] }

    export var InitGame = function(players: number, tiles: number) : GameStatus {
        let pl = createPlayers(players);
        let incompleteStatus = {
            Players: pl,
            ActivePlayerId: 0,
            Tiles: createTiles(tiles)
        }

        return {
            Players: incompleteStatus.Players,
            ActivePlayerId: incompleteStatus.ActivePlayerId,
            Tiles: incompleteStatus.Tiles,
            NextAction: tryClaimTile(incompleteStatus)
        }
    }

    let tryClaimTile = function(status: IncompleteStatus): Action {
        return function(tileId: number): GameStatus {
            let tiles = status.Tiles;
            let tileIndex = tiles.findIndex(tile => tile.Id == tileId);
            let tile = tiles[tileIndex];
            
            if(!isOwned(tile)) {
                tiles[tileIndex] = claimTile(tile, status.Players[status.ActivePlayerId]);
                status.ActivePlayerId = (status.ActivePlayerId + 1) % status.Players.length;
            }
            
            return {
                Players: status.Players,
                ActivePlayerId: status.ActivePlayerId,
                Tiles: tiles,
                NextAction: tryClaimTile(status)
            }
        }
    }
}