class Turn implements ITakesAction {
    private player: IPlayer;
    private nextTurn: Nullable<ITakesAction> = null;
    private currentPhase: ITakesAction;
    public constructor(player: IPlayer){
        this.player = player;
        this.currentPhase = new ChooseTilesPhase(player);
    }

    public takeAction(tile: ITile): boolean {
        return this.currentPhase.takeAction(tile);
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
            var next = this.nextTurn;
            this.currentPhase = this.currentPhase.nextAction();
            return <ITakesAction> next;
        }
    }

    public setNextTurn(nextTurn: ITakesAction): void {
        this.nextTurn = nextTurn;
    }

    public getMessage(): String {
        return this.currentPhase.getMessage();
    }
}