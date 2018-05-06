/// <reference path="Step.ts"/>

class PlaceArmyToOwnerTileStep extends Step {
    public takeAction(tile: ITile): boolean {
        return this.getPlayer().placeArmies(tile, 1);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        return this;
    }
}