import { SceneFactory } from "../../dcl-edit/build/scripts/scenes"
import { FieldComponent } from "./field"
import { TurretComponent } from "./turret"



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

    getGlobalPosition(): Vector3 {
        if (this.entity == null)
            return Vector3.Zero()

        return this.field?.entity?.getComponent(Transform).position.add(new Vector3(this.pos.x + 0.5, 0, this.pos.y + 0.5)) ?? Vector3.Zero()
    }

    spawnEnemy() {
        var enemyScene = SceneFactory.createEnemy()
        enemyScene.exposed.PlaceHolder.enemyComponent.tile = this;
        enemyScene.exposed.PlaceHolder.enemyComponent.setPos()
    }

    addTurret() {
        log(`Add Turret`)
        let turretScene = SceneFactory.createTurret()
        turretScene.sceneRoot.entity.setParent(this.entity!.getParent())

        turretScene.sceneRoot.transform.position = new Vector3(0.5, 0, 0.5)

        let turretComp = turretScene.exposed.Turret.turretComponent;

        this.building = turretComp;

        this.field?.bakePathFinding(this.field.tiles[3][6])
    }

    removeTurret() {
        log(`Remove Turret`)
        let e = this.building?.entity
        if (e) engine.removeEntity(e)

        this.building = null

        this.field?.bakePathFinding(this.field.tiles[3][6])
    }
}