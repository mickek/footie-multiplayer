var cocos = require('cocos2d'),
    geom = require('geometry'),
    util = require('util');

var Player = cocos.nodes.Node.extend({

    isKicking: false,

    init: function() {
        Player.superclass.init.call(this);

        var sprite = cocos.nodes.Sprite.create({
                         file: '/resources/sprites.png',
                         rect: new geom.Rect(64, 0, 16, 16)
                     });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        this.addChild({child: sprite});
        this.set('contentSize', sprite.get('contentSize'));
        this.set('velocity', new geom.Point(0,0));
        this.scheduleUpdate();
    },
    setVelocity: function(vel){
        this.set('velocity', vel);

        if(vel.x == 0){
            if (vel.y >= 0){
                this.set('rotation', 180);
            }
            if(vel.y <= 0){
                this.set('rotation', 0);
            }
        }
        else{
            var rad = Math.atan(vel.y/vel.x);

            rad = rad * (360 / (2*Math.PI) )+90;
            if (vel.x < 0){
                rad+=180;
            }
            this.set('rotation', rad);
        }
    },

    update: function(dt){
            var pos = util.copy(this.get('position')),
                vel = util.copy(this.get('velocity'));

            pos.x += dt * vel.x;
            pos.y += dt * vel.y;
            this.set('position', pos);
    },

    getPosition: function () {
        var pos = this.get("position");
        var v = this.get("velocity");
        return {
            position: [pos.x, pos.y],
            velocity: [v.x, v.y]
        };
    }

});

module.exports = Player;
