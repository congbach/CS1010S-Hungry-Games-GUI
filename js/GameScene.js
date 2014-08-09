var cs1010s = cs1010s = cs1010s || {};

cs1010s.GameScene = cc.Scene.extend({
    ctor:function(mapSize) {
        this._super();

        this.constructMap(mapSize);
    },

    constructMap:function(mapSize) {
        for (var i = 0; i < mapSize; i++) {
            for (var j = 0; j < mapSize; j++) {
                var sprite = cc.Sprite.create("images/square.png");
                sprite.setPosition((i + 0.5) * sprite.getContentSize().width,
                    (j + 0.5) * sprite.getContentSize().height);
                this.addChild(sprite);
            }
        }
    }
});

cs1010s.GameScene.create = function(json) {
    var config = json.rounds[0].config;
    var mapSize = config.map.size;
    return new cs1010s.GameScene(mapSize);
};