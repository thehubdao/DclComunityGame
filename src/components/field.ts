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
export class FieldComponent{
    private tiles: TileComponent[][] = [];

    public width = 5;
    public height = 4;

    init(entity: Entity) {
        log("init field 2")
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = []
            for (let j = 0; j < this.height; j++) {
                let t = SceneFactory.createTile()

                let tileComponent = t.exposed.Tile.tileComponent
                tileComponent.pos.x = i
                tileComponent.pos.y = j

                t.sceneRoot.entity.setParent(entity)
                t.sceneRoot.transform.position = new Vector3(i,0,j);

                this.tiles[i].push(tileComponent)
            }
        }
    }
}