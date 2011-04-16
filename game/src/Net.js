var cocos = require('cocos2d'),
    geom = require('geometry'),
    util = require('util');

var Net = cocos.nodes.Node.extend({


    init: function() {
        Net.superclass.init.call(this);

        var sprite = cocos.nodes.Sprite.create({
                         file: '/resources/sprites.png',
                         rect: new geom.Rect(100, 0, 8, 16)
                     });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        sprite.scaleY=5;
        this.addChild({child: sprite});
        this.set('contentSize', sprite.get('contentSize'));
        this.set('velocity', new geom.Point(0,0));
    }


});

module.exports = Net;
