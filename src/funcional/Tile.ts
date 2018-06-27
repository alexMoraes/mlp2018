/// <reference path="Common.ts"/>

namespace Functional {
    export type Tile = FreeTile | OwnedTile;
    export type FreeTile = { Id: number, Neighbors: number[], center: [number, number] };
    export type OwnedTile = FreeTile & { Owner: Player, Armies: number };
    export type AttackerTile = OwnedTile;

    export var isOwned = function(tile: Tile): tile is OwnedTile {
        return (<OwnedTile>tile).Owner !== undefined;
    }

    export var isAttacker = function(tile: OwnedTile): tile is AttackerTile {
        return tile.Armies > 1;
    }

    let createTile = function(ooTile: ITile):FreeTile {
        return {
            Id: ooTile.id,
            Neighbors: ooTile.borderers.map(function(neighbor: ITile):number { return neighbor.id} ),
            center: ooTile.center
        }
    }

    export var createTiles = function(ooTiles: ITile[]): FreeTile[] {
        return ooTiles.map<FreeTile>(createTile);
    }

    export var claimTile = function(tile: FreeTile, player: Player): OwnedTile {
        return {
            Id: tile.Id,
            Neighbors: tile.Neighbors,
            center: tile.center,
            Owner: player,
            Armies: 1
        }
    }
}