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
            console.log(obj)

            var player = Player.create()
            player.set('position', new geom.Point(obj['x'], obj['y']))
            this.addChild({child: player})
            this.set(obj['id'],player)

            if(this.players_list.indexOf(obj['id'])<0){
                this.players_list.push(obj['id'])    
            }

        }
            
    },

    updateState: function(state) {
        var player = this.get('player');
        var playerPos = player.get('position');
        playerPos.x = state.x;
        playerPos.y = state.y;
        player.set('position', playerPos);
    },

    mouseMoved: function(evt) {
        var player = this.get(this.get('current_player'));
        var playerPos = player.get('position');
        playerPos.x = evt.locationInCanvas.x;
        player.set('position', playerPos);

    },

    keyDown: function(evt) {
        console.log(evt)
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
