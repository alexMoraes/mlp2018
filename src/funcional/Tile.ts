/// <reference path="Common.ts"/>

namespace Functional {
    export type Tile = FreeTile | OwnedTile;
    export type FreeTile = { Id: number, Claim: (player: Player) => OwnedTile };
    export type OwnedTile = { Id: number, Owner: Player, Armies: number }

    export var isFree = function(tile: Tile): tile is FreeTile {
        return (<FreeTile>tile).Claim !== undefined;
    }

    let createTile = function(id: number): FreeTile {
        return {
            Id:id,
            Claim: function(player: Player): OwnedTile {
                return {
                    Id: id,
                    Owner: player,
                    Armies: 1
                }
            }
        };
    }

    export var  createTiles = arrayCreator(createTile)
}