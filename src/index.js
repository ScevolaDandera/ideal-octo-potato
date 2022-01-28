import { Scene3D, PhysicsLoader, Project, THREE, FirstPersonControls, ExtendedObject3D } from "enable3d";


class MainScene extends Scene3D {
    constructor() {
        super('MainScene')
    }

    init() {
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.stopMoving = true;
    }

    preload() {

    }

    create() {
        const { camera, ground, light, sky } = this.warpSpeed();
        // this.physics.debug.enable();

        this.player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
        this.scene.add(this.player);
        // add physics to player
        this.physics.add.existing(this.player, {
            shape: "concaveMesh",
            mass: 0.1,
            collisionFlags: 0,
        });
    

        this.player.position.setY(5);
        // add first person controls
    //    this.firstPersonControls = new FirstPersonControls(this.camera, this.player, {});
        document.onkeydown = this.keyboardControls.bind(this);
        document.onkeyup = this.stopMovingPlayer.bind(this);
        

    }

    stopMovingPlayer(e) {
        this.stopMoving = true;
    }


    keyboardControls(e) {
        this.stopMoving = false;
        //change body to Kinetic
        this.player.body.setCollisionFlags(2);
        

        switch (e.key) {
            case 'w':
                this.player.position.z -= 0.1;
                break;
            case 'a':
                this.player.position.x -= 0.1;
                break;
            case 's':
                this.player.position.z += 0.1;
                break;
            case 'd':
                this.player.position.x += 0.1;
                break;
            case ' ':
                if(this.player.position.y<2) {
                    this.player.position.y += 0.1;
                }
                
                break;
    }
    this.player.body.needUpdate = true;

    //once updated, set collision flag to dynamic
    this.player.body.once.update( () => {
        this.player.body.setCollisionFlags(0);
        this.player.body.setVelocity(0, 0, 0);
        this.player.body.setAngularVelocity(0, 0, 0);
    });

}
    update() {
        this.player.rotation.y += 0.1;
        this.player.body.needUpdate = true;
    }






}
const config = { scenes: [MainScene], antialias: true };
PhysicsLoader('/libs/ammo', () => new Project(config));