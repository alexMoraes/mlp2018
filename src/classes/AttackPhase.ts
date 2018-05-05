/// <reference path="Phase.ts"/>

class AttackPhase extends Phase {
    constructor(player: IPlayer) {
        super(player, new SelectTileStep(player));
    }

    public takeAction(tile: ITile): boolean {
        return this.getCurrentStep().takeAction(tile);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        return this;
    }
}