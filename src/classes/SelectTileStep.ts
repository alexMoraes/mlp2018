/// <reference path="Step.ts"/>

class SelectTileStep extends Step {
    public takeAction(tile: ITile): boolean {
        return this.getPlayer().selectTile(tile);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        return this;
    }
}