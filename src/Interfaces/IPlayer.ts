interface IPlayer {
    id: number
    takeTile(tile: ITile, armies: number): boolean
    giveArmies(armies: number): void
    placeArmies(tile: ITile, armies: number): boolean
    armiesToPlace(): number
    selectTile(tile: ITile): boolean
    clearSelectedTile(): void 
    getSelectedTile(): Nullable<ITile>
    ownsTile(tile: ITile): boolean
    totalTiles(): number
    attackOptions(): Array<ITile> 
}