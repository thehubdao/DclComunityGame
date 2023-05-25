import { SceneFactory } from "../../dcl-edit/build/scripts/scenes"
import { TurretComponent } from "./turret"


/*
#DCECOMP
{
    "class": "TileComponent"
}
*/


@Component("TileComponent")
export class TileComponent{
    pos: Vector2 = new Vector2(0,0)

    building: TurretComponent | null = null

    entity?: Entity;

    init(entity: Entity) {
        this.entity = entity
        entity.addComponent(new OnPointerDown(()=>{
            log(`Pressed on tile ${this.pos}`)
            if(this.building == null){
                this.addTurret()
            }else{
                this.removeTurret()
            }
        }))
    }

    addTurret(){
        log(`Add Turret`)
        let turretScene = SceneFactory.createTurret()
        turretScene.sceneRoot.entity.setParent(this.entity!.getParent())

        turretScene.sceneRoot.transform.position = new Vector3(0.5,0,0.5)

        let turretComp = turretScene.exposed.Turret.turretComponent;

        this.building = turretComp;
    }

    removeTurret(){
        log(`Remove Turret`)
        let e = this.building?.entity
        if(e) engine.removeEntity(e)
        
        this.building = null
    }
}