import { GameManager, GameState } from "src/gameManager"

/*
#DCECOMP
{
    "class": "StartWaveButton",
    "category": "Menu/Buttons"
}
*/


@Component("StartWaveButton")
export class StartWaveButton {

    init(entity: Entity) {
        entity.addComponent(new OnPointerDown(()=>{
            GameManager.instance!.setState(GameState.Fight)
        }))
    }
}