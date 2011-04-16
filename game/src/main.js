// Import the cocos2d module
var cocos = require('cocos2d'),
// Import the geometry module
    geom = require('geometry'),
    Player = require('Player'),
    Ball = require('Ball');

// Create a new layer
var Footie = cocos.nodes.Layer.extend({

    ball: null,

    players_list: [],

    init: function() {
        // You must always call the super class version of init
        Footie.superclass.init.call(this);


        this.set('isMouseEnabled', true);
        this.set('isKeyboardEnabled', true);

        // Get size of canvas
        var s = cocos.Director.get('sharedDirector').get('winSize');

        this.set('current_player', 'player0')

        this.createPlayers([
            {'x':160,'y':280, 'id':'player0'},
            {'x':140,'y':180, 'id':'player1'},
        ])


        // // Add Ball
        // var ball = Ball.create();
        // ball.set('position', new geom.Point(140, 210));
        // this.addChild({child: ball});
        // this.set('ball', ball);


        var that = this;
        setInterval(function() {
            // that.updateState({x:30, y:Math.floor(Math.random() * 50)});
        }, 1000);

    },

    createPlayers: function(players){
        
        for(var key in players){
            var obj = players[key]

            var player = Player.create()
            player.set('position', new geom.Point(obj['x'], obj['y']))
            this.addChild({child: player})
            this.set(obj['id'],player)

            if(this.players_list.indexOf(obj['id'])<0){
                this.players_list.push(obj['id'])    
            }

        }
            
    },

    /** 
     * expects smth like: { 'players': [{'id':'someid', position:[0,0], velocity: [0,0]}, {...}], 'ball': {position:[0,0], velocity:[0,0]} }
     */
    updateState: function(state) {

        // for every player set his position and velocity
        // set ball position and velocity

        for( var key in state['players']){
            var obj = players[key]
            var player = this.get(obj['id'])
            var playerPos = player.get('position');
            
            playerPos.x = obj.position[0];
            playerPos.y = obj.position[1];
            player.set('position', playerPos);            

            this.setPlayerVelocity(obj['id'], [obj.velocity[0], obj.velocity[1]])
        }

        var obj = state.ball
        var ballPos = this.ball.get('position');
        ballPos.x = obj.position[0];
        ballPos.y = obj.position[1];

        ball.set('velocity', new geom.Point(60, 120));

    },

    setPlayerVelocity: function(player_id, dt){
        var player = this.get(player_id)
        var playerPos = player.get('position');

        player.setVelocity(new geom.Point(dt[0], dt[1]));
    },

    keyDown: function(evt) {

        var currentPlayer = this.get('current_player')

        switch(evt.keyIdentifier){
            case 'Right':
                this.setPlayerVelocity(currentPlayer, [5, 0])
                break;
            case 'Left': 
                this.setPlayerVelocity(currentPlayer, [-5, 0])
                break;
            case 'Up': 
                this.setPlayerVelocity(currentPlayer, [0, -5])
                break;
            case 'Down': 
                this.setPlayerVelocity(currentPlayer, [0, 5])
                break;

            default: break;
        }

        if(evt.keyCode == 32){
            this.get(currentPlayer).isKicking = false
        }
    },

    keyUp: function(evt) {

        var currentPlayer = this.get('current_player')
        this.setPlayerVelocity(currentPlayer, [0, 0])
        console.log('player stop')

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
scene.addChild({child: Footie.create()});

// Run the scene
director.runWithScene(scene);
