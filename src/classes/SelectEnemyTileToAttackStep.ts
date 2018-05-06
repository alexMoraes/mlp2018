/// <reference path="Step.ts"/>

class SelectEnemyTileToAttackStep extends Step {
    _validAction: boolean = true;

    public takeAction(tile: ITile): boolean {
        if(tile.owner == this.getPlayer().id) {
            this.getPlayer().selectTile(tile);
            this._validAction = false;
        } else {
            var ownerTile = this.getPlayer().getSelectedTile();
            if(ownerTile != null) {
                if(ownerTile.isAbleToAttack()) {
                    var ownerTileId = ownerTile.id;
                    if(tile.borderers.some(b => b.id == ownerTileId) && tile.owner != this.getPlayer().id) {
                        tile.addArmy(-1);
                        if(tile.armies == 0) {
                            tile.setOwner(this.getPlayer().id)
                            tile.addArmy(1);
                            ownerTile.addArmy(-1);
                        }
                        this.getPlayer().clearSelectedTile();
                        this._validAction = true;
                    } else {
                        this._validAction = false;
                    }
                } else {
                    this._validAction = false;
                }
            } else {
                this._validAction = false;
            }
        }
        return this._validAction;
    }    

    public hasNext(): boolean {
        return !this._validAction;
    }

    public nextAction(): ITakesAction {
        if(this._validAction)
            return new SelectOwnerTileToAttackStep(this.getPlayer());
        else
            return this;
    }
}