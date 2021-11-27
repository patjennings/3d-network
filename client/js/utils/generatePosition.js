function generatePositions(quantity){
    const min = -25;
    const max = 25;

    let positions = [];
    for (let i=0; i<quantity; i++){
	let position = [];
	for (let j=0; j<3; j++){
	    let val = Math.random()* (max-min) + min;
	    position.push(val);
	}
	positions.push(position)
    }
    return positions
}
function generateJson(){
    const positions = generatePositions(50);

    let json = '[';
    for(let i=0; i<positions.length; i++){
	json += '{',
	json += '"name" : "",'
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
