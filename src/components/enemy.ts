import { TileComponent } from "./tile";

/*
#DCECOMP
{
    "class": "EnemyComponent"
}
*/


@Component("EnemyComponent")
export class EnemyComponent {
    tile: TileComponent | null = null;

    entity?: Entity;

    timerUntilNextStep: number = 1;

    init(entity: Entity) {
        this.entity = entity
        EnemySystem.require()
    }

    public setPos(){
        this.entity!.getComponent(Transform).position = this.tile!.getGlobalPosition()
    }

    public doStep(){
        this.tile = this.tile?.nextTileToGoal ?? null

        this.setPos()
    }
}



class EnemySystem implements ISystem{
    static instance : EnemySystem |null = null

    static require(){
        if(!this.instance){
            this.instance = new EnemySystem
            engine.addSystem(this.instance)
        }
    }

    update(dt: number): void {

        for (const entity of engine.getComponentGroup(EnemyComponent).entities) {
            const enemy= entity.getComponent(EnemyComponent)
            enemy.timerUntilNextStep -=dt;

            if(enemy.timerUntilNextStep<=0){
                enemy.doStep()

                enemy.timerUntilNextStep = 1
            }
        }
    }
}