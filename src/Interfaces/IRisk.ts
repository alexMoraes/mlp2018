interface IRisk {
    SetActivePlayer(player: IPlayer): void;
    ReplenishArmyPhase(): void;
    PlaceArmyPhase(): void;
    AttackPhase(): void;
    MoveArmiesPhase(): void;
}