

/*
#DCECOMP
{
    "class": "TurretComponent",
    "properties": [
        {
            "name": "range",
            "type": "number",
            "default": 5
        },
        {
            "name": "shotsPerSecond",
            "type": "number",
            "default": 3
        },
        {
            "name": "damage",
            "type": "number",
            "default": 10
        }
    ]
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


@Component("TurretComponent")
export class TurretComponent {
    // properties
    range: number = 5
    shotsPerSecond: number = 3
    damage: number = 10

    // references
    entity?: Entity
    tile?: TileComponent

    // values
    timeToNextShot: number = 0


    init(entity: Entity) {
        this.entity = entity
        TurretSystem.require()
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

    timeBetweenShots(): number {
        return 1 / this.shotsPerSecond
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

                // Apply damage
                if (turret.targetEnemy) {
                    turret.targetEnemy.health -= turret.damage
                    turret.timeToNextShot = turret.timeBetweenShots()
                }
            } else {
                turret.timeToNextShot -= dt
            }
        }
    }
}
