abstract class Step implements ITakesAction {
    private player: IPlayer;
    public constructor(player: IPlayer) {
        this.player = player;
    }

    protected getPlayer(): IPlayer {
        return this.player;
    }

    public abstract takeAction(tile: ITile): boolean;
    public abstract hasNext(): boolean;
    public abstract nextAction(): ITakesAction;
    public abstract getMessage(): String;
}