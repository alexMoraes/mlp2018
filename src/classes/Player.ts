class Player implements IPlayer {
    private armies: number = 0;
    private ownedTiles: Array<ITile> = [];
    private selectedTile: Nullable<ITile> = null;
    constructor(public id: number, public color : number[]) {
        
    }

    public giveArmies(armies: number): void {
        this.armies = this.armies + armies;
    }

    public takeArmies(armies: number): void {
        this.armies -= armies;
    }

    public armiesToPlace(): number {
        return this.armies;
    }

    public selectTile(tileId: number): void {
        this.selectedTile = null;
        for(var i = 0; i < this.ownedTiles.length; i++) {
            if(this.ownedTiles[i].id == tileId) {
                this.selectedTile = this.ownedTiles[i];
                break;
            }
        }
    }

    public getSelectedTile(): Nullable<ITile> {
        return this.selectedTile;
    }
}