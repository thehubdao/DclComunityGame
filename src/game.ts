import { SceneFactory } from "dcl-edit/build/scripts/scenes"
import { CurrencyManager } from "currencyManager";
import { WaveManager } from "./waveManager";
import { GameManager, GameState } from "./gameManager";

const mainScene = SceneFactory.createMainScene()

mainScene.exposed.BuildMenu.hide()

GameManager.initialize(
    mainScene.exposed.MenuScene.childScene,
    mainScene.exposed.BuildMenu.childScene)

CurrencyManager.instance.initializeUI()

WaveManager.instance.initialize()

mainScene.exposed.StateDebugButton.entity.addComponent(new OnPointerDown(()=>{
    GameManager.instance!.setState((GameManager.instance!.getState()+1)%4)
}))

