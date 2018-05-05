interface ITakesAction {
    takeAction(tileId: number): void;
    hasNext(): boolean;
    nextAction(): ITakesAction;
}