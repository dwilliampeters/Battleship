var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.getElementById( 'battlespace' );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;
	scene.add( camera );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 );
	scene.add( light );
	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	container.appendChild( renderer.domElement );
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );
	
	$('#coords span').html(mouseX +', '+ mouseY);

}

// load the players
battleship();
alienship();


// battleship:
function battleship() {

	// battleship: create
	battleship = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
	
	// battleship: position
	battleship.position.x = 0;
	battleship.position.y = 0;
	battleship.position.z = 0;
	
	// battleship: add
	scene.add( battleship );
	
	// battleship: rotate
	battleship.rotation.x += 0;
	battleship.rotation.y += -0;
	battleship.rotation.z += 0.5;
	
	// move the battleship on click
	
	// get coords of click
	$(container).click(function(e) {
	  
		// move battleship on click
		$(container).click(function() {
		
			battleship.position.x = mouseX;
			battleship.position.y = mouseY;
			
			render();
			
		});

	});

}


// alienship:
function alienship() {

	// alienship: create
	alienship = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
	
	// alienship: position
	alienship.position.x = 50;
	alienship.position.y = 50;
	alienship.position.z = 0;
	
	// alienship: add
	scene.add( alienship );
	
	// alienship: rotate
	alienship.rotation.x += 0;
	alienship.rotation.y += -0;
	alienship.rotation.z += 0.5;
	
	// move the alien ship on auto
  
	var randomAIX = 90;
	var aiX = randomAIX;
	var randomAIY = 90;
	var aiY = randomAIY;
	
	alienship.position.x = aiX;
	alienship.position.y = aiY;

}

// alienship: move x axis
function updateAIX() {

	randomAIX=Math.floor(Math.random()*450)	;
	var aiX = randomAIX;
		alienship.position.x = aiX;
		
		render();
		
}
t=setInterval("updateAIX();",500);

// alienship: move y axis
function updateAIY() {

	randomAIY=Math.floor(Math.random()*250)	;
	var aiY = randomAIY;
		alienship.position.y = aiY;
		
		render();
}
t=setInterval("updateAIY();",500);


render();

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}