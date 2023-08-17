import { SceneFactory } from "dcl-edit/build/scripts/scenes"

export class SpawnManager{
    static spawnBullet(position: Vector3, rotation: Quaternion, distanceToTarget: number) {
        let bulletScene = SceneFactory.createBullet()
        let bullet = bulletScene.exposed.Bullet.bulletComponent

        bullet.setPos(position)
        bullet.setRot(rotation)
        bullet.setDistance(distanceToTarget)
    }
}