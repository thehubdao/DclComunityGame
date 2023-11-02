import { Event } from "./events";

export class PermanentUpgrade{
    private _level = 0;
    public onUpgradeChanged: Event = new Event();
    

    public costForNextUpgrade():number {
        return this._level+1; 
    }

    public upgrade(){
        if(PermanentUpgradeManager.diamonds >= this.costForNextUpgrade()){
            PermanentUpgradeManager.diamonds -= this.costForNextUpgrade();
            this._level++;
            this.onUpgradeChanged.fire();
        }
    }

    public get level():number{
        return this._level;
    }
}

export class PermanentUpgradeManager{
    private static _diamonds: number = 5;

    public static set diamonds(v : number) {
        this._diamonds = v;
        this.onDiamondsChanged.fire();
    }
    public static get diamonds(): number {
        return this._diamonds;
    }
    

    public static damageUpgrade: PermanentUpgrade = new PermanentUpgrade();
    static onDiamondsChanged: Event = new Event();
}
