abstract class Phase implements ITakesAction{
    private player: IPlayer;
    private currentStep: Step;
    public constructor(player: IPlayer, firstStep: Step) {
        this.player = player;
        this.currentStep = firstStep;
    }

    protected getCurrentStep(): Step {
        return this.currentStep;
    }

    protected getPlayer(): IPlayer {
        return this.player;
    }

    public abstract takeAction(tileId: number): void;
    public abstract nextAction(): ITakesAction;
}