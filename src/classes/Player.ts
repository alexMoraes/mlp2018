class Player implements IPlayer {
    private ownedTiles: Array<ITile> = [];
    private selectedTile: Nullable<ITile> = null;
    constructor(public id: number, public color : number[], public armies: number) {
        
    }

    public giveArmies(armies: number): void {
        this.armies = this.armies + armies;
    }

    public placeArmies(tile: ITile, armies: number): boolean {
        if(tile) {
            if(!tile.hasOwner()) {
                // must have an owner at this time of game
                return false;
            }
            tile.addArmy(armies);
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
        this.clearSelectedTile();
        if(tile.owner == this.id) {
            this.selectedTile = tile;
            return true;
        } else {
            return false;
        }
    }

    public clearSelectedTile(): void {
        this.selectedTile = null;
    }

    public takeTile(tile: ITile): boolean {
        if(tile) {
            if(!tile.hasOwner()) {
                tile.setOwner(this.id);
                tile.addArmy(1);
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

    public ownsTile(tile: ITile): boolean {
        return tile.owner == this.id;
    }
}