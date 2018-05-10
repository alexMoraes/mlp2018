class Turn implements ITakesAction {
    private player: IPlayer;
    private phases: Array<TurnPhase>;
    private phasePointer: number = 0;
    private currentPhase: TurnPhase;
    constructor(player: IPlayer) {
        this.player = player;
        this.phases = [
            new DeployPhase(player),
            new AttackPhase(player)
        ]
        this.currentPhase = this.phases[0];
    }

    private nextPhase(): void {
        this.phasePointer++;
        this.currentPhase = this.phases[this.phasePointer];
        this.initialized = false;
    }

    public getMessage(): string {
        if(!this.initialized){
            this.currentPhase.setup();
            this.initialized = true;
        }
        return this.currentPhase.getMessage();
    }

    private initialized: boolean = false;
    public takeAction(tile: ITile): void {
        this.currentPhase.takeAction(tile);
        if(this.currentPhase.finished())
            this.nextPhase();
    }

    public finished(): boolean {
        return this.phasePointer == this.phases.length;
    }
}