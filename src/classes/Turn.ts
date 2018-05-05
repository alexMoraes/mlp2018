class Turn implements ITakesAction {
    private player: IPlayer;
    private nextTurn: Nullable<ITakesAction> = null;
    public constructor(player: IPlayer){
        this.player = player;
    }

    public takeAction(tileId: number): ITakesAction {
        return this;
    }

    public setNextTurn(nextTurn: ITakesAction): void {
        this.nextTurn = nextTurn;
    }
}