/// <reference path="Common.ts"/>
/// <reference path="Player.ts"/>

namespace Functional {
    type Action = (tileId: number) => GameStatus;
    type GameStatus = { Players: Player[], Tiles: Tile[], NextAction: Action };

    export var InitGame = function(players: number, tiles: number) : GameStatus {
        return {
            Players: createPlayers(players),
            Tiles: createTiles(tiles),
            NextAction: function(tileId: number) { console.log("Click"); return InitGame(players, tiles); }
        }
    }
}