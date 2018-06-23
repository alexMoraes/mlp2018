namespace Functional{
    type Action = (tileId: number) => GameStatus;
    type GameStatus = { Players: Player[], Tiles: Tile[], NextAction: Action };
    type Player = { Id : number, Code: number, Color: number[]};
    type Tile = { Id: number };

    export var InitGame = function(players: number, tiles: number) : GameStatus {
        return {
            Players: createPlayers(players),
            Tiles: createTiles(tiles),
            NextAction: function(tileId: number) { return InitGame(players, tiles) }
        }
    }

    let playerColors = [[255,0,0], [0,0,255]];

    let createPlayer = function(id: number) : Player {
        return { Id: id, Code: id + 1, Color: playerColors[id] };
    }
    let createTile = function(id: number): Tile {
        return { Id:id };
    }

    let arrayCreator = function<T>(createElement: (id: number) => T) : (n: number) => T[] {
        let rec = function(n: number): T[] {
            if(n == 0) return [];
            return rec(n - 1).concat([ createElement(n) ]);
        }

        return rec;
    }

    let createPlayers = arrayCreator(createPlayer);
    let createTiles = arrayCreator(createTile)

    let define = function<T>(a: T | null | undefined) : T {
        if(a === undefined || a === null) throw new TypeError("Could not define");
        return a;
    }

    // // Closure sobre players e define()
    // let getTurnPlayer = function(turn: number): Player {
    //     let p = players.find(player => player.Id == turn % 2);
    //     return define(p);
    // }
}