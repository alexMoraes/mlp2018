namespace Functional{
    export var arrayCreator = function<T>(createElement: (id: number) => T) : (n: number) => T[] {
        let rec = function(n: number): T[] {
            if(n == 0) return [];
            return rec(n - 1).concat([ createElement(n) ]);
        }

        return rec;
    }

    export var define = function<T>(a: T | null | undefined) : T {
        if(a === undefined || a === null) throw new TypeError("Could not define");
        return a;
    }

    // // Closure sobre players e define()
    // let getTurnPlayer = function(turn: number): Player {
    //     let p = players.find(player => player.Id == turn % 2);
    //     return define(p);
    // }
}