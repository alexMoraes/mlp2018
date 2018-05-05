class PlaceArmiesPhase extends Phase {
    constructor(player: IPlayer) {
        super(player, new SelectTileStep(player));
    }

    public takeAction(tileId: number): void{
        this.getCurrentStep().takeAction(tileId);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        if(this.getPlayer().armiesToPlace() > 0) return this;
        else return new AttackPhase(this.getPlayer());;
    }
}