import { EnemyComponent } from "src/components/enemy"
import { FieldComponent } from "src/components/field"
import { TileComponent } from "src/components/tile"
import { TurretComponent } from "src/components/turret"
export type DceScene = {
    /**
     * The root entity of the scene. All entities in this scene are children of either this scene root entity, or of another entity in the scene
     */
    sceneRoot: DceEntity

    /**
     * Shows the scene with all its entities. Shortcut for `sceneRoot.show()`
     */
    show: () => void;

    /**
     * Hides the scene with all its entities. Shortcut for `sceneRoot.hide()`
     */
    hide: () => void
}

export type DceEntity = {
    /**
     * The Decentraland entity
     */
    entity: Entity

    /**
     * The Transform component of the entity. Although, it is not required by Decentraland, every DceEntity will have a Transform added
     */
    transform: Transform

    /**
     * Show this entity and all its children. This calls `engine.addEntity(entity)` internally.
     */
    show: () => void

    /**
     * Hide this entity and all its children. This calls `engine.removeEntity(entity)` internally.
     */
    hide: () => void
}

export type WithGLTFShape = {
    gLTFShape: GLTFShape
}

export type WithEnemyComponent = {
    enemyComponent: EnemyComponent
}

export type WithFieldComponent = {
    fieldComponent: FieldComponent
}

export type WithBoxShape = {
    boxShape: BoxShape
}

export type WithTileComponent = {
    tileComponent: TileComponent
}

export type WithCylinderShape = {
    cylinderShape: CylinderShape
}

export type WithSphereShape = {
    sphereShape: SphereShape
}

export type WithTurretComponent = {
    turretComponent: TurretComponent
}

export type Enemy = DceScene & {
    exposed: {
        PlaceHolder: DceEntity & WithGLTFShape & WithEnemyComponent,
    }
}
export type MainScene = DceScene & {
    exposed: {
    }
}
export type Tile = DceScene & {
    exposed: {
        Tile: DceEntity & WithBoxShape & WithTileComponent,
    }
}
export type Turret = DceScene & {
    exposed: {
        Turret: DceEntity & WithTurretComponent,
    }
}

