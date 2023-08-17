import { FieldComponent } from "./components/field"

export class WaveManager {
    public static instance = new WaveManager
    private system?: WaveManagerSystem

    public field?: FieldComponent

    public spawnAmout: number = 100
    public spawnDelay: number = 3

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
    public startWave() {
        this.spawnAmountLeft = this.spawnAmout
        this.spawnDelayLeft = this.spawnDelay
    }
}

class WaveManagerSystem implements ISystem {
    update(dt: number): void {
        if (WaveManager.instance.field != undefined && WaveManager.instance.spawnAmountLeft != undefined) {
            if (WaveManager.instance.spawnAmountLeft > 0) {
                WaveManager.instance.spawnDelayLeft -= dt
                if (WaveManager.instance.spawnDelayLeft <= 0) {
                    // spawn
                    WaveManager.instance.field.spawnEnemy()

                    WaveManager.instance.spawnAmountLeft--
                    WaveManager.instance.spawnDelayLeft += WaveManager.instance.spawnDelay
                }
            } else {
                if (!WaveManager.instance.field.hasAnyEnemy()) {
                    // wave is won
                    log("wave is won")
                    WaveManager.instance.spawnAmountLeft = undefined
                }
            }
        }
    }
}