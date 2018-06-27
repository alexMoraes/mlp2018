/// <reference path="Common.ts"/>

namespace Functional {
    type GameState = SetupPhase | TurnPhase | EndPhase;

    type BaseState = {
        Tiles: Tile[],
        Players: Player[],
        Message: string
    }
    
    type SetupPhase = BaseState & {
        FreeTiles: FreeTile[],
        ActivePlayer: Player,
    }

    type EndPhase = BaseState & {
        Winner: Player
    }

    type TurnPhase = DeployStep | CombatStep
    type TurnBase = BaseState & { PlayerTiles: OwnedTile[], ActivePlayer: Player }
    type DeployStep = TurnBase & {
        Armies: number,
    }

    type CombatStep = SelectAttackerStep | SelectDefenderStep | CombatResolutionStep
    type SelectAttackerStep = TurnBase & { Attackers: AttackerTile[] }
    type SelectDefenderStep = TurnBase & { SelectedAttacker: AttackerTile, Defenders: OwnedTile[] }
    type CombatResolutionStep = TurnBase & { SelectedAttacker: AttackerTile, SelectDefender: OwnedTile }

    let isSetupPhase = function(gamePhase: GameState): gamePhase is SetupPhase {
        return (<SetupPhase>gamePhase).FreeTiles !== undefined;
    }

    let isTurnsPhase = function(gamePhase: GameState): gamePhase is TurnPhase {
        return isDeployStep(gamePhase) || isCombatStep(gamePhase);
    }

    let isDeployStep = function(gameState: GameState): gameState is DeployStep {
        return (<DeployStep>gameState).Armies !== undefined;
    }

    let isCombatStep = function(gameState: GameState): gameState is CombatStep {
        return isSelectAttackerStep(gameState) || isSelectDefenderStep(gameState);
    }

    let isSelectAttackerStep = function(gameState: GameState): gameState is SelectAttackerStep {
        return (<SelectAttackerStep>gameState).Attackers !== undefined;
    }

    let isSelectDefenderStep = function(gameState: GameState): gameState is SelectDefenderStep {
        return (<SelectDefenderStep>gameState).Defenders !== undefined;
    }

    let isEndPhase = function(gameState: GameState): gameState is EndPhase {
        return (<EndPhase>gameState).Winner !== undefined;
    }

    let getPlayerArmies = function(gameState: GameState, player: Player): number {
        return Math.max(3, gameState.Tiles.filter(isOwned).filter(tile => tile.Owner.Id === player.Id).length / 3);
    }

    let getPlayerAttackers = function(gameState: GameState, player: Player): AttackerTile[] {
        return gameState.Tiles.filter(isOwned).filter(isAttacker);
    }

    let startTurnsPhase = function(gameState: GameState): DeployStep {
        return {
            ActivePlayer: gameState.Players[0],
            Armies: getPlayerArmies(gameState, gameState.Players[0]),
            Message: "Starting turns",
            Players: gameState.Players,
            PlayerTiles: gameState.Tiles.filter<OwnedTile>(isOwned).filter(tile => tile.Owner.Id === gameState.Players[0].Id),
            Tiles: gameState.Tiles,
        }
    }

    let nextTurn = function(gameState: TurnPhase): DeployStep {
        let player = nextPlayer(gameState)
        return {
            ActivePlayer: player,
            Armies: getPlayerArmies(gameState, player),
            Message: "Starting player " + player.Id + " turn",
            Players: gameState.Players,
            PlayerTiles: gameState.Tiles.filter<OwnedTile>(isOwned).filter(tile => tile.Owner.Id === player.Id),
            Tiles: gameState.Tiles
        }
    }

    let startCombatPhase = function(gameState: DeployStep): SelectAttackerStep {
        return {
            ActivePlayer: gameState.ActivePlayer,
            PlayerTiles: gameState.PlayerTiles,
            Message: "Starting combat",
            Players: gameState.Players,
            Tiles: gameState.Tiles,
            Attackers: getPlayerAttackers(gameState, gameState.ActivePlayer)
        }
    }

    export var nextPhase = function(gameState: GameState) : GameState {
        if(isSetupPhase(gameState)){
            if(gameState.Tiles.every(tile => isOwned(tile))) return startTurnsPhase(gameState);
            return gameState;
        }
        if(isDeployStep(gameState)) {
            if(gameState.Armies === 0) return startCombatPhase(gameState);
            return gameState;
        }
        if(isSelectAttackerStep(gameState)){
        }
        return {
            Tiles: gameState.Tiles,
            Players: gameState.Players,
            Message: "GAME OVER!",
            Winner: gameState.Players[0]
        };
    }

    let tryClaimTile = function(gameState: SetupPhase, tileId: number): GameState {
        let tiles = gameState.Tiles;
        let tileIndex = tiles.findIndex(tile => tile.Id == tileId);
        let tile = tiles[tileIndex];
        let message = "";
        
        if(!isOwned(tile)) {
            tiles[tileIndex] = claimTile(tile, gameState.ActivePlayer);
            message = "Player " + gameState.ActivePlayer.Id + " claimed tile " + tile.Id;
        }
        else {
            message = "Tile " + tile.Id + " was already taken by player " + tile.Owner.Id;
        }
        
        return {
            Players: gameState.Players,
            FreeTiles: tiles.filter(t => !isOwned(tile)),
            ActivePlayer: nextPlayer(gameState),
            Tiles: tiles,
            Message: message
        }
    }

