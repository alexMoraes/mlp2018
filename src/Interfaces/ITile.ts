interface ITile {
    id: number;
    owner: number
    armies: number
    addSqm(matrix:number[][]) : number
    calculateCenter(): void
}