// Import the cocos2d module
var cocos = require('cocos2d'),
// Import the geometry module
    geom = require('geometry'),
    Player = require('Player'),
    Socket = require('Socket'),
    evt = require('event'),
    Ball = require('Ball'),
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

        var currentPlayer = "player1" //socket.getPlayerId();

        this.set('currentPlayer', currentPlayer)
        this.createPlayer({'position':[160,280], 'velocity':[0,0], 'id': currentPlayer})

        this.set('size', s);

        // // Add Ball
        var ball = Ball.create();
        ball.set('position', new geom.Point((s.width * 0.5), (s.height * 0.5)));
        ball.set('velocity', new geom.Point(35, 35));
        this.addChild({child: ball});
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

            if(this.players[key]===undefined){
                this.createPlayer(player)
            }else{

                var obj = this.players[key]

                var player = this.players[obj['id']]
                var playerPos = player.get('position');

                playerPos.x = obj.position[0];
                playerPos.y = obj.position[1];
                player.set('position', playerPos);

                this.setPlayerVelocity(obj['id'], [obj.velocity[0], obj.velocity[1]])
            }


            this.setPlayerVelocity(obj['id'], [obj.velocity[0], obj.velocity[1]])
        }

        var obj = state.ball
        var ballPos = this.ball.get('position');
        ballPos.x = obj.position[0];
        ballPos.y = obj.position[1];

        ball.set('velocity', new geom.Point(60, 120));
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

        // kicking by space
        if(evt.keyCode == 32){
            this.players[currentPlayer].isKicking = false
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

        // sync state
        socket.send(gameState);

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
    var players = [];
    for (var p in footie.players) {
        players.push[footie.players[p].getPosition()];
    }
    state = {
        players: players,
        ball: this.ball.getPosition()
    }
    return state;
}

var sockSync = setInterval(function () {
    // sync state
    socket.send(gameState());
}, 1000);

socket.onGameUpdate(function (gs) {
    // todo
    gameState = gs;
    footie.updateState(gameState());
});


// Run the scene
director.runWithScene(scene);
