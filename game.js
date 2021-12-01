var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    autoResize: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
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
function preload() {
    /*importamos el sprite del primer personaje */
    this.load.spritesheet('personaje1', 'assets/sprites/personaje1.png', { frameWidth: 57, frameHeight: 62, });
}
/*Inicializamos el sprite del personaje1*/
function create(){
    /*con physics.add agregamos fisicas al sprite*/
    jugador = this.physics.add.sprite(100,100,'personaje1',0);//sprite(posicion en x,y,nombreDelSprite,numeroSprite)
    jugador.setCollideWorldBounds(true);//Hacer que choque con los limites del mundo

    //creamos la animacion de caminar para el spirte personaje1
    this.anims.create({
        key: 'caminar',
        frames: this.anims.generateFrameNumbers('personaje1',{start: 1, end:8}),
        frameRate:10
    });

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