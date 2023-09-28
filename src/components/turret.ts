

/*
#DCECOMP
{
    "class": "TurretComponent"
}
*/

/*
#DCECOMP
{
    "class": "qick_fix"
}
*/

import { Tile } from "dcl-edit/build/scripts/scenes";
import { EnemyComponent } from "./enemy";
import { TileComponent } from "./tile";
import { SpawnManager } from "src/spawnManager";
import { CurrencyManager } from "src/currencyManager";


@Component("TurretComponent")
export class TurretComponent {
    // properties
    range: number = 3
    shotsPerSecond: number = 5
    damage: number = 5 

    // references
    entity?: Entity
    tile?: TileComponent
    muzzleTransform?: Transform
    damageButtonEntity?: Entity
    rangeButtonEntity?: Entity

    // texts
    damageLevelText?: TextShape
    rangeLevelText?: TextShape

    // values
    damageLevel: number = 1
    rangeLevel: number = 1

    timeToNextShot: number = 0


    init(entity: Entity) {
        this.entity = entity
        TurretSystem.require()
    }

    lateInit(){
        this.damageButtonEntity?.addComponent(new OnPointerDown(()=>{
            this.upgradeDamage()
        }))

        this.rangeButtonEntity?.addComponent(new OnPointerDown(()=>{
            this.upgradeRange()
        }))

        this.updateText()
    }

    targetEnemy: EnemyComponent | null = null

    tilesInRange(): TileComponent[] {
        let pos = this.tile!.pos

        // potential tiles
        const potentialTiles = []

        const field = this.tile!.field!

        const widerRange = Math.round(this.range + 1)

        const xMin = Math.max(0, pos.x - widerRange)
        const xMax = Math.min(field.tiles.length, pos.x + widerRange)
        const yMin = Math.max(0, pos.y - widerRange)
        const yMax = Math.min(field.tiles[0].length, pos.y + widerRange)

        for (let i = xMin; i < xMax; i++) {
            for (let j = yMin; j < yMax; j++) {
                potentialTiles.push(field.tiles[i][j])
            }
        }

        const tilesInRange = potentialTiles.filter(t => Vector2.Distance(t.pos, pos) <= this.range)

        return tilesInRange
    }

    upgradeRange(){
        var cost = 20 + 20 * this.rangeLevel

        if(CurrencyManager.instance.gold >= cost){
            CurrencyManager.instance.gold -= cost
            this.range += 0.5

            this.rangeLevel++
        }

        this.updateText()
    }

    upgradeDamage(){
        var cost = 20 + 20 * this.damageLevel

        if(CurrencyManager.instance.gold >= cost){
            CurrencyManager.instance.gold -= cost
            this.damage += 1
            this.shotsPerSecond += 1

            this.damageLevel++
        }

        this.updateText()
    }

    updateText(){
        if(!this.damageLevelText){
            var e = new Entity
            var ts = new TextShape
            ts.billboard = true
            ts.outlineColor = Color3.Black()
            ts.outlineWidth = .2
            this.damageLevelText = ts
            e.addComponent(ts)
            e.addComponent(new Transform({position:new Vector3(0,1,0)}))
            e.setParent(this.damageButtonEntity!)
        }

        if(!this.rangeLevelText){
            var e = new Entity
            var ts = new TextShape
            ts.billboard = true
            ts.outlineColor = Color3.Black()
            ts.outlineWidth = .2
            this.rangeLevelText = ts
            e.addComponent(ts)
            e.addComponent(new Transform({position:new Vector3(0,1,0)}))
            e.setParent(this.rangeButtonEntity!)
        }

        this.damageLevelText.value = "D:"+this.damageLevel
        this.rangeLevelText.value = "R:"+this.rangeLevel
    }

    timeBetweenShots(): number {
        return 1 / this.shotsPerSecond
    }

    getMuzzleGlobalPosition(): Vector3 {
        let turrentGlobalPos = this.tile?.getGlobalPosition()

        let turretRotation = this.entity?.getComponent(Transform).rotation ?? Quaternion.Identity

        let localMuzzlePos = this.muzzleTransform?.position.clone() ?? Vector3.Zero()
        let rotatedMuzzlePos = localMuzzlePos.rotate(turretRotation)

        if (!turrentGlobalPos)
            return Vector3.Zero()

        let globlaPos = turrentGlobalPos.add(rotatedMuzzlePos)

        return globlaPos
    }

    getMuzzleRotation(): Quaternion {
        return this.entity?.getComponent(Transform).rotation.clone() ?? Quaternion.Identity
    }
}


class TurretSystem implements ISystem {
    static instance: TurretSystem | null = null

    static require() {
        if (!this.instance) {
            this.instance = new TurretSystem
            engine.addSystem(this.instance)
        }
    }

    update(dt: number): void {

        for (const entity of engine.getComponentGroup(TurretComponent).entities) {
            const turret = entity.getComponent(TurretComponent)

            if (turret.timeToNextShot <= 0) {
                // get all tiles in range
                const tiles = turret.tilesInRange()

                const redMat = new Material
                redMat.albedoColor = Color4.Red()
                //tiles.forEach(t=>t.entity?.addComponentOrReplace(redMat))

                // get all enemies
                const allEnemies = tiles.reduce(function (a, b) { return a.concat(b.enemies); }, [] as EnemyComponent[]);

                // get nearest
                let nearestEnemy: EnemyComponent | null = null
                let nearestDistance = Infinity

                for (const e of allEnemies) {
                    let distance = Vector2.Distance(e.tile!.pos, turret.tile!.pos)
                    if (distance < nearestDistance) {
                        nearestDistance = distance
                        nearestEnemy = e
                    }
                }

                // set current target
                turret.targetEnemy = nearestEnemy // TODO: Loose reference to enemy when dead

                // debug
                //turret.targetEnemy?.bodyEntityDebug?.addComponentOrReplace(redMat)

                if (turret.targetEnemy) {
                    let turrentTransform = turret.entity?.getComponent(Transform)
                    let lookingTarget = turret.targetEnemy.entity?.getComponent(Transform).position
    
                    if (lookingTarget) {
                        turrentTransform?.lookAt(lookingTarget)
                    }
                }

                // Apply damage
                if (turret.targetEnemy) {
                    turret.targetEnemy.health -= turret.damage
                    turret.timeToNextShot = turret.timeBetweenShots()

                    let muzzlePosition = turret.getMuzzleGlobalPosition()
                    let targetPosition = turret.targetEnemy.entity?.getComponent(Transform).position ?? Vector3.Zero()

                    SpawnManager.spawnBullet(muzzlePosition, turret.getMuzzleRotation(), Vector3.Distance(muzzlePosition, targetPosition))
                }
            } else {
                turret.timeToNextShot -= dt
            }

            if (turret.targetEnemy) {
                let turrentTransform = turret.entity?.getComponent(Transform)
                let lookingTarget = turret.targetEnemy.entity?.getComponent(Transform).position

                if (lookingTarget) {
                    turrentTransform?.lookAt(lookingTarget)
                }
            }
        }
    }
}
