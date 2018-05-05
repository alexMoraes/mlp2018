/// <reference path="Step.ts"/>

class SelectTileStep extends Step {
    public takeAction(tileId: number): void {
        this.getPlayer().selectTile(tileId);
        this.getPlayer().takeArmies(1);
    }

    public nextAction(): ITakesAction{
        return this;
    }
}