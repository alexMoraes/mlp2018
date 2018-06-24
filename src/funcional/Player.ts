/// <reference path="Common.ts"/>

namespace Functional {
    export type Player = { Id : number, Code: number, Color: number[]};

    let playerColors = [[255,0,0], [0,0,255]];

    let createPlayer = function(id: number) : Player {
        return { Id: id, Code: id + 1, Color: playerColors[id] };
    }
    
    export var createPlayers = arrayCreator(createPlayer);
}