//La escenas deben ir arriba de la variable de configurcion

/*variable para controlar el sprite del Personaje1*/
var jugador1;
var jugador2;

//
var secondPlayer = false; //Bandera si es que existe un segundo jugador

/*Variables para agregar movimiento al jugador*/
var arriba, abajo, izquierda, derecha,letraA;
var secondX; //Posicion en x del segundo jugador
var secondY; //Posicion en y del segundo jugador
const velocidad = 350;
const alturaSalto = -530;

// Variable para controlar la configuración del mapa
var mapa;

var score = 0;
var diamonds;
var scoreText;



//Las escenas deben tener el mismo formato (Video 7)
var EscenaMenu = new Phaser.Class({
  //Esta es la escena del menu, solo muestra un mensaje interactivo.

  Extends: Phaser.Scene,

  initialize: function EscenaMenu() {
    Phaser.Scene.call(this, { key: "EscenaMenu" });
  },

  create() {
    var texto1 = this.add
      .text(game.config.width / 2, game.config.height / 4, "Menu Principal", {
        fontSize: "40px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();
    var texto = this.add
      .text(
        game.config.width / 2,
        game.config.height / 2,
        "Da click aquí para iniciar",
        {
          fontSize: "40px",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setInteractive();
    this.input.on("pointerdown", () => {
      this.scene.start("EscenaJuego");
    });
  },
});

function collectDiamond(juador1, diamonds) {
  // Removes the diamond from the screen
  console.log('Hay colisicones')
  if(diamonds.active){
    diamondsgroup.killAndHide(diamonds)
    
    diamonds.setActive(false).setVisible(false);
  }
  //  And update the score
  /*score += 10;
  scoreText.text = "Score: " + score;*/
}

var EscenaJuego = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function EscenaJuego() {
    Phaser.Scene.call(this, { key: "EscenaJuego" });
  },

  preload() {
    /*importamos el sprite del primer personaje */
    //this.load.spritesheet("personaje1", "assets/sprites/personaje1.png", {frameWidth: 57,frameHeight: 62,});
    this.load.spritesheet(
      "personaje1",
      "assets/sprites/1 Woodcutter/Woodcutter_run.png",
      { frameWidth: 47, frameHeight: 42 }
    );

    //sprite de golpear
    this.load.spritesheet(
      "personaje1Golpear",
      "assets/sprites/1 Woodcutter/Woodcutter_attack1.png",
      { frameWidth: 47, frameHeight: 42 }
    );

    //bullets
    this.load.image(
      "lancerBullet",
      "/assets/sprites/Bullets/lancerBullets2.png"
    );

    //aims
    this.load.image("lancerAim", "/assets/sprites/Bullets/lancerAim.png");

    this.load.tilemapTiledJSON("mapa", "assets/mapa/mapa.json");
    this.load.image("tiles", "assets/mapa/tileSets.png");

    this.load.image("diamond", "assets/sprites/diamond.png");
  },
  /*Inicializamos el sprite del personaje1*/
  create() {
    game.config.backgroundColor.setTo(100, 210, 222); //RGB

    

    // Creamos el objeto mapa con sus tilesets
    mapa = this.make.tilemap({ key: "mapa" });
    var tilesets = mapa.addTilesetImage("tileSets", "tiles"); //Los tileSets es el nombre del objeto de donde se sacaron las paredes

    // Agregando las nubes
    var nubes = mapa.createDynamicLayer("nubes", tilesets, 0, 0);

    // Agregando las capas del mapa, en este caso son las paredes
    var solidos = mapa.createDynamicLayer("solidos", tilesets, 0, 0);

    //Agreando la propiedad de solido a los solidos
    solidos.setCollisionByProperty({ solido: true }); 

    //con physics.add agregamos fisicas al sprite
    jugador1 = this.physics.add.sprite(100, 100, "personaje1", 0);

    // Para cambiar el hitbox del jugador
    jugador1.setSize(20, 0); 


    diamondsgroup = this.physics.add.group({
      defaultKey:'diamond',
      maxSize: 10 
    })

    for(var i = 0; i < 6; i++) {
      diamonds = diamondsgroup.get();
     
      if (diamonds){
        diamonds.setActive(true).setVisible(true)
        diamonds.x = 130*i
        diamonds.y = 10*i
        this.physics.add.collider(diamonds, solidos);     
      } 
    }
    this.physics.add.overlap(jugador1, diamondsgroup, collectDiamond, null, this);

    /*con physics.add agregamos fisicas al sprite*/
    jugador2 = this.physics.add.sprite(100, 100, "personaje1", 0); //sprite(posicion en x,y,nombreDelSprite,numeroSprite)
    jugador2.setVisible(true);
    this.physics.add.collider(jugador2, solidos);
    jugador2.setSize(30, 0); // Para cambiar el hitbox del jugador


   

    /*
    //Generamos muchos diamantes
    for (var i = 0; i < 6; i++) {
      diamonds = this.physics.add.sprite(130*i, 10*i, "diamond", 0);
      this.physics.add.collider(diamonds, solidos);
      //diamonds.setCollideWorldBounds(true);
      
      diamonds.body.gravity.y = 1000;
      diamonds.body.bounce.y = 0.3 + Math.random() * 0.2;
    } */
    
    //Barra de puntaje
    //scoreText = this.add.text(16, 16, "", { fontSize: "32px", fill: "#000" });

    //creamos la animacion de caminar para el spirte personaje1
    this.anims.create({
      key: "caminar",
      frames: this.anims.generateFrameNumbers("personaje1", {
        start: 1,
        end: 8,
      }),
      frameRate: 10,
    });

    //animación golpear
    this.anims.create({
      key: "golpear",
      frames: this.anims.generateFrameNumbers("personaje1Golpear", {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
    });

    

    //Ahora el jugador colisiona con los objetos con propiedad solidos.
    this.physics.add.collider(jugador1, solidos); 

    // Estas lineas sirven para que la camara se centre en el jugador
    this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.healthInPixels);
    this.cameras.main.startFollow(jugador1);

    /*asignamos las entradas del teclado con las que se movera el jugador*/
    arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    letraA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    
  },

  update() {

    //SIEMPRE inicializar la velocidad del jugador en 0
    jugador1.body.setVelocityX(0);

    var posP1 = {
      x: jugador1.x,
      y: jugador1.y,
    };
    socket.emit("posicion", posP1);

    jugador2.x = secondX;
    jugador2.y = secondY;
    //Habilitamos las teclas del teclado con las que el jugador se movera
    if (izquierda.isDown) {

       //se le resta en x para que vaya a la izq
      jugador1.body.setVelocityX(-velocidad);

      //para que se volte el sprite del jugador cuando camina en direccion contraria
      jugador1.flipX = true; 
    }

    if (derecha.isDown) {
      //se le suma en x para que vaya a la derecha
      jugador1.body.setVelocityX(velocidad); 
      //para que se volte el sprite del jugador cuando camina en direccion contraria
      jugador1.flipX = false; 
    }

    if (arriba.isDown && jugador1.body.onFloor()) {
      //onFloor() hacer que solo se pueda saltar cuando se esta tocando el suelo
      jugador1.body.setVelocityY(alturaSalto);
      //socket.emit('saltar') // Para comunicarnos con los otros jugadores clientes del socket
    }
    if (secondPlayer) {
      //Aqui es donde se actualiza la posicion del jugador2
      jugador2.setVisible(true);
      secondPlayer.x = secondX;
      secondPlayer.y = secondY;
    }
    //Para activar la animacion de caminar
    if ((izquierda.isDown || derecha.isDown) && jugador1.body.onFloor()) {
      jugador1.anims.play("caminar", true); //el jugador esta caminando
    } else if (!jugador1.body.onFloor()) {
      //si el jugador NO esta en el suelo
      jugador1.setFrame(9); //el jugador esta cayendo
    } else {
      jugador1.setFrame(0); //el jugador esta quieto
    }

    if(letraA.isDown){
      jugador1.anims.play("golpear", true); //el jugador esta golpeando
    }

    
  },
});

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth, //Para que se adapte al tamaño completo de la pantalla
  height: window.innerHeight,
  autoResize: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 1000 },
    },
  },
  scene: [EscenaMenu, EscenaJuego],
};

var game = new Phaser.Game(config);

socket.on("readyPlayer", (data) => {
  //Conexion con el numero de jugadores que tiene
  console.log("Jugadores = " + data);
  if (data == 2) {
    secondPlayer = true;
  }
});
socket.on("jugador-saltando", () => {
  console.log("Algun jugador esta saltando");
}) /
  socket.on("posPlayer2", (data) => {
    //Conexion socket con la posicion del segundo jugador
    console.log("El player dos envio estos datos:  " + data.x + data.y);
    secondX = data.x;
    secondY = data.y;
  });
