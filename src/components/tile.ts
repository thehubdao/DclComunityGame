import { CurrencyManager } from "src/currencyManager";
import { SceneFactory } from "../../dcl-edit/build/scripts/scenes"
import { EnemyComponent } from "./enemy";
import { FieldComponent } from "./field"
import { TurretComponent } from "./turret"
import { GameManager, GameState } from "src/gameManager";
import { TurretManager } from "src/turrentManager";



/*
#DCECOMP
{
    "class": "TileComponent"
}
*/


@Component("TileComponent")
export class TileComponent {
    pos: Vector2 = new Vector2(0, 0)
    field: FieldComponent | null = null;

    nextTileToGoal: TileComponent | null = null

    building: TurretComponent | null = null

    enemies: EnemyComponent[] = []

    entity?: Entity;

    init(entity: Entity) {
        this.entity = entity
        entity.addComponent(new OnPointerDown(event => {
            log(`Pressed on tile ${this.pos}`)

            if (event.buttonId == 0) {
                if (this.building == null) {
                    this.addTurret()
                } else {
                    this.removeTurret()
                }
            }

            if (event.buttonId == 1) {
                this.spawnEnemy()
            }
        }))

    }

    addEnemy(enemy: EnemyComponent) {
        this.enemies.push(enemy)
    }

    removeEnemy(enemy: EnemyComponent) {
        this.enemies = this.enemies.filter(e => e != enemy)
    }

    getGlobalPosition(): Vector3 {
        if (this.entity == null)
            return Vector3.Zero()

        return this.field?.entity?.getComponent(Transform).position.add(new Vector3(this.pos.x + 0.5, 0, this.pos.y + 0.5)) ?? Vector3.Zero()
    }

    spawnEnemy() {
        var enemyScene = SceneFactory.createEnemy()
        enemyScene.exposed.PlaceHolder.enemyComponent.tile = this;
        enemyScene.exposed.PlaceHolder.enemyComponent.setPos()
        enemyScene.exposed.PlaceHolder.enemyComponent.setRot()

        enemyScene.exposed.PlaceHolder.enemyComponent.bodyEntityDebug = enemyScene.exposed.Body.entity
        enemyScene.exposed.PlaceHolder.enemyComponent.healthTextEntity = enemyScene.exposed.Healthtext.entity
    }

    addTurret() {
        log(`Add Turret`)

        if (GameManager.instance!.getState() != GameState.Build) {
            return
        }

        let turretCost = 50

        if (CurrencyManager.instance.gold < turretCost) {
            return
        }

        CurrencyManager.instance.gold -= turretCost

        let turretScene = SceneFactory.createTurret()
        turretScene.exposed.Turret.transform.position = this.getGlobalPosition()

        let turretComp = turretScene.exposed.Turret.turretComponent

        this.building = turretComp
        turretComp.tile = this

        turretComp.muzzleTransform = turretScene.exposed.Muzzle.transform

        this.field?.bakePathFinding()

        TurretManager.instance.registerTurret(turretComp)
    }

    removeTurret() {
        log(`Remove Turret`)

        let turretComp = this.building
        if (turretComp) {
            engine.removeEntity(turretComp.entity!)
            TurretManager.instance.unregisterTurret(this.building!)
        }

        this.building = null

        this.field?.bakePathFinding()

    }

    isDestination(): boolean {
        let destination = this.field?.destination ?? new Vector2(-1, -1)

        return destination.equals(this.pos)
    }
}