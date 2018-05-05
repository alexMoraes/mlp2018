abstract class Step implements ITakesAction {
    private player: IPlayer;
    public constructor(player: IPlayer) {
        this.player = player;
    }

    protected getPlayer(): IPlayer {
        return this.player;
    }

    public abstract takeAction(tileId: number): void;
    public abstract hasNext(): boolean;
    public abstract nextAction(): ITakesAction;
}