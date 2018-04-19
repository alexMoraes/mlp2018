interface ITile {
    Neighbors: Array<ITile>;
    Owner: IPlayer;
    Armies: number;
}