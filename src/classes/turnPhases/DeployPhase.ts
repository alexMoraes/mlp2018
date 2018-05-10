/// <reference path="TurnPhase.ts"/>

class DeployPhase extends TurnPhase {
    public getMessage(): string {
        return "Jogador " + this.player.id + ": escolha um territorio para reforcar. Voce possui " + this.player.armiesToPlace() + " exercitos restantes";
    }

    public setup(): void {
        var armiesToDeploy = Math.floor(this.player.totalTiles() / 3);
        armiesToDeploy = Math.max(armiesToDeploy, 3);
        this.player.giveArmies(armiesToDeploy - this.player.armiesToPlace());
    }

    public takeAction(tile: ITile): void {
        this.player.placeArmies(tile, 1);
    }
    public finished(): boolean {
        return this.player.armiesToPlace() <= 0;
    }
}