import 'babel-polyfill';
import co from 'co';

co(function *() {
    console.log("main loop started");
    console.log("waiting for setup");
    yield sleep(5000);
    //load drone object
    var drone = document.querySelector("#simdrone");

    while(true){
	drone.setAttribute("dronesimulator","state: takeoff; speed: 0.0");
	console.log("setting state to takeoff");
	yield sleep(5000);
	drone.setAttribute("dronesimulator","state: up; speed: 2.0");
	console.log("setting state to up");
	yield sleep(2000);
	drone.setAttribute("dronesimulator","state: forward; speed: 2.0");
	console.log("setting state to forward");
	yield sleep(2000);
	drone.setAttribute("dronesimulator","state: right; speed: 2.0");
	console.log("setting state to right");
	yield sleep(2000);
	drone.setAttribute("dronesimulator","state: backward; speed: 2.0");
	console.log("setting state to backward");
	yield sleep(2000);
	drone.setAttribute("dronesimulator","state: left; speed: 2.0");
	console.log("setting state to left");
	yield sleep(2000);
	drone.setAttribute("dronesimulator","state: down; speed: 2.0");
	console.log("setting state to down");
	yield sleep(2000);
    }
});   
