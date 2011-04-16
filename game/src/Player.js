var cocos = require('cocos2d'),
    geom = require('geometry');

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
    }, 
    
    setVelocity: function(vel){
        this.set('velocity', vel);
    }   

});

module.exports = Player;
