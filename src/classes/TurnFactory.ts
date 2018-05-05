class TurnFactory {
    public static getTurns(players: Array<IPlayer>): Array<ITakesAction> {
        var turns = new Array<Turn>();
        players.forEach(player => {
            turns.push(new Turn(player));
        });

        for(var i = 0; i < turns.length; i++) {
            turns[i].setNextTurn(turns[(i + 1) % turns.length]);
        }

        return turns;
    }
}