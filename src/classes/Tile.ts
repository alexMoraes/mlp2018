class Tile implements ITile {
    sqms : [number, number][];
    armies : number;
    owner : number;
    center : [number, number];
    constructor(public id: number, matrix:number[][]) {
        do {
            var row = Math.floor(Math.random() * X);
            var column = Math.floor(Math.random() * Y);
        } while (matrix[row][column] != 0)
        matrix[row][column] = this.id;
        this.sqms = [];
        this.sqms.push([row, column]);
        this.owner = 0;
        this.armies = 0;
        this.center = [0, 0];
    }
    addArmy(armies: number): void {
        this.armies += armies;
    }
    hasOwner(): boolean {
        return this.owner > 0;
    }
    setOwner(ownerId: number) {
        this.owner = ownerId;
    }
    addSqm(matrix:number[][]) : number {
        var borders = this.getBorder(matrix);
        if(borders.length > 0) {
            var sqmAddedAmount = 0;
            var amountChosen = Math.floor(Math.random()*borders.length);
            while(amountChosen > 0) {
                var chosen = borders[Math.floor(Math.random()*borders.length)];
                if(matrix[chosen[0]][chosen[1]] == 0) {
                    matrix[chosen[0]][chosen[1]] = this.id;
                    sqmAddedAmount++;
                    this.sqms.push(chosen);
                }
                amountChosen--;
            }
            return sqmAddedAmount;
        } else {
            return 0;
        }
    }
    getBorder(matrix:number[][]): [number, number][] {
        var borders:[number, number][] = [];

        var min = 0;
        var maxX = X-1;
        var maxY = Y-1;
        this.sqms.forEach(sqm => {
            var row = sqm[0];
            var column = sqm[1];
            var key: [number, number];
            if(row + 1 <= maxX && matrix[row+1][column] == 0) {
                key = [row+1, column];
                borders.push(key); 
            } 
            if(row - 1 >= min && matrix[row-1][column] == 0) {
                key = [row-1, column];
                borders.push(key); 
            } 
            if(column - 1 >= min && matrix[row][column-1] == 0) {
                key = [row, column-1];
                borders.push(key); 
            }
            if(column + 1 <= maxY && matrix[row][column+1] == 0) {
                key = [row, column+1];
                borders.push(key); 
            }
        });
        return borders;
    }
    calculateCenter(): void {
        var points = this.sqms.length
        var x = 0;
        var y = 0;
        this.sqms.forEach(sqm => {
            x += sqm[0]
            y += sqm[1]
        });

        this.center = [x / points, y / points];
    }
}