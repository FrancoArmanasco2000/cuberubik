import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, EdgesGeometry, LineSegments, LineBasicMaterial, Raycaster, Vector2, Group } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotate } from "three/webgpu";

const scene = new Scene(); // Escena
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Cámara

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometría
const geometry = new BoxGeometry();

const cubes_ = [];

const colors = ["red", "blue", "green", "yellow", "orange", "white"];
let val = 0;
const rightColumnFaceGroup = new Group();
const middleColumnFaceGroup = new Group();

const createCube = () => {
    for (let k = -1; k < 2; k++) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const materials = [
                    new MeshBasicMaterial({ color: "white" }),
                    new MeshBasicMaterial({ color: "white" }),
                    new MeshBasicMaterial({ color: "white" }),
                    new MeshBasicMaterial({ color: "white" }),
                    new MeshBasicMaterial({ color: "white" }),
                    new MeshBasicMaterial({ color: "white" })  
                ];

                const cube = new Mesh(geometry, materials);
                cube.position.x = i;
                cube.position.y = j;
                cube.position.z = k;
                
                const edges = new EdgesGeometry(geometry);
                const edgeMaterial = new LineBasicMaterial({ color: "black" });
                const edge = new LineSegments(edges, edgeMaterial);
                cube.add(edge);

                scene.add(cube);
                cubes_.push(cube);
                if(i === 0) {
                    middleColumnFaceGroup.add(cube);
                }
                if (i === 1) {
                    rightColumnFaceGroup.add(cube);
                }
            }
        }
    }
};

createCube();
scene.add(rightColumnFaceGroup);
scene.add(middleColumnFaceGroup);

camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;


const raycaster = new Raycaster();
const mouse = new Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(cubes_, true);

    const intersection = intersects.find(intersection => !(intersection.object instanceof LineSegments));

    if (intersection) {
        const clickedCube = intersection.object;
        const face = intersection.faceIndex;

        const faceId = Math.floor(face / 2);

        clickedCube.material[faceId].color.set(colors[val]);
        console.log(cubes_.indexOf(clickedCube));
        val++;
        if (val == 6) val = 0;
    }
}

window.addEventListener('click', onMouseClick);

let rotating = false;
let rotationStep = 0;

function rotateRightFace() {
    rotating = true;
    rotationStep = 0;
}

function rotateMiddleFace() {
    rotating = true;
    rotationStep = 0;
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        rotateRightFace();
       //rotateMiddleFace(); 
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 

    // Rotar la cara derecha si está en proceso de rotación
    if (rotating) {
        rightColumnFaceGroup.rotation.x += 0.05; // rotar 0.05 radianes
        //middleColumnFaceGroup.rotation.x += 0.05; // mover 0.05 unidades
        rotationStep += Math.PI/60; // aumentar el paso
        if(rotationStep === Math.PI/2){
            rotating = false
        } else if(rotationStep > Math.PI/2){
            rotating = false
            console.log(rotationStep.toFixed(17));
            console.log(Math.PI/2);
        }
            
    }
    renderer.render(scene, camera);
}

animate();
