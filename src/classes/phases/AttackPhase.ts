/// <reference path="Phase.ts"/>

class AttackPhase extends Phase {
    constructor(player: IPlayer) {
        super(player, new ReinforceArmyStep(player));
    }

    public takeAction(tile: ITile): boolean {
        return this.getCurrentStep().takeAction(tile);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        if(this.getCurrentStep().hasNext()) {
            return this.getCurrentStep().nextAction();
        } else {
            return new PlaceArmiesPhase(this.getPlayer());
        }
    }
}