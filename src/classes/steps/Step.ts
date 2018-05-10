abstract class Step implements ITakesAction {
    public abstract getMessage(): string;
    public abstract takeAction(tile: ITile): void;
}