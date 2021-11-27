import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import scale from './utils/scale';

// let objectPoints;
// let nebulaPoints;
let data = {};

const path1 = ["cocotte", "lettre", "cube"];



(async function(window){
    // console.log(data);
    loadData("./data/object-points.json", "points").then(loadData("./data/nebula-points.json", "nebula")).then(main);
})(window);

async function loadData(file, name){
    const response = await fetch(file);
    const loadedData = await response.json();

    Object.defineProperty(data, name, {
	"value": loadedData
    });
}

function main() {
    const canvas = document.querySelector('#c');

    const renderer = new THREE.WebGLRenderer({
	canvas,
	alpha: true,
    });
    
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const clock = new THREE.Clock();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const stats = Stats()
    document.body.appendChild(stats.dom)
    
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0.5, 0 );
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.minDistance = 50;
    controls.maxDistance = 110;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function drawPoints(type, data, color, opacity, isRandom, randomRatio=1){
	for(const element of data){
	    const pointGeometry = new THREE.SphereGeometry( isRandom ? Math.random()*randomRatio : 0.25, 32, 16 );
	    const materialPoints = new THREE.MeshBasicMaterial( { color: color, transparent: true} );
	    materialPoints.opacity = opacity;
	    const point = new THREE.Mesh( pointGeometry, materialPoints );
	    point.position.set(element.position[0], element.position[1], element.position[2]);
	    point.subtype = type;
	    point.name = element.name
    	    scene.add(point);
	}
    }

    function drawPath(path){
	
	const points = [];
	const materialLine = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true} );
	materialLine.opacity = 0.25;
	
	for(let point in data.points){
	    for(let node in path){
		if(data.points[point].name == path[node]){
		    points.push( new THREE.Vector3(data.points[point].position[0], data.points[point].position[1], data.points[point].position[2]));
		    console.log("point !");
		}
	    }
	}
	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const line = new THREE.Line( geometry, materialLine );
	scene.add(line);
    }
    function drawObject(file, name){
	const loader = new GLTFLoader();
	let obj;

	loader.load(file , function ( gltf ) {
	    obj = gltf.scene;
	    scene.add(obj)
	}, undefined, function ( error ) {
	    console.error( error );
	});


	for(const point in data.points){

	    for(const point in data.points){
		if(data.points[point] == name) {
		    
		}
	    }
	}
    }
    
    renderer.render( scene, camera );   

    drawPoints("object", data.points, 0xffffff, 1, false);
    drawObject('_assets/cocotte.glb', "cocotte");
    // drawPoints("nebula", data.nebula, 0xffffff, 0.35, true, 0.25);
    drawPath(path1);
    createLabels();
    animate();

    console.log(scene);



    function createLabels(){
	console.log('create labels');
	console.log(document.body);
	const wrapper = document.createElement('div');
	wrapper.setAttribute('id', 'wrapper')
	document.body.append(wrapper);
	for(const point in data.points){
	    const label = document.createElement('div')
	    const p = document.createElement('p')
	    label.setAttribute('id', data.points[point].name)
	    label.setAttribute('class', 'label')
	    p.append(data.points[point].name)
	    label.append(p)
	    wrapper.append(label);
	}
	    // <div class="label" id="cocotte">Cocotte</div>
    }


    function updateLabels() {
	// exit if we have not yet loaded the JSON file
	// if (!countries) {
	//     return;
	// }
	// console.log(tempV);
	const tempV = new THREE.Vector3();
	
	for (const point in data.points) {
	    const elem = document.getElementById(data.points[point].name);
	    // console.log(typeof(elem));
	    const position = {
		x: data.points[point].position[0],
		y: data.points[point].position[1],
		z: data.points[point].position[2]
	    };

	    tempV.copy(position);
	    tempV.project(camera);
	    // console.log(elem);

	    // console.log(tempV);
	    // convert the normalized position to CSS coordinates
	    const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	    const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
	    const z = tempV.z

	    if(data.points[point].name == "cocotte"){
		console.log(z*100);
		console.log(scale(z*100, 97.8,98.7,0,1));
		// console.console.log(z.map(0,0,0,0));
	    }
	    
	    // console.log(x);

	    // console.log("cocooooootte");
	    elem.setAttribute('style', 'transform: translate(-50%, 0%) translate('+x+'px,'+y+'px);opacity:'+scale(z*100, 97.8,98.7,1, 0)+';');
	    // elem.style.transform = 'translate(-50%, -50%) translate(${x}px,${y}px)';
	    // console.log(document.getElementById(data.points[point].name))
	    // elem.setAttribute("name", "name");
	    // console.log(elem);

	    
	    // const x = tempV.x*canvas.clientWidth;
	    // const y = tempV.y*canvas.clientHeight;
	    
	    // move the elem to that position


	    // set the zIndex for sorting
	    // elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
	}
    }

    // listeners
    window.addEventListener( 'mousedown', onClick, false );
    window.addEventListener( 'mouseup', onRelease, false );

    function onClick(e){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects( scene.children );
	let object;
	for ( let i = 0; i < intersects.length; i ++ ) {
	    if (intersects[i].object.subtype !== "nebula") {
		console.log("ok");
		object = intersects[i].object;
	    }
	}
	// console.log(scene);
	// for (let j = 0; j < scene.children.length; j++){
	//     // console.log(scene.children[i]);
	//     if(scene.children[j].type !== "Line"){
	// 	moveToCenter(scene.children[j])
	//     }

	// }
	if(object) ClickObject(object);
    }

    function ClickObject(o){
	const speed = 175;
	const easingType = TWEEN.Easing.Cubic.InOut;
	
	new TWEEN.Tween(o.scale)
	    .to(
                {
		    x: 5,
		    y: 5,
		    z: 5
                },
                speed
	    )
	    .easing(easingType)
	    .start()
	    .onComplete(function(){
		new TWEEN.Tween(o.scale)
		    .to(
			{
			    x: 1,
			    y: 1,
			    z: 1
			},
			speed/1.5
		    )
		    .easing(easingType)
		    .start()
	    })
    }
    function onRelease(e){
	console.log(raycaster);
	// raycaster.set(null);
    }
    
    function animate() {
	requestAnimationFrame( animate );

	const delta = clock.getDelta();
	controls.update();
	updateLabels();
	TWEEN.update();
	stats.update();
	renderer.render( scene, camera );



	// calculate objects intersecting the picking ray
	
	
	// for(const object of scene.children){
	//     let isFirst = false;
	
	
	//     if(object.position.distanceTo(camera.position) < 80){
	// 	if(!isFirst && object.type !== "Line"){
	// 	    object.material.opacity = 1;
	// 	    isFirst = true;
	// 	}
	
	//     } else {
	// 	object.material.opacity = 1;
	
	//     }


	// }
    }
}

