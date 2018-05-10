/// <reference path="TurnPhase.ts"/>

class AttackPhase extends TurnPhase {
    private attack: Attack;
    private steps: Array<ITakesAction>;
    private currentStep: ITakesAction;
    private stepPointer: number = 0;
    constructor(player: IPlayer) {
        super(player);
        this.attack = new Attack(player);

        this.steps = [
            new SelectAttackerStep(player, this.attack),
            new SelectDefenderStep(player, this.attack)
        ]
        this.currentStep = this.steps[0];
    }

    private nextSetp(): void {
        this.stepPointer = (this.stepPointer + 1) % this.steps.length;
        this.currentStep = this.steps[this.stepPointer];
    }

    public getMessage(): string {
        return this.currentStep.getMessage();
    }
    public setup(): void {
    }
    public takeAction(tile: ITile): void {
        this.currentStep.takeAction(tile);
        if(this.currentStep.finished()){
            this.nextSetp();

            if(this.stepPointer == 0) {
                this.attack.resolve();
                this.attack.reset();
                this.player.clearSelectedTile();
            }
        }
    }
    public finished(): boolean {
        return this.player.attackOptions().length == 0;
    }
}