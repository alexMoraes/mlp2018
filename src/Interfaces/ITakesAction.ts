interface ITakesAction {
    getMessage(): string;
    takeAction(tile: ITile): void;
}