/// <reference path="TurnPhase.ts"/>

class DeployPhase extends TurnPhase {
    constructor(player: IPlayer) {
        super(player);
    }
    public getMessage(): string {
        return "Jogador " + this.player.id + ": escolha um territorio para reforcar. Voce possui " + this.player.armiesToPlace() + " exercitos restantes";
    }

    public setup(): void {
        var armiesToDeploy = this.player.totalTiles() / 3;
        armiesToDeploy = Math.max(armiesToDeploy, 3);
        this.player.giveArmies(armiesToDeploy);
    }

    public takeAction(tile: ITile): void {
        this.player.placeArmies(tile, 1);
    }
    public finished(): boolean {
        return this.player.armiesToPlace() <= 0;
    }
}