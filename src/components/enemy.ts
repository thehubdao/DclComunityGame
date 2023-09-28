import { CurrencyManager } from "src/currencyManager";
import { TileComponent } from "./tile";
import { GameManager, GameState } from "src/gameManager";

/*
#DCECOMP
{
    "class": "EnemyComponent"
}
*/


@Component("EnemyComponent")
export class EnemyComponent {
    private tile_internal: TileComponent | null = null;

    // debug references
    public bodyEntityDebug?: Entity

    public get tile(): TileComponent | null {
        return this.tile_internal
    }

    public set tile(v: TileComponent | null) {
        if (this.tile_internal)
            this.tile_internal.removeEnemy(this)

        this.tile_internal = v;

        this.tile_internal?.addEnemy(this)
    }



    entity?: Entity

    timeBetweenWaypoints: number = 1
    timerUntilNextWaypoint: number = 1


    // Health stuff
    maxHealth: number = 60
    private health_internal: number = 60

    public set health(v: number) {
        this.health_internal = v
        if (this.health_internal <= 0) {
            CurrencyManager.instance.gold += 10
            this.removeEnemy()
        }
    }

    public get health(): number {
        return this.health_internal
    }

    setLevel(level: number){
        this.maxHealth = 60 + (level * level * 3)
        this.timeBetweenWaypoints = 1 / (1+(level/10))
    }

    private removeEnemy() {
        if (this.entity) {
            engine.removeEntity(this.entity)
            this.tile_internal?.removeEnemy(this)
        }
    }

    healthTextEntity?: Entity;
    healthTextShape?: TextShape;

    init(entity: Entity) {
        this.entity = entity
        EnemySystem.require()
    }

    public setPos() {
        if (this.tile == null)
            return

        let currentTilePos = this.tile.getGlobalPosition()
        let nextTilePos = this.tile.nextTileToGoal?.getGlobalPosition() ?? Vector3.Zero()
        let normalizedTime = (this.timeBetweenWaypoints - this.timerUntilNextWaypoint) / this.timeBetweenWaypoints

        let newPosition = Vector3.Lerp(currentTilePos, nextTilePos, normalizedTime)

        this.entity!.getComponent(Transform).position = newPosition
    }

    public setRot() {
        if (this.tile == null)
            return

        let nextTilePos = this.tile.nextTileToGoal?.getGlobalPosition() ?? Vector3.Zero()
        let enemyTransform = this.entity!.getComponent(Transform)
        enemyTransform.lookAt(nextTilePos)
    }

    public doTick(dt: number) {
        if (GameManager.instance!.getState() != GameState.Fight) {
            this.removeEnemy()
            return
        }

        if (this.timerUntilNextWaypoint <= 0) {
            this.tile = this.tile?.nextTileToGoal ?? null

            if (this.tile?.isDestination()) {
                this.removeEnemy()
                log("You Lost")
                GameManager.instance!.setState(GameState.GameOver)
            }

            this.setRot()

            this.timerUntilNextWaypoint = this.timeBetweenWaypoints
        }

        this.timerUntilNextWaypoint -= dt

        this.setPos()
    }

    public showHealth() {
        if (!this.healthTextShape) {
            this.healthTextShape = new TextShape()
            this.healthTextEntity?.addComponent(this.healthTextShape)
            this.healthTextShape.billboard = true
            this.healthTextShape.outlineColor = Color3.Black()
            this.healthTextShape.outlineWidth = .2
        }

        this.healthTextShape.value = `${this.health} / ${this.maxHealth}`
    }
}



class EnemySystem implements ISystem {
    static instance: EnemySystem | null = null

    static require() {
        if (!this.instance) {
            this.instance = new EnemySystem
            engine.addSystem(this.instance)
        }
    }

    update(dt: number): void {

        for (const entity of engine.getComponentGroup(EnemyComponent).entities) {
            const enemy = entity.getComponent(EnemyComponent)

            enemy.doTick(dt)


            // update health text
            enemy.showHealth()
        }
    }
}