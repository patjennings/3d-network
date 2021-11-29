import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import scale from './utils/scale';

// let objectPoints;
// let nebulaPoints;
let data = {};

const assetsFolder = "_assets/";

const path1 = ['temp-20', 'temp-18', 'temp-19'];
const path2 = ['temp-1', 'temp-11', 'temp-4', 'temp-10'];
const path3 = ['temp-3', 'temp-13', 'temp-15', 'temp-6'];
const path4 = ['temp-5', 'temp-14', 'temp-16', 'temp-17', 'temp-7'];
const path5 = ['temp-2', 'temp-8', 'temp-12', 'temp-9', 'temp-0'];
const path6 = ['temp-21', 'temp-22', 'temp-23'];

(function(window){
    initialize();
})(window);

async function initialize(){
    let objectPoints = await fetch('./data/object-points-2.json');
    let pointsLoaded = await objectPoints.json();
    let nebulaPoints = await fetch('./data/nebula-points-2.json');
    let nebulaLoaded = await nebulaPoints.json();

    Object.defineProperty(data, 'objects', {
	'value': pointsLoaded
    });
    Object.defineProperty(data, 'nebula', {
	'value': nebulaLoaded
    });

    main();
}



function main() {
    const canvas = document.querySelector('#c');

    const renderer = new THREE.WebGLRenderer({
	canvas,
	alpha: true
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


	    type == "object" ? drawObject(assetsFolder+element.mesh, element.name, element.position) : null;
	}
    }

    function drawPath(path){
	
	const points = [];
	const materialLine = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true} );
	materialLine.opacity = 0.25;
	
	for(let point in data.objects){
	    for(let node in path){
		if(data.objects[point].name == path[node]){
		    points.push( new THREE.Vector3(data.objects[point].position[0], data.objects[point].position[1], data.objects[point].position[2]));
		}
	    }
	}
	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const line = new THREE.Line( geometry, materialLine );
	scene.add(line);
    }
    function drawObject(file, name, position){
	const loader = new GLTFLoader();

	loader.load(file , function (gltf) {

	    const model = gltf.scene
	    model.name = name;

	    model.traverse(function(object){
		if(object.isMesh){
		    object.material.color.set(0xffffff);
		    object.material.emissive.set(0xffffff);
		    object.material.transparent = true;
		    object.material.opacity = 0.5;
		}

	    })

	    model.position.set(position[0], position[1]+2, position[2])
	    model.rotation.set(0, Math.random()*45, 0);
	    // model.scale.set(0.5,0.5,0.5);
	    scene.add(model);
	
	}, undefined, function ( error ) {
	    console.error( error );
	});
	for(const point in data.objects){
	    for(const point in data.objects){
		if(data.objects[point] == name) {
		    
		}
	    }
	}
    }
    
    renderer.render( scene, camera );   

    drawPoints('object', data.objects, 0xffffff, 1, false);
    drawPoints('nebula', data.nebula, 0xffffff, 0.5, true, 0.15);
    // console.log(data.nebula.length);
    // for(const element of data.nebula){
	// console.log(element);
    // }
    drawPath(path1);
    drawPath(path2);
    drawPath(path3);
    drawPath(path4);
    drawPath(path5);
    drawPath(path6);
    createLabels();
    animate();

    console.log(scene);



    function createLabels(){
	console.log('create labels');
	// console.log(document.body);
	const wrapper = document.createElement('div');
	wrapper.setAttribute('id', 'wrapper')
	document.body.append(wrapper);
	for(const point in data.objects){
	    const label = document.createElement('div')
	    const p = document.createElement('p')
	    label.setAttribute('id', data.objects[point].name)
	    label.setAttribute('class', 'label')
	    p.append(data.objects[point].name)
	    label.append(p)
	    wrapper.append(label);
	}
	    // <div class='label' id='cocotte'>Cocotte</div>
    }


    function updateLabels() {
	// exit if we have not yet loaded the JSON file
	if (!data.objects) {
	    return;
	}
	const tempV = new THREE.Vector3();
	
	for (const point in data.objects) {
	    const elem = document.getElementById(data.objects[point].name);
	    // console.log(typeof(elem));
	    const position = {
		x: data.objects[point].position[0],
		y: data.objects[point].position[1],
		z: data.objects[point].position[2]
	    };

	    tempV.copy(position);
	    tempV.project(camera);
	    // console.log(elem);

	    // console.log(tempV);
	    // convert the normalized position to CSS coordinates
	    const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	    const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
	    const z = tempV.z


	    
	    // console.log(x);

	    // console.log('cocooooootte');
	    elem.setAttribute('style', 'transform: translate(-50%, 0%) translate('+x+'px,'+y+'px);opacity:'+scale(z*100, 97.8,98.7,1, 0)+';');
	    elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
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
	    if (intersects[i].object.subtype !== 'nebula') {
		object = intersects[i].object;
	    }
	}
	// console.log(scene);
	// for (let j = 0; j < scene.children.length; j++){
	//     // console.log(scene.children[i]);
	//     if(scene.children[j].type !== 'Line'){
	// 	moveToCenter(scene.children[j])
	//     }

	// }
	if(object) ClickObject(object);
    }

    function ClickObject(o){
	console.log(o.parent.name);
	
	// ANIMATION
	// const speed = 175;
	// const easingType = TWEEN.Easing.Cubic.InOut;
	
	// new TWEEN.Tween(o.scale)
	//     .to(
        //         {
	// 	    x: 5,
	// 	    y: 5,
	// 	    z: 5
        //         },
        //         175
	//     )
	//     .easing(TWEEN.Easing.Cubic.In)
	//     .start()
	//     .onComplete(function(){
	// 	new TWEEN.Tween(o.scale)
	// 	    .to(
	// 		{
	// 		    x: 1,
	// 		    y: 1,
	// 		    z: 1
	// 		},
	// 		175/1.5
	// 	    )
	// 	    .easing(TWEEN.Easing.Cubic.Out)
	// 	    .start()
	//     })
    }
    function onRelease(e){
	console.log(raycaster);
	// raycaster.set(null);
    }


    function animate() {
	requestAnimationFrame( animate );

	const delta = clock.getDelta();
	controls.update();
	// updateLabels();
	TWEEN.update();
	stats.update();
	renderer.render( scene, camera );

	scene.traverse(function(object){
	    if(object.isMesh){
		// console.log(object.parent.type == 'Group');

		if(object.parent.type == 'Group'){
		    object.material.opacity = scale(object.parent.position.distanceTo(camera.position), 122, 90, 0.5, 1);
		} else {
		    object.material.opacity = scale(object.position.distanceTo(camera.position), 122, 90, 0.5, 1);
		}

	    }
	    // if(object.isGroup){
	    // 	object.traverse(function(obj){
	    // 	    if(obj.isMesh){
	    // 		// console.log('>>>>>>>>>>>>> '+obj.material.opacity);
	    // 		// console.log(group.position.distanceTo(camera.position));
	    // 		obj.material.opacity = scale(obj.parent.position.distanceTo(camera.position), 122, 90, 0, 1)
	    // 		// group.material.opacity = 0.25;
	    // 	    }
	    // 	})
	    // }

	})
	// for(const object of scene.children){
	    
	//     if(object.type == 'Mesh'){
	// 	// if (object.name == 'cocotte') {
	// 	//     console.log(object.position.distanceTo(camera.position));
	// 	// }
	// 	// object.material.opacity = scale(object.position.z, -20, 20);
	//     } else if (object.type == 'Group'){
	// 	object.traverse(function(obj){
	// 	    // obj.material.opacity = Math.random();
	// 	    // console.log(obj.position.distanceTo(camera.position));
	// 	})
	// 	// object.children[0].material.opacity = 0.5
		
	// 	// console.log(object.children[0].material.transparent);
	//     }
	//     // console.log(object);
	//     // object.material.opacity = 0.5;
	// }
	// calculate objects intersecting the picking ray
	
	
	// for(const object of scene.children){
	//     let isFirst = false;
	
	
	//     if(object.position.distanceTo(camera.position) < 80){
	// 	if(!isFirst && object.type !== 'Line'){
	// 	    object.material.opacity = 1;
	// 	    isFirst = true;
	// 	}
	
	//     } else {
	// 	object.material.opacity = 1;
	
	//     }


	// }
    }
}

