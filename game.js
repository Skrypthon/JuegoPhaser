var config = {
    type: Phaser.AUTO,
    width: window.innerWidth, //Para que se adapte al tamaño completo de la pantalla  
    height: window.innerHeight,
    autoResize: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 1000 }
        }
    },
    scene: [{
        preload: preload,
        create: create,
        update: update
    }]
};

var game = new Phaser.Game(config);

/*variable para controlar el sprite del Personaje1*/
var jugador;
/*Variables para agregar movimiento al jugador*/
var arriba,abajo,izquierda,derecha;
const velocidad = 350;
const alturaSalto = -530;

// Variable para controlar la configuración del mapa
var mapa;

function preload() {
    /*importamos el sprite del primer personaje */
    this.load.spritesheet('personaje1', 'assets/sprites/personaje1.png', { frameWidth: 57, frameHeight: 62 });
    
    // Importamos el JSON para generar nuestro mapa
    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json')
    this.load.image('tiles','assets/mapa/tileSets.png')
}
/*Inicializamos el sprite del personaje1*/
function create(){
    // Al escuchar el evento jugador-saltando 
    socket.on('jugador-saltando', () => {
        console.log("Algun jugador esta saltando")
    })

    game.config.backgroundColor.setTo(100,210,222) //RGB

    // Creamos el objeto mapa con sus tilesets
    mapa = this.make.tilemap({ key: 'mapa' })
    var tilesets = mapa.addTilesetImage('tileSets', 'tiles')  //Los tileSets es el nombre del objeto de donde se sacaron las paredes 
  
    // Agregando las nubes
    var nubes = mapa.createDynamicLayer('nubes', tilesets, 0, 0)
    
    // Agregando las capas del mapa, en este caso son las paredes
    var solidos = mapa.createDynamicLayer('solidos', tilesets, 0, 0)
    solidos.setCollisionByProperty({ solido : true }) //Agreando la propiedad de solido a los solidos

    /*con physics.add agregamos fisicas al sprite*/
    jugador = this.physics.add.sprite(100,100,'personaje1',0);//sprite(posicion en x,y,nombreDelSprite,numeroSprite)
    // jugador.setCollideWorldBounds(true);//Hacer que choque con los limites del mundo
    jugador.setSize(30,0) // Para cambiar el hitbox del jugador


    //creamos la animacion de caminar para el spirte personaje1
    this.anims.create({
        key: 'caminar',
        frames: this.anims.generateFrameNumbers('personaje1',{start: 1, end:8}),
        frameRate:10
    });

    this.physics.add.collider(jugador,solidos) //Ahora el jugador colisiona con los objetos con propiedad solidos
    
    // Estas lineas sirven para que la camara se centre en el jugador
    this.cameras.main.setBounds(0,0, mapa.widthInPixels, mapa.healthInPixels)
    this.cameras.main.startFollow(jugador)

    /*asignamos las entradas del teclado con las que se movera el jugador*/
    arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
}
function update(){       
    //SIEMPRE inicializar la velocidad del jugador en 0
    jugador.body.setVelocityX(0);

    //Habilitamos las teclas del teclado con las que el jugador se movera
    if(izquierda.isDown){
        jugador.body.setVelocityX(-velocidad);//se le resta en x para que vaya a la izq
        jugador.flipX = true;//para que se volte el sprite del jugador cuando camina en direccion contraria
    }

    if(derecha.isDown){
        jugador.body.setVelocityX(velocidad); //se le suma en x para que vaya a la derecha
        jugador.flipX = false;//para que se volte el sprite del jugador cuando camina en direccion contraria
    }

    if(arriba.isDown && jugador.body.onFloor()){//onFloor() hacer que solo se pueda saltar cuando se esta tocando el suelo
        jugador.body.setVelocityY(alturaSalto);
        socket.emit('saltar') // Para comunicarnos con los otros jugadores clientes del socket
    }

    //Para activar la animacion de caminar
    if((izquierda.isDown || derecha.isDown) && jugador.body.onFloor()){
        jugador.anims.play('caminar',true);//el jugador esta caminando
    }else if(!jugador.body.onFloor()){//si el jugador NO esta en el suelo
        jugador.setFrame(9);//el jugador esta cayendo
    }else{
        jugador.setFrame(0); //el jugador esta quieto
    }
}