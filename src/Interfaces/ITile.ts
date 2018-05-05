interface ITile {
    id: number
    owner: number
    armies: number
    addArmy(armies: number): void
    setOwner(ownerId: number): void
    hasOwner(): boolean
    addSqm(matrix: number[][]) : number
    calculateCenter(): void
}