    let nextPlayer = function(gameState: SetupPhase | TurnPhase): Player {
        let index = gameState.Players.findIndex(player => player.Id === gameState.ActivePlayer.Id);
        let length = gameState.Players.length;
        let next = gameState.Players[(index + 1) % length];

        return next;
    }

    let endGame = function(gameState: GameState): GameState {
        gameState.Message = "GAME OVER!";
        return gameState;
    }

    let deployArmies = function(gameState: DeployStep, tileId: number): DeployStep {
        let tile = gameState.PlayerTiles.find(t => t.Id === tileId);
        if(tile === undefined){
            return {
                ActivePlayer: gameState.ActivePlayer,
                Armies: gameState.Armies,
                Message: "Unowned tile",
                Players: gameState.Players,
                PlayerTiles: gameState.PlayerTiles,
                Tiles: gameState.Tiles
            }
        }
        else{
            tile.Armies += 1;
            return {
                ActivePlayer: gameState.ActivePlayer,
                Armies: gameState.Armies - 1,
                Message: "Army placed",
                Players: gameState.Players,
                PlayerTiles: gameState.PlayerTiles,
                Tiles: gameState.Tiles
            }   
        }
    }

    let getDefenders = function(gameState: CombatStep, attacker: AttackerTile): OwnedTile[] {
        return gameState.Tiles
                .filter(isOwned)
                .filter(tile => attacker.Neighbors.some(id => tile.Id === id))
                .filter(tile => tile.Owner.Id !== gameState.ActivePlayer.Id);
    }

    let selectAttacker = function(gameState: SelectAttackerStep, tileId: number): CombatStep {
        let undefinedAttacker = gameState.PlayerTiles.filter(isAttacker).find(tile => tile.Id === tileId);
        let attacker = define(undefinedAttacker);
        if(attacker === undefined) {
            gameState.Message = "Invalid tile";
            return gameState;
        }
        else{
            return {
                ActivePlayer: gameState.ActivePlayer,
                Defenders: getDefenders(gameState, attacker),
                Message: "Player " + gameState.ActivePlayer.Id + " is declaring an attack with tile " + attacker.Id,
                Players: gameState.Players,
                PlayerTiles: gameState.PlayerTiles,
                SelectedAttacker: attacker,
                Tiles: gameState.Tiles
            }
        }
    }

    let selectDefender = function(gameState: SelectDefenderStep, tileId: number): SelectDefenderStep | CombatResolutionStep {
        let tile = gameState.Defenders.find(tile => tile.Id === tileId);
        if(tile === undefined){
            gameState.Message = "Invalid tile";
            return gameState;
        }
        else {
            return {
                ActivePlayer: gameState.ActivePlayer,
                Defenders: gameState.Defenders,
                Message: "Player " + gameState.ActivePlayer.Id + " declared an attack on tile " + tile.Id,
                Players: gameState.Players,
                PlayerTiles: gameState.PlayerTiles,
                SelectDefender: tile,
                SelectedAttacker: gameState.SelectedAttacker,
                Tiles: gameState.Tiles
            }
        }
    }

    let resolveCombat = function(gameState: CombatResolutionStep): CombatStep {
        let attDice = Math.min(3, gameState.SelectedAttacker.Armies - 1);
        let defDice = Math.min(3, gameState.SelectDefender.Armies);
        return gameState;
    }

    let takeCombatAction = function(gameState: CombatStep, tileId: number): CombatStep {
        if(isSelectAttackerStep(gameState)) return selectAttacker(gameState, tileId);
        if(isSelectDefenderStep(gameState)){
            let step = selectDefender(gameState, tileId);
            if(isSelectDefenderStep(step)) return step;
            else return resolveCombat(step);
        }
        return gameState;
    }

    let takeTurnAction = function(gameState: TurnPhase, tileId: number): GameState {
        if(isDeployStep(gameState)) return deployArmies(gameState, tileId);
        if(isCombatStep(gameState)) return takeCombatAction(gameState, tileId);
        return endGame(gameState);
    }

    export var takeAction = function(gameState: GameState, tileId: number): GameState {
        if(isSetupPhase(gameState)) return tryClaimTile(gameState, tileId);
        if(isTurnsPhase(gameState)) return takeTurnAction(gameState, tileId);
        if(isEndPhase(gameState)) return endGame(gameState);
        return gameState;
    }

    export var InitGame = function(players: number, tiles: ITile[]) : SetupPhase {
        let pl = createPlayers(players);
        let incompleteStatus = {
            Players: pl,
            ActivePlayerId: 0,
            Tiles: createTiles(tiles)
        }

        return {
            Tiles: incompleteStatus.Tiles,
            FreeTiles: incompleteStatus.Tiles,
            Players: incompleteStatus.Players,
            ActivePlayer: incompleteStatus.Players[0],
            Message: "Starting"
        }
    }
}