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

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        if(this.currentPhase.hasNext()) {
            this.currentPhase = this.currentPhase.nextAction();
            return this;
        }
        else {
            return <ITakesAction> this.nextTurn;
        }
    }

    public setNextTurn(nextTurn: ITakesAction): void {
        this.nextTurn = nextTurn;
    }
}