class Die {
    private result: number = 0;
    public roll(): void {
        this.result = Math.ceil(Math.random() * 6);
    }

    public getResult(): number {
        return this.result;
    }
}

class Attack {
    private attackingTile: ITile | null = null;
    private defendingTile: ITile | null = null;
    private player: IPlayer;
    constructor(player: IPlayer) {
        this.player = player;
    }

    public setAttackingTile(tile: ITile): void {
        this.attackingTile = tile;
    }

    public setDefendingTile(tile: ITile): void {
        this.defendingTile = tile;
    }

    public resolve(): void {
        if(this.attackingTile == null || this.defendingTile == null)
            return;

        var attackers = Math.min(this.attackingTile.armies - 1, 3);
        var defenders = Math.min(this.defendingTile.armies, 2);

        var attackingDice: Array<Die> = []
        var defendingDice: Array<Die> = []

        for(var i = 0; i < attackers; i++){
            var die = new Die();
            die.roll();
            attackingDice.push(die);
        }
        attackingDice = attackingDice.sort((x, y) => y.getResult() - x.getResult());

        for(var i = 0; i < defenders; i++){
            var die = new Die();
            die.roll();
            defendingDice.push(die);
        }
        defendingDice = defendingDice.sort((x, y) => y.getResult() - x.getResult());

        var takenDice = Math.min(defenders, attackers);
        for(var i = 0; i < takenDice; i++) {
            if(attackingDice[i].getResult() > defendingDice[i].getResult())
                this.defendingTile.addArmy(-1);
            else {
                this.attackingTile.addArmy(-1);
                attackers--;
            }
        }

        if(this.defendingTile.armies == 0) {
            this.defendingTile.owner = 0;
            this.player.takeTile(this.defendingTile, attackers);
            this.attackingTile.addArmy(-attackers);
        }
    }

    public reset(): void {
        this.attackingTile = null;
        this.defendingTile = null;
    }
}