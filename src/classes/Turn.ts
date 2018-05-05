class Turn implements ITakesAction {
    private player: IPlayer;
    private nextTurn: Nullable<ITakesAction> = null;
    private currentPhase: ITakesAction;
    public constructor(player: IPlayer){
        this.player = player;
        this.currentPhase = new PlaceArmiesPhase(player);
    }

    public takeAction(tileId: number): void {
        this.currentPhase.takeAction(tileId);
    }

    public nextAction(): ITakesAction {
        if(this.player.armiesToPlace() > 0) return this;
        else return this;
    }

    public setNextTurn(nextTurn: ITakesAction): void {
        this.nextTurn = nextTurn;
    }
}