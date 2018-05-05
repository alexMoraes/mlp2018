class Player implements IPlayer {
    private ownedTiles: Array<ITile> = [];
    private selectedTile: Nullable<ITile> = null;
    constructor(public id: number, public color : number[], public armies: number) {
        
    }

    public giveArmies(armies: number): void {
        this.armies = this.armies + armies;
    }

    public placeArmies(armies: number): boolean {
        if(this.selectedTile) {
            if(!this.selectedTile.hasOwner()) {
                // must have an owner at this time of game
                return false;
            }
            this.selectedTile.addArmy(armies);
            this.armies -= armies;
            return true;
        } else {
            return false;
        }
    }

    public armiesToPlace(): number {
        return this.armies;
    }

    public selectTile(tile: ITile): boolean {
        this.selectedTile = null;
        if(tile.owner == this.id || !tile.hasOwner()) {
            this.selectedTile = tile;
            return true;
        } else {
            return false;
        }
    }

    public takeTile(): boolean {
        if(this.selectedTile) {
            if(!this.selectedTile.hasOwner()) {
                this.selectedTile.setOwner(this.id);
                this.selectedTile.addArmy(1);
                this.armies -= 1;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public getSelectedTile(): Nullable<ITile> {
        return this.selectedTile;
    }
}