import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


const model = new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    loader.setPath('/static/models/erika_archer/');
    loader.load('erika_archer.fbx', (fbx) => {
        const s = 0.01;
        fbx.scale.set(s,s,s);
        fbx.traverse(c => {
            c.castShadow = true;
        });
        resolve(fbx);
    });
});

// let animations = [];

const animation = new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    loader.setPath('/static/models/erika_archer/animations/');
    loader.load('standing walk forward.fbx', (fbx) => {
        // animations.push(fbx);
        resolve(fbx);
});
});


export const modelWithAnimation = Promise.all([model, animation]);
