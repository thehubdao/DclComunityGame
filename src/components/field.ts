import { WaveManager } from "src/waveManager";
import { TileComponent } from "./tile";
import { SceneFactory } from "dcl-edit/build/scripts/scenes"


/*
#DCECOMP
{
    "class": "FieldComponent",
    "properties": [
        {
            "name": "height",
            "type": "number",
            "default": 5
        },
        {
            "name": "width",
            "type": "number",
            "default": 5
        }
    ]
}
*/

@Component("FieldComponent")
export class FieldComponent {
    public tiles: TileComponent[][] = [];

    public width = 5;
    public height = 4;

    public entity: Entity | null = null;

    public spawnPoint?: Vector2
    public destination: Vector2 = new Vector2(0, 0)

    init(entity: Entity) {
        this.entity = entity
        log("init field 2")
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = []
            for (let j = 0; j < this.height; j++) {
                let t = SceneFactory.createTile()

                let tileComponent = t.exposed.Tile.tileComponent
                tileComponent.pos.x = i
                tileComponent.pos.y = j

                tileComponent.field = this

                t.sceneRoot.entity.setParent(entity)
                t.sceneRoot.transform.position = new Vector3(i, 0, j);

                this.tiles[i].push(tileComponent)
            }
        }

        this.bakePathFinding()

        // put self into wave manager
        WaveManager.instance.field = this

        // set spawnpoint
        this.spawnPoint = new Vector2(this.width - 1, this.height - 1)
    }

    // get spawn tile
    public spawnTile(): TileComponent | undefined {
        if (!this.spawnPoint)
            return undefined

        return this.tiles[this.spawnPoint.x][this.spawnPoint.y]
    }

    // pathfinding
    public bakePathFinding() {
        let goal = this.tiles[this.destination.x][this.destination.y]
        log("Bake Pathfinding")

        // Reset the flow field of each tile
        this.resetFlowField();

        // Create a queue for BFS traversal
        const queue: TileComponent[] = [];

        // Set the goal tile's flow direction to itself
        goal.nextTileToGoal = goal;

        // Enqueue the goal tile
        queue.push(goal);

        // Perform BFS traversal
        while (queue.length > 0) {
            const currentTile = queue.shift();

            // break if list is empty
            if (currentTile == undefined)
                throw "Not possible"

            // Get the neighbors of the current tile
            const neighbors = this.getNeighbors(currentTile);

            for (const neighbor of neighbors) {
                if (!neighbor.nextTileToGoal) {
                    // Set the flow direction of the neighbor tile to the current tile
                    neighbor.nextTileToGoal = currentTile;

                    // Enqueue the neighbor tile
                    queue.push(neighbor);
                }
            }
        }

        log(this.tiles[5][6].nextTileToGoal?.pos)

        this.debugField()
    }

    private resetFlowField() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const tile = this.tiles[i][j];
                tile.nextTileToGoal = null;
            }
        }
    }

    private getNeighbors(tile: TileComponent): TileComponent[] {
        const { x, y } = tile.pos;
        const neighbors: TileComponent[] = [];

        if (x > 0) { // Left
            const left = this.tiles[x - 1][y]
            if (!this.isOccupied(left))
                neighbors.push(left)
        }
        if (x < this.width - 1) { // Right
            const right = this.tiles[x + 1][y];
            if (!this.isOccupied(right))
                neighbors.push(right);
        }

        if (y > 0) { // Up
            const up = this.tiles[x][y - 1];
            if (!this.isOccupied(up))
                neighbors.push(up);
        }

        if (y < this.height - 1) { // Down
            const down = this.tiles[x][y + 1];
            if (!this.isOccupied(down))
                neighbors.push(down);
        }

        return neighbors;
    }

    public spawnEnemy() {
        let spawnTile = this.spawnTile()

        if (!spawnTile)
            return

        spawnTile.spawnEnemy()
    }

    /**
     * hasAnyEnemy
     */
    public hasAnyEnemy(): boolean {
        for (const tileRow of this.tiles) {
            for (const tile of tileRow) {
                if (tile.enemies.length > 0) {
                    return true
                }
            }
        }

        return false
    }


    private isOccupied(tile: TileComponent) {
        return tile.building != null
    }

    private debugEntities: Entity[] = []

    private clearDebugField() {
        for (const e of this.debugEntities) {
            engine.removeEntity(e)
        }

        this.debugEntities = []
    }

    public debugField() {
        this.clearDebugField()

        log("Debug field")

        for (const tileRow of this.tiles) {
            for (const tile of tileRow) {
                if (tile.nextTileToGoal == null)
                    continue;

                var cone = new Entity
                this.debugEntities.push(cone)

                cone.addComponent(new ConeShape)

                //var position = tile.pos.add(new Vector2(3.5, 2.5))

                var nextPosition = tile.nextTileToGoal?.pos.add(new Vector2(3.5, 2.5))

                var transform = new Transform(
                    {
                        //position: new Vector3(position.x, 0, position.y),
                        position: tile.getGlobalPosition(),
                        scale: new Vector3(.2, .2, .2)
                    })

                transform.lookAt(new Vector3(nextPosition?.x, 0, nextPosition?.y))

                transform.rotate(Vector3.Right(), 90)

                cone.addComponent(transform)

                engine.addEntity(cone)
            }
        }
    }
}
