// Import the cocos2d module
var cocos = require('cocos2d'),
// Import the geometry module
    geom = require('geometry'),
    Player = require('Player'),
    Socket = require('Socket'),
    evt = require('event'),
    Ball = require('Ball'),
    Net = require('Net'),
    speed = 100;

var socket = new Socket();


// Create a new layer
var Footie = cocos.nodes.Layer.extend({

    ball: null,

    players: {},

    init: function() {
        // You must always call the super class version of init
        Footie.superclass.init.call(this);

        this.set('isMouseEnabled', true);
        this.set('isKeyboardEnabled', true);

        // Get size of canvas
        var s = cocos.Director.get('sharedDirector').get('winSize');

        var currentPlayer = socket.getPlayerId();

        console.log(currentPlayer)

        this.set('currentPlayer', currentPlayer)
        this.createPlayer({'position':[160,280], 'velocity':[0,0], 'id': currentPlayer})

        this.set('size', s);

        // // Add Ball
        var ball = Ball.create();
        ball.set('position', new geom.Point((s.width * 0.5), (s.height * 0.5)));
        ball.set('velocity', new geom.Point(35, 35));
        var net1 = Net.create();
        net1.set('position', new geom.Point(0, (s.height * 0.5 - 8)));
        var net2 = Net.create();
        net2.set('position', new geom.Point(s.width , (s.height * 0.5 - 8)));
        this.addChild({child: ball});
        this.addChild({child: net1});
        this.addChild({child: net2});
        this.set('ball', ball);
    },

    createPlayer: function(obj){
        var player = Player.create()
        player.set('position', new geom.Point(obj.position[0], obj.position[1]))
        player.set('velocity', new geom.Point(obj.velocity[0], obj.velocity[1]))
        this.addChild({child: player})
        this.players[obj['id']] = player
    },

    /**
     * expects smth like: { 'players': [{'id':'someid', position:[0,0], velocity: [0,0]}, {...}], 'ball': {position:[0,0], velocity:[0,0]} }
     */
    updateState: function(state) {

        // for every player set his position and velocity
        // set ball position and velocity

        for (var key in state['players']){

            //console.log(this.players[key], this.players)

            if(this.players[key] === undefined){
                //console.log('create-player', state['players'][key])
                state['players'][key]['id'] = key
                this.createPlayer(state['players'][key])
            }else{

                if( this.currentPlayer != key ){

                    var obj = state['players'][key]
                    var player = this.players[key]

                    var playerPos = player.get('position');

                    playerPos.x = obj.position[0];
                    playerPos.y = obj.position[1];
                    player.set('position', playerPos);

                    var playerVel = player.get('velocity');

                    playerVel.x = obj.velocity[0];
                    playerVel.y = obj.velocity[1];
                    player.set('velocity', playerVel);

                }

            }

        }

        var obj = state.ball

        if( obj !== undefined ){
            var ballPos = this.ball.get('position');

            ballPos.x = obj.position[0];
            ballPos.y = obj.position[1];

            this.ball.set('velocity', new geom.Point(obj.velocity[0], obj.velocity[1]));
        }
    },

    setPlayerVelocity: function(player_id, vector ){

        var player = this.players[player_id]
        var playerPos = player.get('position');
        var playerVel = player.get('velocity');

        player.setVelocity(new geom.Point(vector[0]+playerVel.x, vector[1]+playerVel.y));
    },

    keyDown: function(evt) {

        var currentPlayer = this.get('currentPlayer')

        switch(evt.keyIdentifier){
            case 'Right':
                this.setPlayerVelocity(currentPlayer, [speed, 0])
                break;
            case 'Left':
                this.setPlayerVelocity(currentPlayer, [-1*speed, 0])
                break;
            case 'Up':
                this.setPlayerVelocity(currentPlayer, [0, -1*speed])
                break;
            case 'Down':
                this.setPlayerVelocity(currentPlayer, [0, 1*speed])
                break;

            default: break;
        }

        socket.send(gameState());

        // kicking by space
        if(evt.keyCode == 32){
            this.players[currentPlayer].isKicking = true;
        }
    },

    keyUp: function(evt) {

        var currentPlayer = this.get('currentPlayer')

        switch(evt.keyIdentifier){
            case 'Right':
                this.setPlayerVelocity(currentPlayer, [-1*speed, 0])
                break;
            case 'Left':
                this.setPlayerVelocity(currentPlayer, [speed, 0])
                break;
            case 'Up':
                this.setPlayerVelocity(currentPlayer, [0, 1*speed])
                break;
            case 'Down':
                this.setPlayerVelocity(currentPlayer, [0, -1*speed])
                break;

            default: break;
        }

        if(evt.keyCode == 32){
            this.players[currentPlayer].isKicking = false;
        }
        // sync state
        socket.send(gameState());

        var currentPlayer = this.get('currentPlayer')
        this.setPlayerVelocity(currentPlayer, [0, 0])
    },

    restart: function() {
        var director = cocos.Director.get('sharedDirector');

        // Create a scene
        var scene = cocos.nodes.Scene.create();

        // Add our layer to the scene
        scene.addChild({child: Footie.create()});

        director.replaceScene(scene);
    },

    syncGameState: function () {
        socket.send(gameState());
    }
});

// Initialise everything

// Get director
var director = cocos.Director.get('sharedDirector');

// Attach director to our <div> element
director.attachInView(document.getElementById('footie-demo'));

// Create a scene
var scene = cocos.nodes.Scene.create();

// Add our layer to the scene
footie = Footie.create();
scene.addChild({child: footie});

var gameState = function () {
    var players = {};

    state = {
        id: footie.currentPlayer,
        player: footie.players[footie.currentPlayer].getPosition(),
        ball: footie.ball.getPosition()
    }
    return state;
}

var sockSync = setInterval(function () {
    // sync state
    var gs = gameState()
    socket.send(gs);
}, 50);

socket.onGameUpdate(function (gs) {
    // todo
    // console.log('recieved', gs)
    footie.updateState(gs)
});


// Run the scene
director.runWithScene(scene);
