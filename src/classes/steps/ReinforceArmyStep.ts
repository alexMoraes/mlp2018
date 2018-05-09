/// <reference path="Step.ts"/>

class ReinforceArmyStep extends Step {
    public constructor(player: IPlayer) {
        super(player);
        this.getPlayer().giveArmies(5);
    }

    public takeAction(tile: ITile): boolean {
        var player = this.getPlayer();
        if (tile.owner == player.id) {
            return player.placeArmies(tile, 1);
        } else {
            return false;
        }
        
    }    

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        if(this.getPlayer().armiesToPlace() == 0)
            return new SelectOwnerTileToAttackStep(this.getPlayer());
        else
            return this;
    }

    public getMessage(): String {
        var player = this.getPlayer()
        return "Jogador " + player.id + ": posicione exercitos em seus territorios. " + player.armiesToPlace() + " exercitos restantes";
    }
}