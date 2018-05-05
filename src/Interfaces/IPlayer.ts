interface IPlayer {
    id: number
    giveArmies(armies: number): void;
    takeArmies(armies: number): void;
    armiesToPlace(): number;
    selectTile(tileId: number): void;
    getSelectedTile(): Nullable<ITile>;
}