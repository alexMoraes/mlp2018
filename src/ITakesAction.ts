interface ITakesAction {
    takeAction(tileId: number): void;
    nextAction(): ITakesAction;
}