import { FieldComponent } from "./components/field"
import { GameManager, GameState } from "./gameManager"

export class WaveManager {
    public static instance = new WaveManager
    private system?: WaveManagerSystem

    public field?: FieldComponent

    public spawnAmount() : number {
        return 4 + this.level
    }
    
    private spawnDelayScalar = 4
    private spawnDelayAmount = 1.5

    public spawnDelay() : number {
        return 1 / (this.level/2) // this.spawnDelayScalar * (Math.pow(2, -(this.level/this.spawnDelayAmount)))
    }

    public level = 0

    public spawnAmountLeft?: number
    public spawnDelayLeft: number = 0

    /**
     * initialize
     */
    public initialize() {
        if (!this.system) {
            this.system = new WaveManagerSystem
            engine.addSystem(this.system)
        }
    }

    /**
     * startWave
     */
    public startWave(level:number) {
        this.level = level

        this.spawnAmountLeft = this.spawnAmount()
        this.spawnDelayLeft = this.spawnDelay()

        log("level: "+this.level+" spawnAmount: "+ this.spawnAmount() + " spawnDelay: "+this.spawnDelay())
    }

    public stopWave(){
        this.spawnAmountLeft = undefined
    }
}

class WaveManagerSystem implements ISystem {
    update(dt: number): void {
        if (WaveManager.instance.field != undefined && WaveManager.instance.spawnAmountLeft != undefined) {
            if (WaveManager.instance.spawnAmountLeft > 0) {
                WaveManager.instance.spawnDelayLeft -= dt
                if (WaveManager.instance.spawnDelayLeft <= 0) {
                    // spawn
                    WaveManager.instance.field.spawnEnemy(WaveManager.instance.level)

                    WaveManager.instance.spawnAmountLeft--
                    WaveManager.instance.spawnDelayLeft += WaveManager.instance.spawnDelay()
                }
            } else {
                if (!WaveManager.instance.field.hasAnyEnemy()) {
                    // wave is won
                    log("wave is won")
                    WaveManager.instance.spawnAmountLeft = undefined
                    GameManager.instance?.setState(GameState.Build)
                }
            }
        }
    }
}