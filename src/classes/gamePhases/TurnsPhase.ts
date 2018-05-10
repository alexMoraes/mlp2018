class TurnsPhase extends GamePhase {
    private currentTurn: Turn;
    public constructor(players: Array<IPlayer>){
        super(players);
        this.players = players;
        this.currentTurn = new Turn(players[0]);
    }

    private nextTurn(): void {
        this.nextPlayer();
        this.currentTurn = new Turn(this.players[this.playerPointer]);
    }
    
    public finished(): boolean {
        return this.players.filter(x => x.totalTiles() > 0).length == 1;
    }

    public takeAction(tile: ITile): void {
        this.currentTurn.takeAction(tile);
        if(this.currentTurn.finished())
            this.nextTurn();
    }

    public getMessage(): string {
        return this.currentTurn.getMessage();
    }
}