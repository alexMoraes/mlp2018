interface ITile {
    id: number
    owner: number
    armies: number
    borderers: ITile[]
    center: [number, number]
    isAbleToAttack(): boolean
    addArmy(armies: number): void
    setOwner(ownerId: number): void
    hasOwner(): boolean
    addSqm(matrix: number[][]) : number
    calculateCenter(): void
    calculateBorderers(matrix:number[][], tiles:ITile[]): void
    setArmy(armies: number): void
}