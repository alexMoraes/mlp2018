/// <reference path="Step.ts"/>

class SelectOwnerTileToAttackStep extends Step {
    _validAction: boolean = true;

    public takeAction(tile: ITile): boolean {
        if(this.getPlayer().selectTile(tile)) {
            this._validAction = tile.isAbleToAttack();
        } else {
            this._validAction = false;
        }
        return this._validAction;
    }    

    public hasNext(): boolean {
        return true;
    }

    public nextAction(): ITakesAction {
        if(this._validAction)
            return new SelectEnemyTileToAttackStep(this.getPlayer());
        else
            return this;
    }
}