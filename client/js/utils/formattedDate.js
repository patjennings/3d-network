export default function formattedDate(){
    const date = new Date();
    const year = date.getFullYear()
    const month = regularMonth(date.getMonth())
    const day = date.getDate()
    const hours = twoDigitsHour(date.getHours())
    const minutes = date.getMinutes()
    
    const result = year+"-"+month+"-"+day+" "+hours+":"+minutes;

    return result;
}

function regularMonth(month){
    let result = month+1;

    if(result < 10){
	result = "0"+result
    }
    else {
	result = result.toString()
    }
    return result;
}
function twoDigitsHour(hour){
    let result = hour;

    if(result < 10){
	result = "0"+result
    }
    else {
	result = result.toString()
    }
    return result;
}
