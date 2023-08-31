import { GameManager, GameState } from "src/gameManager"

/*
#DCECOMP
{
    "class": "StartButton",
    "category": "Menu/Buttons"
}
*/


@Component("StartButton")
export class StartButton {

    init(entity: Entity) {
        entity.addComponent(new OnPointerDown(()=>{
            GameManager.instance!.setState(GameState.Build)
        }))
    }
}