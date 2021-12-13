//La escenas deben ir arriba de la variable de configurcion

/*variable para controlar el sprite del Personaje1*/
var jugador1
var jugador2

//
var secondPlayer = false //Bandera si es que existe un segundo jugador

/*Variables para agregar movimiento al jugador*/
var arriba, abajo, izquierda, derecha;
var secondX; //Posicion en x del segundo jugador
var secondY; //Posicion en y del segundo jugador
const velocidad = 350;
const alturaSalto = -530;

// Variable para controlar la configuración del mapa
var mapa;

//Las escenas deben tener el mismo formato (Video 7)
var EscenaMenu = new Phaser.Class({ //Esta es la escena del menu, solo muestra un mensaje interactivo.

    Extends: Phaser.Scene,      

    initialize:                 

        function EscenaMenu() {
            Phaser.Scene.call(this, { key: 'EscenaMenu' });
        },

    create() {
        var texto1 = this.add.text(game.config.width / 2, game.config.height / 4, 'Menu Principal', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        var texto = this.add.text(game.config.width / 2, game.config.height / 2, 'Da click aquí para iniciar', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        this.input.on('pointerdown',()=>{
            this.scene.start('EscenaJuego')           
        });
    }

});

var EscenaJuego = new Phaser.Class({
    
    Extends: Phaser.Scene,

    initialize:

        function EscenaJuego() {
            Phaser.Scene.call(this, { key: 'EscenaJuego' });
        },
        
        preload() {
            
            
            /*importamos el sprite del primer personaje */
            this.load.spritesheet('personaje1', 'assets/sprites/personaje1.png', { frameWidth: 57, frameHeight: 62 });
            /*if(secondPlayer!=false){
                this.load.spritesheet('personaje1', 'assets/sprites/personaje1.png', { frameWidth: 57, frameHeight: 62 });
            }*/
            // Importamos el JSON para generar nuestro mapa
            this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json')
            this.load.image('tiles', 'assets/mapa/tileSets.png')
        },
        /*Inicializamos el sprite del personaje1*/
        create() {
         
           
            
            game.config.backgroundColor.setTo(100, 210, 222) //RGB
        
            // Creamos el objeto mapa con sus tilesets
            mapa = this.make.tilemap({ key: 'mapa' })
            var tilesets = mapa.addTilesetImage('tileSets', 'tiles')  //Los tileSets es el nombre del objeto de donde se sacaron las paredes 
        
            // Agregando las nubes
            var nubes = mapa.createDynamicLayer('nubes', tilesets, 0, 0)
        
            // Agregando las capas del mapa, en este caso son las paredes
            var solidos = mapa.createDynamicLayer('solidos', tilesets, 0, 0)
            solidos.setCollisionByProperty({ solido: true }) //Agreando la propiedad de solido a los solidos
        
            /*con physics.add agregamos fisicas al sprite*/
            jugador1 = this.physics.add.sprite(100, 100, 'personaje1', 0);//sprite(posicion en x,y,nombreDelSprite,numeroSprite)
            // jugador.setCollideWorldBounds(true);//Hacer que choque con los limites del mundo
            jugador1.setSize(30, 0) // Para cambiar el hitbox del jugador
            
            
             /*con physics.add agregamos fisicas al sprite*/
            jugador2 = this.physics.add.sprite(100, 100, 'personaje1', 0);//sprite(posicion en x,y,nombreDelSprite,numeroSprite)
            //jugador2.setCollideWorldBounds(true);//Hacer que choque con los limites del mundo
            jugador2.setVisible(false);
            this.physics.add.collider(jugador2, solidos)
            jugador2.setSize(30, 0) // Para cambiar el hitbox del jugador
        
            //creamos la animacion de caminar para el spirte personaje1
            this.anims.create({
                key: 'caminar',
                frames: this.anims.generateFrameNumbers('personaje1', { start: 1, end: 8 }),
                frameRate: 10
            });
        
            this.physics.add.collider(jugador1, solidos) //Ahora el jugador colisiona con los objetos con propiedad solidos
        
            // Estas lineas sirven para que la camara se centre en el jugador
            this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.healthInPixels)
            this.cameras.main.startFollow(jugador1)
        
            /*asignamos las entradas del teclado con las que se movera el jugador*/
            arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        },
        update() {
           
            //SIEMPRE inicializar la velocidad del jugador en 0
            jugador1.body.setVelocityX(0);
            
                var posP1 = {
                    x: jugador1.x,
                    y: jugador1.y
                }
                socket.emit('posicion',posP1)

            jugador2.x = secondX;
            jugador2.y = secondY;
            //Habilitamos las teclas del teclado con las que el jugador se movera
            if (izquierda.isDown) {
                jugador1.body.setVelocityX(-velocidad);//se le resta en x para que vaya a la izq
                jugador1.flipX = true;//para que se volte el sprite del jugador cuando camina en direccion contraria
            }
        
            if (derecha.isDown) {
                jugador1.body.setVelocityX(velocidad); //se le suma en x para que vaya a la derecha
                jugador1.flipX = false;//para que se volte el sprite del jugador cuando camina en direccion contraria
            }
        
            if (arriba.isDown && jugador1.body.onFloor()) {//onFloor() hacer que solo se pueda saltar cuando se esta tocando el suelo
                jugador1.body.setVelocityY(alturaSalto);
                //socket.emit('saltar') // Para comunicarnos con los otros jugadores clientes del socket
            }
            if(secondPlayer){               //Aqui es donde se actualiza la posicion del jugador2
                jugador2.setVisible(true);
                secondPlayer.x = secondX;
                secondPlayer.y = secondY; 
            }
            //Para activar la animacion de caminar
            if ((izquierda.isDown || derecha.isDown) && jugador1.body.onFloor()) {
                jugador1.anims.play('caminar', true);//el jugador esta caminando
            } else if (!jugador1.body.onFloor()) {//si el jugador NO esta en el suelo
                jugador1.setFrame(9);//el jugador esta cayendo
            } else {
                jugador1.setFrame(0); //el jugador esta quieto
            } 
        }

});


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
    scene: [EscenaMenu,EscenaJuego]
};

var game = new Phaser.Game(config);

socket.on('readyPlayer', (data)=> { //Conexion con el numero de jugadores que tiene
    console.log("Jugadores = "+data)
    if(data==2){
      secondPlayer = true;  
    }
    
}) 
socket.on('jugador-saltando', () => { 
    console.log("Algun jugador esta saltando")
}) 
/socket.on('posPlayer2',(data)=>{ //Conexion socket con la posicion del segundo jugador
    console.log("El player dos envio estos datos:  " + data.x + data.y  );
    secondX=data.x;
    secondY=data.y;
})
