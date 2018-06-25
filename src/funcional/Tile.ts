/// <reference path="Common.ts"/>

namespace Functional {
    export type Tile = FreeTile | OwnedTile;
    export type FreeTile = { Id: number };
    export type OwnedTile = { Id: number, Owner: Player, Armies: number }

    export var isOwned = function(tile: Tile): tile is OwnedTile {
        return (<OwnedTile>tile).Owner !== undefined;
    }

    let createTile = function(id: number): FreeTile {
        return {
            Id: id
        };
    }

    export var  createTiles = arrayCreator(createTile)

    export var claimTile = function(tile: FreeTile, player: Player): OwnedTile {
        console.log("Player " + player.Id + " claiming tile " + tile.Id);
        return {
            Id: tile.Id,
            Owner: player,
            Armies: 1
        }
    }
}