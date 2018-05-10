/// <reference path="GamePhase.ts"/>

class EndPhase extends GamePhase {
    public getMessage(): string {
        return "Game over";
    }
    public takeAction(tile: ITile): void {
    }
    public finished(): boolean {
        return false;
    }
}