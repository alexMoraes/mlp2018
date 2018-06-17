namespace functional{
    type Player = { Id : number, Name: string };
    type Nullable<T> = T | null | undefined;

    let createPlayer = function(id: number) : Player {
        return { Id: id, Name: "Player: " + (id + 1) };
    }

    let createPlayers = function(n: number) : Player[] {
        if(n == 0) return [ createPlayer(0) ];
        return createPlayers(n - 1).concat([ createPlayer(n) ]);
    }

    let numberOfPlayers = 2;
    let players = createPlayers(numberOfPlayers);

    let define = function<T>(a: T | null | undefined) : T {
        if(a === undefined || a === null) throw new TypeError("Could not define");
        return a;
    }

    // Closure sobre players e define()
    let getTurnPlayer = function(turn: number): Player {
        let p = players.find(player => player.Id == turn % 2);
        return define(p);
    }
}