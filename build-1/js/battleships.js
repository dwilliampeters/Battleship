if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

/*var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;*/

var MARGIN = 100;

			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

var windowHalfX = SCREEN_WIDTH / 2;
var windowHalfY = SCREEN_HEIGHT / 2;
			
var player, player2;

var FLOOR = -250;

var oldTime = new Date().getTime();

var controlsPlayer = {

	moveForward: false,
	moveBackward: false,
	moveLeft: false,
	moveRight: false,
	EnginePowerUp: false,
	EnginePowerDown: false

};

init();
animate();


function init() {

	container = document.getElementById( 'battlespace' );

	scene = new THREE.Scene();
	
	// SCENE CAMERA
	
	//camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
	camera = new THREE.Camera( 18, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
	camera.position.set( 3000, 17000, 3000 );
	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.rotation.z = 0;
	
	// SCENE
	
	scene.add( camera );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 );
	scene.add( light );
	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	container.appendChild( renderer.domElement );
	
	//

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	//
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	//
	
	//$(document).keydown(function() {
	function onKeyDown ( event ) {

		//switch( event.keyCode ) {
		switch( event.keyCode ) {
			
			case 87: /*w*/ 	controlsPlayer.moveForward = true; break;
			
			case 83: /*s*/	controlsPlayer.moveBackward = true; break;
			
			case 65: /*a*/	controlsPlayer.moveLeft = true; break;
			
			case 68: /*d*/	controlsPlayer.moveRight = true; break;
			
			case 69: /*e*/	controlsPlayer.EnginePowerUp = true; break;
			
			case 81: /*1*/	controlsPlayer.EnginePowerDown = true; break;
			
			//case 38: /*up*/	controlsGallardo.moveForward = true; break;
			//case 87: /*W*/ 	controlsVeyron.moveForward = true; break;

			//case 40: /*down*/controlsGallardo.moveBackward = true; break;
			//case 83: /*S*/ 	 controlsVeyron.moveBackward = true; break;

			//case 37: /*left*/controlsGallardo.moveLeft = true; break;
			//case 65: /*A*/   controlsVeyron.moveLeft = true; break;

			//case 39: /*right*/controlsGallardo.moveRight = true; break;
			//case 68: /*D*/    controlsVeyron.moveRight = true; break;

			//case 49: /*1*/	setCurrentCar( "gallardo", "center" ); break;
			//case 50: /*2*/	setCurrentCar( "veyron", "center" ); break;
			//case 51: /*3*/	setCurrentCar( "gallardo", "front" ); break;
			//case 52: /*4*/	setCurrentCar( "veyron", "front" ); break;
			//case 53: /*5*/	setCurrentCar( "gallardo", "back" ); break;
			//case 54: /*6*/	setCurrentCar( "veyron", "back" ); break;

			//case 78: /*N*/   vdir *= -1; break;

			//case 66: /*B*/   blur = !blur; break;

		}
		
		/*if ((player.moveForward)) player.rotation.y += 5;
		if ((player.moveBackward)) player.rotation.y += -5;
		if ((player.moveLeft)) player.rotation.y += -0.01;
		if ((player.moveRight)) player.rotation.y += 0.01;*/
	
	//});
	}
	
	$(document).keyup(function() {

		switch( event.keyCode ) {
			
			case 87: /*w*/	controlsPlayer.moveForward = false; break;
			
			case 83: /*s*/	controlsPlayer.moveBackward = false; break;
			
			case 65: /*a*/	controlsPlayer.moveLeft = false; break;
			
			case 68: /*d*/	controlsPlayer.moveRight = false; break;
			
			case 69: /*e*/	controlsPlayer.EnginePowerUp = false; break;
			
			case 81: /*1*/	controlsPlayer.EnginePowerDown = false; break;
			
			//case 38: /*up*/	controlsGallardo.moveForward = true; break;
			//case 87: /*W*/ 	controlsVeyron.moveForward = true; break;

			//case 40: /*down*/controlsGallardo.moveBackward = true; break;
			//case 83: /*S*/ 	 controlsVeyron.moveBackward = true; break;

			//case 37: /*left*/controlsGallardo.moveLeft = true; break;
			//case 65: /*A*/   controlsVeyron.moveLeft = true; break;

			//case 39: /*right*/controlsGallardo.moveRight = true; break;
			//case 68: /*D*/    controlsVeyron.moveRight = true; break;

			//case 49: /*1*/	setCurrentCar( "gallardo", "center" ); break;
			//case 50: /*2*/	setCurrentCar( "veyron", "center" ); break;
			//case 51: /*3*/	setCurrentCar( "gallardo", "front" ); break;
			//case 52: /*4*/	setCurrentCar( "veyron", "front" ); break;
			//case 53: /*5*/	setCurrentCar( "gallardo", "back" ); break;
			//case 54: /*6*/	setCurrentCar( "veyron", "back" ); break;

			//case 78: /*N*/   vdir *= -1; break;

			//case 66: /*B*/   blur = !blur; break;

		}
	
	});
	
	if ((controlsPlayer.EnginePowerUp)) alert("Engine Power!");
	if ((controlsPlayer.EnginePowerDown)) alert("Engine Power Down!");
	
}



function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );
	
	mouseY = mouseY * -1
	
	$('#coords span').html(mouseX +', '+ mouseY);

}


// load the players
player();
player2();


// player:
function player( x, y, z ) {

	// player: create
	player = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
	
	// player: position
	player.position.x = 0;
	player.position.y = 0;
	player.position.z = 0;
	
	// player: add
	scene.add( player );
	
	// player: rotate
	player.rotation.x += 0;
	player.rotation.y += 0;
	player.rotation.z += 0.5;
	  
	// player: move
	$(container).click(function() {
	
		player.position.x = mouseX;
		player.position.y = mouseY;
		
		render();
		
	});

}


// player2:
function player2() {

	// player2: create
	player2 = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
	
	// player2: position
	player2.position.x = 50;
	player2.position.y = 50;
	player2.position.z = 0;
	
	// player2: add
	scene.add( player2 );
	
	// player2: rotate
	player2.rotation.x += 0;
	player2.rotation.y += 0;
	player2.rotation.z += 0.5;
	
	player.rotation.y += 0.01;
	
	// move the alien ship on auto
  
	var randomAIX = 300;
	var aiX = randomAIX;
	var randomAIY = 300;
	var aiY = randomAIY;
	
	player2.position.x = aiX;
	player2.position.y = aiY;

}
/*
// player2: move x axis
function updateAIX() {

	randomAIX=Math.floor(Math.random()*450)	;
	var aiX = randomAIX;
		player2.position.x = aiX;
		
		render();
		
}
t=setInterval("updateAIX();",500);

// player2: move y axis
function updateAIY() {

	randomAIY=Math.floor(Math.random()*250)	;
	var aiY = randomAIY;
		player2.position.y = aiY;
		
		render();
}
t=setInterval("updateAIY();",500);
*/


function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();
	
}

function render() {

	//player.rotation.y += 0.01;

	/*camera.position.x += ( mouseX - camera.position.x ) * 0.01;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.01;*/

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}