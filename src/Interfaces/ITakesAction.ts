interface ITakesAction {
    takeAction(tile: ITile): boolean; //valid action
    hasNext(): boolean;
    nextAction(): ITakesAction;
    getMessage(): String;
}