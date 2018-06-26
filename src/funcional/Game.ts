/// <reference path="Common.ts"/>

namespace Functional {
    type GameState = { GamePhase: GamePhase,
                        Tiles: Tile[],
                        Players: Player[],
                        ActivePlayerId: number,
                        Message: string
                    };
    type GamePhase = SetupPhase | TurnsPhase | EndPhase;
    type SetupPhase = "Setup";
    type TurnsPhase = "Turns";
    type EndPhase = "End";

    let isSetupPhase = function(gamePhase: GamePhase): gamePhase is SetupPhase {
        return gamePhase === "Setup";
    }

    let isTurnsPhase = function(gamePhase: GamePhase): gamePhase is TurnsPhase {
        return gamePhase === "Turns";
    }

    let isEndPhase = function(gamePhase: GamePhase): gamePhase is EndPhase {
        return gamePhase === "End";
    }

    export var nextState = function(gameState: GameState): GameState {
        let phase = nextPhase(gameState);
        if(phase !== gameState.GamePhase){
            return {
                ActivePlayerId: 0,
                GamePhase: phase,
                Message: gameState.Message,
                Players: gameState.Players,
                Tiles: gameState.Tiles
            };
        }
        else{
            return {
                ActivePlayerId: (gameState.ActivePlayerId + 1) % gameState.Players.length,
                GamePhase: gameState.GamePhase,
                Message: gameState.Message,
                Players: gameState.Players,
                Tiles: gameState.Tiles
            };
        }
    }

    let nextPhase = function(gameState: GameState) : GamePhase {
        if(isSetupPhase(gameState.GamePhase)){
            if(gameState.Tiles.every(tile => isOwned(tile))) return "Turns";
            return "Setup";
        }
        return "End";
    }

    let tryClaimTile = function(gameState: GameState, tileId: number): GameState {
        let tiles = gameState.Tiles;
        let tileIndex = tiles.findIndex(tile => tile.Id == tileId);
        let tile = tiles[tileIndex];
        let message = "";
        
        if(!isOwned(tile)) {
            let currentPlayer = gameState.Players[gameState.ActivePlayerId];
            tiles[tileIndex] = claimTile(tile, gameState.Players[gameState.ActivePlayerId]);
            message = "Player " + currentPlayer.Id + " claimed tile " + tile.Id;
        }
        else {
            message = "Tile " + tile.Id + " was already taken by player " + tile.Owner.Id;
        }
        
        return {
            GamePhase: gameState.GamePhase,
            Players: gameState.Players,
            ActivePlayerId: gameState.ActivePlayerId,
            Tiles: tiles,
            Message: message
        }
    }

    let endGame = function(gameState: GameState): GameState {
        gameState.Message = "GAME OVER!";
        return gameState;
    }

    export var takeAction = function(gameState: GameState, tileId: number): GameState {
        if(isSetupPhase(gameState.GamePhase)) return tryClaimTile(gameState, tileId);
        if(isEndPhase(gameState.GamePhase)) return endGame(gameState);
        return gameState;
    }

    export var InitGame = function(players: number, tiles: ITile[]) : GameState {
        let pl = createPlayers(players);
        let incompleteStatus = {
            Players: pl,
            ActivePlayerId: 0,
            Tiles: createTiles(tiles)
        }

        return {
            GamePhase: "Setup",
            Players: incompleteStatus.Players,
            ActivePlayerId: incompleteStatus.ActivePlayerId,
            Tiles: incompleteStatus.Tiles,
            Message: "Starting"
        }
    }

    // let tryClaimTile = function(status: IncompleteStatus): Action {
    //     return function(tileId: number): GameState {
    //         let tiles = status.Tiles;
    //         let tileIndex = tiles.findIndex(tile => tile.Id == tileId);
    //         let tile = tiles[tileIndex];
            
    //         if(!isOwned(tile)) {
    //             tiles[tileIndex] = claimTile(tile, status.Players[status.ActivePlayerId]);
    //             status.ActivePlayerId = (status.ActivePlayerId + 1) % status.Players.length;
    //         }
            
    //         return {
    //             Players: status.Players,
    //             ActivePlayerId: status.ActivePlayerId,
    //             Tiles: tiles,
    //             NextAction: tryClaimTile(status)
    //         }
    //     }
    // }
}