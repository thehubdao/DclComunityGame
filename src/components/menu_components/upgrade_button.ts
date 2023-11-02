
/*
#DCECOMP
{
    "class": "UpgradeButton",
    "category": "Menu/Buttons"
}
*/

import { PermanentUpgrade, PermanentUpgradeManager } from "src/permanent_upgrade_manager"


@Component("UpgradeButton")
export class UpgradeButton {
    private _entity?: Entity;
    private _levelText?: TextShape;
    private _upgrade?: PermanentUpgrade;

    init(entity: Entity) {
        this._entity = entity;
        this._upgrade = PermanentUpgradeManager.damageUpgrade;
        entity.addComponent(new OnPointerDown(()=>{
            this._upgrade!.upgrade();
        }))

        this.updateText();
        this._upgrade.onUpgradeChanged.callbacks.push(()=> this.updateText());
    }


    updateText(){
        if(!this._levelText){
            var e = new Entity
            var ts = new TextShape
            ts.billboard = true
            ts.outlineColor = Color3.Black()
            ts.outlineWidth = .2
            ts.fontSize = 6
            this._levelText = ts
            e.addComponent(ts)
            e.addComponent(new Transform({position:new Vector3(0,1,0)}))
            e.setParent(this._entity!)
        }

        this._levelText.value = this._upgrade!.level.toString(); 
    }
}