export class SceneFactory {
    /**
     * Creates a new instance of the scene Enemy
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createEnemy(rootEntity: Entity | null = null): Enemy {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }

        const ent4_PlaceHolder1 = new Entity("PlaceHolder")
        const ent4_PlaceHolder1Transform = new Transform()
        ent4_PlaceHolder1Transform.position = new Vector3(0, 0, 0)
        ent4_PlaceHolder1Transform.rotation = new Quaternion(0, -0.7071068, 0, 0.7071068)
        ent4_PlaceHolder1Transform.scale = new Vector3(0.1791344, 0.1791344, 0.1791344)
        if("init" in ent4_PlaceHolder1Transform && typeof ent4_PlaceHolder1Transform.init === "function")
        {
            ent4_PlaceHolder1Transform.init(ent4_PlaceHolder1)
        }
        ent4_PlaceHolder1.addComponent(ent4_PlaceHolder1Transform)
        const ent4_PlaceHolder1GLTFShape = new GLTFShape("dcl-edit/build/builder_assets/models/Horizontal_Flying_Taxi_Available.glb")
        ent4_PlaceHolder1GLTFShape.visible = true
        ent4_PlaceHolder1GLTFShape.withCollisions = true
        ent4_PlaceHolder1GLTFShape.isPointerBlocker = true
        if("init" in ent4_PlaceHolder1GLTFShape && typeof ent4_PlaceHolder1GLTFShape.init === "function")
        {
            ent4_PlaceHolder1GLTFShape.init(ent4_PlaceHolder1)
        }
        ent4_PlaceHolder1.addComponent(ent4_PlaceHolder1GLTFShape)
        const ent4_PlaceHolder1EnemyComponent = new EnemyComponent()
        if("init" in ent4_PlaceHolder1EnemyComponent && typeof ent4_PlaceHolder1EnemyComponent.init === "function")
        {
            ent4_PlaceHolder1EnemyComponent.init(ent4_PlaceHolder1)
        }
        ent4_PlaceHolder1.addComponent(ent4_PlaceHolder1EnemyComponent)

        ent4_PlaceHolder1.setParent(rootEntity)

        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
                PlaceHolder: {
                    entity: ent4_PlaceHolder1,
                    transform: ent4_PlaceHolder1Transform,
                    gLTFShape: ent4_PlaceHolder1GLTFShape,
                    enemyComponent: ent4_PlaceHolder1EnemyComponent,
                    show() { engine.addEntity(this.entity) },
                    hide() { engine.removeEntity(this.entity) }
                },
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
    /**
     * Creates a new instance of the scene MainScene
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createMainScene(rootEntity: Entity | null = null): MainScene {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }

        const ent4_Tiles1 = new Entity("Tiles")
        const ent4_Tiles1Transform = new Transform()
        ent4_Tiles1Transform.position = new Vector3(3, 0, 2)
        ent4_Tiles1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_Tiles1Transform.scale = new Vector3(1, 1, 1)
        if("init" in ent4_Tiles1Transform && typeof ent4_Tiles1Transform.init === "function")
        {
            ent4_Tiles1Transform.init(ent4_Tiles1)
        }
        ent4_Tiles1.addComponent(ent4_Tiles1Transform)
        const ent4_Tiles1FieldComponent = new FieldComponent()
        ent4_Tiles1FieldComponent.height = 8
        ent4_Tiles1FieldComponent.width = 10
        if("init" in ent4_Tiles1FieldComponent && typeof ent4_Tiles1FieldComponent.init === "function")
        {
            ent4_Tiles1FieldComponent.init(ent4_Tiles1)
        }
        ent4_Tiles1.addComponent(ent4_Tiles1FieldComponent)

        ent4_Tiles1.setParent(rootEntity)

        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
    /**
     * Creates a new instance of the scene Tile
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createTile(rootEntity: Entity | null = null): Tile {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }

        const ent4_Tile1 = new Entity("Tile")
        const ent4_Tile1Transform = new Transform()
        ent4_Tile1Transform.position = new Vector3(0.5, 0.05867857, 0.5)
        ent4_Tile1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_Tile1Transform.scale = new Vector3(0.8728396, -0.03133535, 0.8728396)
        if("init" in ent4_Tile1Transform && typeof ent4_Tile1Transform.init === "function")
        {
            ent4_Tile1Transform.init(ent4_Tile1)
        }
        ent4_Tile1.addComponent(ent4_Tile1Transform)
        const ent4_Tile1BoxShape = new BoxShape()
        if("init" in ent4_Tile1BoxShape && typeof ent4_Tile1BoxShape.init === "function")
        {
            ent4_Tile1BoxShape.init(ent4_Tile1)
        }
        ent4_Tile1.addComponent(ent4_Tile1BoxShape)
        const ent4_Tile1TileComponent = new TileComponent()
        if("init" in ent4_Tile1TileComponent && typeof ent4_Tile1TileComponent.init === "function")
        {
            ent4_Tile1TileComponent.init(ent4_Tile1)
        }
        ent4_Tile1.addComponent(ent4_Tile1TileComponent)

        ent4_Tile1.setParent(rootEntity)

        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
                Tile: {
                    entity: ent4_Tile1,
                    transform: ent4_Tile1Transform,
                    boxShape: ent4_Tile1BoxShape,
                    tileComponent: ent4_Tile1TileComponent,
                    show() { engine.addEntity(this.entity) },
                    hide() { engine.removeEntity(this.entity) }
                },
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
    /**
     * Creates a new instance of the scene Turret
     * @param rootEntity specify a root entity for the newly created scene. If null, a new Entity will be generated as the root
     */
    static createTurret(rootEntity: Entity | null = null): Turret {
        if (rootEntity == null) {
            rootEntity = new Entity()
            const rootEntityTrans = new Transform()
            rootEntity.addComponent(rootEntityTrans)
        } else {
            if (!rootEntity.hasComponent(Transform)) {
                rootEntity.addComponent(new Transform)
            }
        }

        const ent4_BoxEntity1 = new Entity("Box Entity")
        const ent4_BoxEntity1Transform = new Transform()
        ent4_BoxEntity1Transform.position = new Vector3(0.25, 0.5, 0)
        ent4_BoxEntity1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_BoxEntity1Transform.scale = new Vector3(0.7230104, 0.08635068, 0.06249949)
        if("init" in ent4_BoxEntity1Transform && typeof ent4_BoxEntity1Transform.init === "function")
        {
            ent4_BoxEntity1Transform.init(ent4_BoxEntity1)
        }
        ent4_BoxEntity1.addComponent(ent4_BoxEntity1Transform)
        const ent4_BoxEntity1BoxShape = new BoxShape()
        if("init" in ent4_BoxEntity1BoxShape && typeof ent4_BoxEntity1BoxShape.init === "function")
        {
            ent4_BoxEntity1BoxShape.init(ent4_BoxEntity1)
        }
        ent4_BoxEntity1.addComponent(ent4_BoxEntity1BoxShape)

        const ent4_CylinderEntity1 = new Entity("Cylinder Entity")
        const ent4_CylinderEntity1Transform = new Transform()
        ent4_CylinderEntity1Transform.position = new Vector3(0, 0.25, 0)
        ent4_CylinderEntity1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_CylinderEntity1Transform.scale = new Vector3(0.25, 0.25, 0.25)
        if("init" in ent4_CylinderEntity1Transform && typeof ent4_CylinderEntity1Transform.init === "function")
        {
            ent4_CylinderEntity1Transform.init(ent4_CylinderEntity1)
        }
        ent4_CylinderEntity1.addComponent(ent4_CylinderEntity1Transform)
        const ent4_CylinderEntity1CylinderShape = new CylinderShape()
        if("init" in ent4_CylinderEntity1CylinderShape && typeof ent4_CylinderEntity1CylinderShape.init === "function")
        {
            ent4_CylinderEntity1CylinderShape.init(ent4_CylinderEntity1)
        }
        ent4_CylinderEntity1.addComponent(ent4_CylinderEntity1CylinderShape)

        const ent4_SphereEntity1 = new Entity("Sphere Entity")
        const ent4_SphereEntity1Transform = new Transform()
        ent4_SphereEntity1Transform.position = new Vector3(0, 0.5, 0)
        ent4_SphereEntity1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_SphereEntity1Transform.scale = new Vector3(0.2619237, 0.2619237, 0.2619237)
        if("init" in ent4_SphereEntity1Transform && typeof ent4_SphereEntity1Transform.init === "function")
        {
            ent4_SphereEntity1Transform.init(ent4_SphereEntity1)
        }
        ent4_SphereEntity1.addComponent(ent4_SphereEntity1Transform)
        const ent4_SphereEntity1SphereShape = new SphereShape()
        if("init" in ent4_SphereEntity1SphereShape && typeof ent4_SphereEntity1SphereShape.init === "function")
        {
            ent4_SphereEntity1SphereShape.init(ent4_SphereEntity1)
        }
        ent4_SphereEntity1.addComponent(ent4_SphereEntity1SphereShape)

        const ent4_Turret1 = new Entity("Turret")
        const ent4_Turret1Transform = new Transform()
        ent4_Turret1Transform.position = new Vector3(0, 0, 0)
        ent4_Turret1Transform.rotation = new Quaternion(0, 0, 0, 1)
        ent4_Turret1Transform.scale = new Vector3(1, 1, 1)
        if("init" in ent4_Turret1Transform && typeof ent4_Turret1Transform.init === "function")
        {
            ent4_Turret1Transform.init(ent4_Turret1)
        }
        ent4_Turret1.addComponent(ent4_Turret1Transform)
        const ent4_Turret1TurretComponent = new TurretComponent()
        if("init" in ent4_Turret1TurretComponent && typeof ent4_Turret1TurretComponent.init === "function")
        {
            ent4_Turret1TurretComponent.init(ent4_Turret1)
        }
        ent4_Turret1.addComponent(ent4_Turret1TurretComponent)

        ent4_BoxEntity1.setParent(ent4_Turret1)
        ent4_CylinderEntity1.setParent(ent4_Turret1)
        ent4_SphereEntity1.setParent(ent4_Turret1)
        ent4_Turret1.setParent(rootEntity)

        engine.addEntity(rootEntity)

        return {
            sceneRoot: {
                entity: rootEntity,
                transform: rootEntity.getComponent(Transform),
                show() { engine.addEntity(this.entity) },
                hide() { engine.removeEntity(this.entity) }
            },
            exposed: {
                Turret: {
                    entity: ent4_Turret1,
                    transform: ent4_Turret1Transform,
                    turretComponent: ent4_Turret1TurretComponent,
                    show() { engine.addEntity(this.entity) },
                    hide() { engine.removeEntity(this.entity) }
                },
            },

            show() { this.sceneRoot.show() },
            hide() { this.sceneRoot.hide() }
        }
    }
}
