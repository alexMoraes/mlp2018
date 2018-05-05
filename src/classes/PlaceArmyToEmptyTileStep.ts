/// <reference path="Step.ts"/>

class PlaceArmyToEmptyTileStep extends Step {
    public takeAction(tile: ITile): boolean {
        this.getPlayer().selectTile(tile);
        return this.getPlayer().takeTile();
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        return this;
    }
}