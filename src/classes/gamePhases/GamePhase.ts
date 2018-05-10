abstract class GamePhase implements ITakesAction {
    protected players: Array<IPlayer>;
    protected playerPointer: number = 0;
    constructor(players: Array<IPlayer>){
        this.players = players;
    }

    protected nextPlayer(): void {
        this.playerPointer = (this.playerPointer + 1) % this.players.length;
    }

    public abstract getMessage(): string;
    public abstract takeAction(tile: ITile): void;
    public abstract finished(): boolean;
}