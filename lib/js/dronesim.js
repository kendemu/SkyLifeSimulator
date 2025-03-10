import 'babel-polyfill';

const socket = io.connect("http://localhost:3005");

let received_command = "landed";
let received_speed  = 0.0;

socket.on("command", function(data){
    received_command = data.command;
    if(data.value !== undefined){
	received_speed = data.value;
    }
});

AFRAME.registerComponent('dronesimulator',{
    schema: {
	state: {type: 'string'},
	speed: {type:  'number', default: 0.0}
    },

    init: function(){
	this.drone = this.el;
	this.target_height = 0.0;
	this.kp = 3.0;
	this.WEIGHT = 0.4;
    },
    takeoff: function(){
	this.target_height = 3.0;
	this.move([0, this.PIDControl(this.target_height), 0]);
    },
    landing: function(){
	if(this.collided){
	    this.state = "landed";
	}
	else{
	    this.target_height = 0.3;
	    this.move(0, this.PIDControl(this.target_height), 0);
	}
    },
    hover: function(){
	this.move([0, this.PIDControl(this.target_height), 0]);
    },
    forward: function(speed){
	this.move([0, this.PIDControl(this.target_height), -speed]);
    },
    backward: function(speed){
	this.move([0, this.PIDControl(this.target_height), speed]);
    },
    right: function(speed){
	this.move([speed, this.PIDControl(this.target_height), 0]);
    },
    left: function(speed){
	this.move([-speed, this.PIDControl(this.target_height), 0]);
    },
    up: function(speed){
	this.move([0, speed, 0]);
	this.target_height = this.drone.body.position.y;
    },
    down: function(speed){
	this.move([0, -speed, 0]);
    },
    clockwise: function(speed){
	this.rotate(-speed);
	this.move([0, this.PIDControl(this.target_height), 0]);
    },
    counterClockwise: function(speed){
	this.rotate(speed);
	this.move([0, this.PIDControl(this.target_height), 0]);
    },
    tick: function(t, dt){
	if (!dt) return;

	this.data.state = received_command;
	this.data.speed = received_speed;
	
	switch(this.data.state){
	    case "landed":
		break;
	    case "takeoff":
		this.takeoff();
		break;
	    case "land":
		this.landing();
		break;
	    case "hover":
		this.hover();
		break;
	    case "forward":
		this.forward(this.data.speed);
		break;
	    case "backward":
		this.backward(this.data.speed);
		break;
	    case "left":
		this.left(this.data.speed);
		break;
	    case "right":
		this.right(this.data.speed);
		break;
	    case "clockwise":
		this.clockwise(this.data.speed);
		break;
	    case "counterClockwise":
		this.counterClockwise(this.data.speed);
		break;
	    case "up":
		this.up(this.data.speed);
		break;
	    case "down":
		this.down(this.data.speed);
		break;
	    default:
		console.log("command not found");
		break;
	}	
    },
    PIDControl: function(target){
	return this.kp * (target - this.drone.body.position.y);	
    },
    quatToVec3: function(x,y,z,w){
	var ax = Math.atan2(2*y*z+2*x*w,1-2*x*x-2*y*y);
	var ay = Math.asin(2*x*z-2*y*w);
	var az = Math.atan2(2*x*y+2*z*w,1-2*y*y-2*z*z);
	return [ax,ay,az];
    },
    rotate: function(angle){
	this.drone.body.angularVelocity.set(0, angle, 0);
    }, 
    move: function(speed){
	var quat = this.drone.body.quaternion;
	var angle = this.quatToVec3(quat.x, quat.y, quat.z, quat.w);
	var t_angle = angle[1] - Math.PI/2;	    	    
	this.drone.body.velocity.set(speed[0] * Math.sin(t_angle) + -speed[2] * Math.cos(t_angle),speed[1],-speed[2] * Math.sin(t_angle) + speed[0] * Math.cos(t_angle));
    }
});

//main loop

function sleep(ms){
    return (cb) => {
	setTimeout(cb, ms);
    };
}

/*
DroneSim.drone.addEventListener('collide', (e) => {
    landed = true;
});
*/
