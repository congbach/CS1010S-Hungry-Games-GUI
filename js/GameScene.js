var cs1010s = cs1010s = cs1010s || {};

cs1010s.GameScene = cc.Scene.extend({
    ctor:function(mapSize) {
        this._super();
    },

    onEnter:function () {
        this._super();
        var size = cc.director.getWinSize();
        var sprite = cc.Sprite.create("HelloWorld.png");
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        var label = cc.LabelTTF.create("Hello World", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);
    }
});

cs1010s.GameScene.create = function(json) {
    var config = json.rounds[0].config;
    var mapSize = config.map.size;
    return new cs1010s.GameScene(mapSize);
};