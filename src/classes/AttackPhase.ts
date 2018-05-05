/// <reference path="Phase.ts"/>

class AttackPhase extends Phase {
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
        return this;
    }
}