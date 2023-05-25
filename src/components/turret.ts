

/*
#DCECOMP
{
    "class": "TurretComponent"
}
*/

@Component("TurretComponent")
export class TurretComponent{
    entity?: Entity;

    init(entity:Entity){
        this.entity = entity
    }
}