/// <reference path="Common.ts"/>

namespace Functional {
    export type Tile = { Id: number };
    
    let createTile = function(id: number): Tile {
        return { Id:id };
    }

    export var  createTiles = arrayCreator(createTile)
}