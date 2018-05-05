class PlaceArmiesPhase extends Phase {
    constructor(player: IPlayer) {
        super(player, new PlaceArmyToOwnerTileStep(player));
        player.giveArmies(5);
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
        if(this.getPlayer().armiesToPlace() > 0) return this;
        else return new AttackPhase(this.getPlayer());
    }
}