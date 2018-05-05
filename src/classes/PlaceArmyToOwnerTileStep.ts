/// <reference path="Step.ts"/>

class PlaceArmyToOwnerTileStep extends Step {
    public takeAction(tile: ITile): boolean {
        this.getPlayer().selectTile(tile);
        return this.getPlayer().placeArmies(1);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        return this;
    }
}