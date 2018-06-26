/// <reference path="Common.ts"/>

namespace Functional {
    export type Player = { Id : number, Color: number[]};

    let playerColors = [[255,0,0], [0,0,255]];

    let createPlayer = function(id: number) : Player {
        return { Id: id, Color: playerColors[id - 1] };
    }
    
    export var createPlayers = arrayCreator(createPlayer);
}