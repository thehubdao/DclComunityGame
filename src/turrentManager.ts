import { TurretComponent } from "./components/turret"

export class TurretManager{
    public static instance = new TurretManager

    private turrets: TurretComponent[] = []

    public removeAllTurrets(){
        for(let t of this.turrets){
            t.tile?.removeTurret()
        }
    }

    public registerTurret(turret: TurretComponent){
        this.turrets.push(turret)
    }

    public unregisterTurret(turret: TurretComponent){
        this.turrets = this.turrets.filter(t=>t!=turret)
    }
}