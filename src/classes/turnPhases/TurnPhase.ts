abstract class TurnPhase implements ITakesAction {
    protected player: IPlayer;
    constructor(player: IPlayer) {
        this.player = player;
    }

    public abstract getMessage(): string;
    public abstract setup(): void;
    public abstract takeAction(tile: ITile): void;
    public abstract finished(): boolean;
}