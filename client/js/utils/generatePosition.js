function generatePositions(quantity){
    // const min = -25;
    // const max = 25;

    const xRange = [-50,50]; // min/max for x
    const yRange = [-25,25]; // idem for y
    const zRange = [-50,50]; // idem for z

    let positions = [];
    for (let i=0; i<quantity; i++){
	let position = [];
	// for (let j=0; j<3; j++){
	//     let val = Math.random()* (max-min) + min;
	//     position.push(val);
	// }
	const x = Math.random()* (xRange[1]-xRange[0]) + xRange[0];
	const y = Math.random()* (yRange[1]-yRange[0]) + yRange[0];
	const z = Math.random()* (zRange[1]-zRange[0]) + zRange[0];
	position.push(x,y,z);
	
	positions.push(position);
    }
    return positions
}
function generateJson(){
    const positions = generatePositions(24);

    let json = '[';
    for(let i=0; i<positions.length; i++){
	json += '{',
	json += '"name" : "temp-'+i+'",'
	json += '"content": "Lorem ipsum dolor sit amet",',
	json += '"id" : "'+buildId()+'",'
	json += '"position" : ['+positions[i]+']'
	if(i !== positions.length-1){
	    json += '},'
	} else {
	    json += '}'
	}
    }
    json += ']';



    console.log(json);
}
function buildId(){
    const idLength = 24;
    let id = "";
    const charArray = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for(let i=0; i<idLength; i++){
	id += charArray.charAt(Math.random()*charArray.length);
    }

    return id;
}
generateJson();
