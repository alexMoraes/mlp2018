/// <reference path="Step.ts"/>

class PlaceArmyToEmptyTileStep extends Step {
    public takeAction(tile: ITile): boolean {
        return this.getPlayer().takeTile(tile);
    }

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        return this;
    }

    public getMessage(): String {
        return "Jogador " + this.getPlayer().id + ": escolha um territorio para dominar";
    }
}