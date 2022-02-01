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
        const { ground, light, sky } = this.warpSpeed('-camera');
      //     this.physics.debug.enable();
           const axesHelper = new THREE.AxesHelper( 5 );
            this.scene.add( axesHelper );
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.25, 1000 );
        this.scene.add( this.camera );
        this.camera.position.set(0, 2, -2 );
		this.camera.lookAt( new THREE.Vector3( 2, 4, 2 ) );

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        this.scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 20, 10 );
        this.scene.add( dirLight );

        console.log(this.scene);



        this.mixer = new THREE.AnimationMixer(this.scene);

        modelWithAnimation.then(fbx => {
            this.mixer = new THREE.AnimationMixer(fbx[0]);
            this.action = this.mixer.clipAction(fbx[1].animations[0]);
            this.action.play();
            this.erika = fbx[0];
            this.scene.add(this.erika);
            this.erikaspeed = 500;
            this.physics.add.existing(this.erika, {
                shape: 'convexMesh',
                mass: 0.1,
                collisionFlags: 1,
            });



            if (this.erika.body) {
                const loadingdiv = document.getElementById('loading');
                loadingdiv.style.display = 'none';
            }
        });




        document.onkeydown = this.keyboardControls.bind(this);
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

    cameraUpdate() {
        //this.camera
        // follow camera with player
        // this.camera.position.x = this.erika.position.x;
        // this.camera.position.y = this.erika.position.y + 2;
        // this.camera.position.z = this.erika.position.z;
        this.camera.lookAt(this.erika.position);

    }

    update() {
        if (this.mixer) {
            this.delta = this.clock.getDelta();
         //   this.mixer.update(this.delta * this.erikaspeed);
            // this.erika.position.z += this.delta * this.erikaspeed * 1.5;
            if(this.camera) {
                this.cameraUpdate();
            }
        }
      
      


    }






}
const config = { scenes: [MainScene], antialias: true };
PhysicsLoader('/libs/ammo', () => new Project(config));