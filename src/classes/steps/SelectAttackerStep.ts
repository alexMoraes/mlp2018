class SelectAttackerStep implements ITakesAction {
    private attack: Attack;
    private player: IPlayer;
    private success: boolean = false;
    constructor(player: IPlayer, attack: Attack) {
        this.player = player;
        this.attack = attack;
    }

    public getMessage(): string {
        return "Jogador " + this.player.id + ": escolha um de seus territorios para atacar.";
    }
    public takeAction(tile: ITile): void {
        if(!tile.isAbleToAttack())
            this.success = false;
        else{
            this.success = this.player.selectTile(tile);
            this.attack.setAttackingTile(tile);
        }
    }
    public finished(): boolean {
        return this.success;
    }
}