interface IPlayer {
    id: number
    takeTile(): boolean
    giveArmies(armies: number): void
    placeArmies(armies: number): boolean
    armiesToPlace(): number
    selectTile(tile: ITile): boolean
    getSelectedTile(): Nullable<ITile>
}