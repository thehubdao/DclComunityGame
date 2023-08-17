import { CurrencyManager } from "src/currencyManager";
import { TileComponent } from "./tile";

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

    timerUntilNextStep: number = 1

    // Health stuff
    maxHealth: number = 100
    private health_internal: number = 100

    public set health(v: number) {
        this.health_internal = v
        if (this.health_internal <= 0) {
            // DIE // TODO: split up dying and reaching goal
            CurrencyManager.instance.gold += 30

            this.removeEnemy()
        }
    }

    private removeEnemy() {
        if (this.entity) {
            engine.removeEntity(this.entity)
            this.tile_internal?.removeEnemy(this)
        }
    }


    public get health(): number {
        return this.health_internal
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

        this.entity!.getComponent(Transform).position = this.tile.getGlobalPosition()
    }

    public doStep() {
        this.tile = this.tile?.nextTileToGoal ?? null

        if (this.tile?.isDestination()) {
            this.removeEnemy()
            log("You Lost")
        }

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
            enemy.timerUntilNextStep -= dt;

            if (enemy.timerUntilNextStep <= 0) {
                enemy.doStep()

                enemy.timerUntilNextStep = 1
            }

            // update health text
            enemy.showHealth()
        }
    }
}