class SetupBoardPhase extends GamePhase {
    private tiles: Array<ITile>;
    private tilesTaken: number = 0;
    public constructor(players: Array<IPlayer>, tiles: Array<ITile>){
        super(players);
        this.players = players;
        this.tiles = tiles;
    }
    
    public finished(): boolean {
        return this.tilesTaken == this.tiles.length;
    }

    public takeAction(tile: ITile): void {
        var success = this.players[this.playerPointer].takeTile(tile);
        if(success){
            this.tilesTaken++;
            this.nextPlayer();
        }
    }

    public getMessage(): string {
        return "Jogador " + this.players[this.playerPointer].id + ": escolha um territorio para dominar";
    }
}