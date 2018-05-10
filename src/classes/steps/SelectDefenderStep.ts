class SelectDefenderStep implements ITakesAction {
    private attack: Attack;
    private player: IPlayer;
    private success: boolean = false;
    constructor(player: IPlayer, attack: Attack) {
        this.player = player;
        this.attack = attack;
    }

    public getMessage(): string {
        return "Jogador " + this.player.id + ": escolha um territorio inimigo para atacar.";
    }
    public takeAction(tile: ITile): void {
        if(tile.owner == this.player.id) {
            this.player.selectTile(tile);
            this.success = false;
        } else {
            var ownerTile = this.player.getSelectedTile();
            if(ownerTile != null) {
                var ownerTileId = ownerTile.id;
                if(tile.borderers.some(b => b.id == ownerTileId) && tile.owner != this.player.id) {
                    this.attack.setDefendingTile(tile);
                    this.success = true;
                } else {
                    this.success = false;
                }
            } else {
                this.success = false;
            }
        }
    }
    public finished(): boolean {
        return this.success;
    }
}