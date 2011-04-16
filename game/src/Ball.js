var cocos = require('cocos2d'),
    geom = require('geometry'),
    util = require('util');

function normalize(vec) {
    var x = vec.x,
        y = vec.y;

    var len = Math.sqrt( x*x + y*y);
    return new geom.Point(x/len || 0, y/len || 0);
}


var Ball = cocos.nodes.Node.extend({
    velocity: null,

    init: function() {
        Ball.superclass.init.call(this);

        var sprite = cocos.nodes.Sprite.create({
                         file: '/resources/sprites.png',
                         rect: new geom.Rect(80, 0, 16, 16)
                     });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        this.addChild({child: sprite});
        this.set('contentSize', sprite.get('contentSize'));

        this.set('velocity', new geom.Point(60, 120));
        this.scheduleUpdate();

    },

    getPosition: function () {
        var pos = this.get("position");
        var v = this.get("velocity");
        return {
            position: [pos.x, pos.y],
            velocity: [v.x, v.y]
        };
    },

    update: function(dt) {
        var pos = util.copy(this.get('position')),
            vel = util.copy(this.get('velocity'));

        var f = 0.45;
        vel.x -=  ((vel.x<0)? -f: f) * Math.abs(vel.x) * dt;
        if (Math.abs(vel.x)<10) { vel.x = 0; }
        else {
            pos.x += dt * vel.x;
        }

        vel.y -=  ((vel.y<0)? -f:f) * Math.abs(vel.y) * dt;
        if (Math.abs(vel.y)<10) { vel.y = 0; }
        else {
            pos.y += dt * vel.y;
        }

        this.set('position', pos);
        this.set('velocity', vel);
        this.testPlayers();
        this.testEdgeCollision();
    },


    testPlayers: function() {
        var ballBox = this.get('boundingBox');
        var vel = util.copy(this.get('velocity'));
        var players = this.get('parent').get('players');
        var i, playerBox, player, playerVel;
        var collisions = 0;
        var ax=0, ay=0;
        for(i in players) {
           player = players[i];
           playerBox = player.get('boundingBox');
           if (geom.rectOverlapsRect(ballBox, playerBox)) {
               playerVel = player.get('velocity');
               collisions += 1;
               var f = (player.isKicking)? 350 : 150;
               //vel.x += f;
               //vel.y += f;
               var force = normalize(playerVel);
               //ax += force.x * f;
               //ay += force.y * f;
               vel.x = force.x * f;
               vel.y = force.y * f;
              break;
           }
        }
        if (collisions) {
        this.set('velocity', vel);
        this.get('parent').syncGameState();
        }
    },

    testEdgeCollision: function() {
        var vel = util.copy(this.get('velocity')),
            ballBox = this.get('boundingBox'),
            // Get size of canvas
            winSize = cocos.Director.get('sharedDirector').get('winSize');

        // Moving left and hit left edge
        if (vel.x < 0 && geom.rectGetMinX(ballBox) < 0) {
            // Flip Y velocity
            vel.x *= -1;
        }

        // Moving right and hit right edge
        if (vel.x > 0 && geom.rectGetMaxX(ballBox) > winSize.width) {
            // Flip X velocity
            vel.x *= -1;
        }

        // Moving up and hit top edge
        if (vel.y < 0 && geom.rectGetMinY(ballBox) < 0) {
            // Flip X velocity
            vel.y *= -1;
        }

        // Moving down and hit bottom edge - DEATH
        if (vel.y > 0 && geom.rectGetMaxY(ballBox) > winSize.height) {
            vel.y *= -1;
        }
        this.set('velocity', vel);
    },

    testBlockCollision: function(axis, dist) {
        // var vel = util.copy(this.get('velocity')),
        //     box = this.get('boundingBox'),
        //     // A map is made of mulitple layers, but we only have 1.
        //     mapLayer = this.get('parent').get('map').get('children')[0];

        // // Add the amount we're going to move onto the box
        // box.origin[axis] += dist;

        // // Record which blocks were hit
        // var hitBlocks = [];

        // // We will test each corner of the ball for a hit
        // var testPoints = {
        //     nw: util.copy(box.origin),
        //     sw: new geom.Point(box.origin.x, box.origin.y + box.size.height),
        //     ne: new geom.Point(box.origin.x + box.size.width, box.origin.y),
        //     se: new geom.Point(box.origin.x + box.size.width, box.origin.y + box.size.height)
        // };

        // for (var corner in testPoints) {
        //     var point = testPoints[corner];

        //     // All our blocks are 32x16 pixels
        //     var tileX = Math.floor(point.x / 32),
        //         tileY = Math.floor(point.y / 16),
        //         tilePos = new geom.Point(tileX, tileY);

        //     // Tile ID 0 is an empty tile, everything else is a hit
        //     if (mapLayer.tileGID(tilePos) > 0) {
        //         hitBlocks.push(tilePos);
        //     }
        // }

        // // If we hit something, swap directions
        // if (hitBlocks.length > 0) {
        //     vel[axis] *= -1;
        // }

        // this.set('velocity', vel);

        // // Remove the blocks we hit
        // for (var i=0; i<hitBlocks.length; i++) {
        //     mapLayer.removeTile(hitBlocks[i]);
        // }

        // return (hitBlocks.length > 0)
    }
});

module.exports = Ball;
