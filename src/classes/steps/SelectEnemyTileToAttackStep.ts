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
                        var armiesAttacking = ownerTile.armies;
                        var armiesDefending = tile.armies;
                        var attackRandom = Math.floor(Math.random()*armiesAttacking + 1);
                        var defenseRandom = Math.floor(Math.random()*armiesDefending + 1);
                        var diff = Math.abs(attackRandom - defenseRandom);

                        console.log("Ataque tirou " + attackRandom);
                        console.log("Defesa tirou " + defenseRandom);

                        if (attackRandom > defenseRandom) { // Attack wins
                            tile.setOwner(this.getPlayer().id);
                            tile.setArmy(diff);
                            console.log("Ataque venceu!");
                        ownerTile.setArmy(1);
                        } else if (attackRandom == defenseRandom) { // Tie
                            tile.setArmy(1);
                            ownerTile.setArmy(1);
                            console.log("Empate!");                           
                        } else { // Defense wins
                            ownerTile.setArmy(1);
                            tile.setArmy(diff);
                            console.log("Defesa venceu!");
                                                        
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
            return new ReinforceArmyStep(this.getPlayer());
        else
            return this;
    }

    public getMessage(): String {
        var player = this.getPlayer()
        return "Jogador " + player.id + ": escolha um territorio inimigo para atacar.";
    }
}