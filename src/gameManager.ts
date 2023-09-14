import { BuildMenu, MenuScene } from "dcl-edit/build/scripts/scenes"
import { WaveManager } from "./waveManager"
import { CurrencyManager } from "./currencyManager"
import { TurretComponent } from "./components/turret"
import { TurretManager } from "./turrentManager"

export enum GameState {
    Menu,
    Build,
    Fight,
    GameOver
}

export class GameManager {
    public static instance?: GameManager
    public static initialize(mainMenuScene: MenuScene, buildMenu: BuildMenu){
        this.instance = new GameManager(mainMenuScene, buildMenu)
    }

    private menuScene: MenuScene
    private buildMenu: BuildMenu

    constructor(mainMenuScene: MenuScene, buildMenu: BuildMenu){
        this.menuScene = mainMenuScene
        this.buildMenu = buildMenu
    }

    private gameState: GameState = GameState.Menu

    private level: number = 0

    public getState(): GameState {
        return this.gameState
    }

    public setState(gameState: GameState) {
        switch (this.gameState) {
            case GameState.Menu:
                this.MenuStateExit()
                break;
            case GameState.Build:
                this.BuildStateExit()
                break;
            case GameState.Fight:
                this.FightStateExit()
                break;
            case GameState.GameOver:
                this.GameOverStateExit()
                break;
            default:
                break;
        }

        this.gameState = gameState

        switch (this.gameState) {
            case GameState.Menu:
                this.MenuStateEntered()
                break;
            case GameState.Build:
                this.BuildStateEntered()
                break;
            case GameState.Fight:
                this.FightStateEntered()
                break;
            case GameState.GameOver:
                this.GameOverStateEntered()
                break;
            default:
                break;
        }
    }

    private MenuStateEntered() {
        log("Endered Menu State")
        this.menuScene.show()
    }

    private BuildStateEntered() {
        log("Endered Build State")
        this.buildMenu.show()
    }

    private FightStateEntered() {
        log("Endered Fight State")

        this.level++

        WaveManager.instance.startWave(this.level)
    }

    private GameOverStateEntered() {
        log("Endered Game Over State")
        CurrencyManager.instance.resetGold()

        TurretManager.instance.removeAllTurrets()

        WaveManager.instance.field?.cleanupField()

        this.level = 0

        this.setState(GameState.Menu)
    }

    
    private MenuStateExit() {
        log("Exit Menu State")
        this.menuScene.hide()
        WaveManager.instance.field?.setupField(5,4)
    }

    private BuildStateExit() {
        log("Exit Build State")
        this.buildMenu.hide()
    }

    private FightStateExit() {
        log("Exit Fight State")
        WaveManager.instance.stopWave()
    }

    private GameOverStateExit() {
        log("Exit Game Over State")
    }
}
