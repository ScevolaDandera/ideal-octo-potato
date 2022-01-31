import { Scene3D, PhysicsLoader, Project, THREE, FirstPersonControls, ExtendedObject3D } from "enable3d";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { modelWithAnimation } from '../modules/CharactorLoader';


class MainScene extends Scene3D {
    constructor() {
        super('MainScene')
    }

    init() {
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.modelReady = false;
    }

    preload() {

    }





    create() {
        const { camera, ground, light, sky } = this.warpSpeed();
        //    this.physics.debug.enable();

        this.mixer = new THREE.AnimationMixer(this.scene);

        modelWithAnimation.then(fbx => {
            this.mixer = new THREE.AnimationMixer(fbx[0]);
            this.action = this.mixer.clipAction(fbx[1].animations[0]);
            this.action.play();
            this.erika = fbx[0];
            this.scene.add(this.erika);
            this.erikaspeed = 500;
            // this.physics.add.existing(this.erika, {
            //     shape: 'convexMesh',
            //     mass: 0.1,
            //     collisionFlags: 0,
            // });



            if (this.erika) {
                const loadingdiv = document.getElementById('loading');
                loadingdiv.style.display = 'none';
                console.log(this.mixer);
            }
        });




        // document.onkeydown = this.keyboardControls.bind(this);
        document.onkeyup = this.stopMovingPlayer.bind(this);


    }

    stopMovingPlayer(e) {
        this.action.play();
    }


    keyboardControls(e) {
        this.stopMoving = false;
        //change body to Kinetic
        this.erika.body.setCollisionFlags(2);
        switch (e.key) {
            case 'w':
                this.erika.position.z -= 0.5;
                break;
            case 'a':
                this.erika.position.x -= 0.5;
                break;
            case 's':
                this.erika.position.z += 0.5;
                break;
            case 'd':
                this.erika.position.x += 0.5;
                break;
            case ' ':
                if (this.erika.position.y < 2) {
                    this.erika.position.y += 0.5;
                }
                break;
        }
        //   this.haveSomeFun();
        this.erika.body.needUpdate = true;

        //once updated, set collision flag to dynamic
        this.erika.body.once.update(() => {
            this.erika.body.setCollisionFlags(0);
            this.erika.body.setVelocity(0, 0, 0);
            this.erika.body.setAngularVelocity(0, 0, 0);
        });

    }

    update() {
        if (this.mixer) {
            this.delta = this.clock.getDelta();
            this.mixer.update(this.delta * this.erikaspeed);
            this.erika.position.z += this.delta * this.erikaspeed * 1.5;
        }



    }






}
const config = { scenes: [MainScene], antialias: true };
PhysicsLoader('/libs/ammo', () => new Project(config));