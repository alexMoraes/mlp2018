class ChooseTilesPhase extends Phase {
    constructor(player: IPlayer) {
        super(player, new PlaceArmyToEmptyTileStep(player));
    }
    _validAction: boolean = true;

    public takeAction(tile: ITile): boolean {
        this._validAction = this.getCurrentStep().takeAction(tile);
        return this._validAction;
    }

    public hasNext(): boolean {
        return !this._validAction;
    }

    public nextAction(): ITakesAction {
        console.log(this.getPlayer().armiesToPlace());
        if(this.getPlayer().armiesToPlace() > 0) return this;
        else return new PlaceArmiesPhase(this.getPlayer());
    }
}