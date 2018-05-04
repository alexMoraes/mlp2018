interface ITile {
    owner: number
    armies: number
    addSqm(matrix:number[][]) : number
    calculateCenter(): void
}