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

    public getMessage(): String {
        var player = this.getPlayer()
        return "Jogador " + player.id + ": escolha um territorio para reforcar. Voce possui " + player.armiesToPlace() + " exercitos restantes";
    }
}