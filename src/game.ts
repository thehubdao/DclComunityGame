import { SceneFactory } from "dcl-edit/build/scripts/scenes"
import { CurrencyManager } from "currencyManager";
import { WaveManager } from "./waveManager";

const mainScene = SceneFactory.createMainScene()

const field = mainScene.exposed.Tiles.fieldComponent

//class DebugSystem implements ISystem{
//
//
//    update(dt: number): void {
//        log("===================")
//        for (let i = 0; i < field.tiles.length; i++) {
//            log(field.tiles[i].map(t=>t.enemies.length))
//        }
//    }
//}
//
//engine.addSystem(new DebugSystem)

CurrencyManager.instance.initializeUI()
CurrencyManager.instance.gold = 90

WaveManager.instance.initialize()
WaveManager.instance.startWave()
