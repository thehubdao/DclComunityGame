/*
#DCECOMP
{
    "class": "BulletComponent"
}
*/

@Component("BulletComponent")
export class BulletComponent {
    private entity: Entity | undefined

    private speed: number = 10

    private timeToLive: number = Infinity

    init(entity: Entity) {
        this.entity = entity
        BulletSystem.require()
    }

    setPos(position: Vector3) {
        let transform = this.entity?.getComponent(Transform)

        if (!transform)
            return

        transform.position = position
    }

    setRot(rotation: Quaternion) {
        let transform = this.entity?.getComponent(Transform)

        if (!transform)
            return

        transform.rotation = rotation
    }

    setDistance(distanceToTarget: number) {
        this.timeToLive = distanceToTarget / this.speed
    }

    moveForward(dt: number) {
        const transform = this.entity?.getComponent(Transform)

        if (!transform)
            return

        transform
            .translate(
                Vector3.Forward()
                    .rotate(transform.rotation)
                    .scale(dt)
                    .scale(this.speed))

        // time to live
        this.timeToLive -= dt
        if (this.timeToLive <= 0) {
            // remove the bullet
            let bulletSceneRootEntity = this.entity?.getParent()
            if (bulletSceneRootEntity) {
                engine.removeEntity(bulletSceneRootEntity)
            }
        }
    }
}

class BulletSystem implements ISystem {
    static instance: BulletSystem | null = null

    static require() {
        if (!this.instance) {
            this.instance = new BulletSystem
            engine.addSystem(this.instance)
        }
    }

    update(dt: number): void {
        for (const entity of engine.getComponentGroup(BulletComponent).entities) {
            const bullet = entity.getComponent(BulletComponent)

            bullet.moveForward(dt)
        }
    }
}