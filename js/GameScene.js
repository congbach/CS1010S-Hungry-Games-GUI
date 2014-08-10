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
    },

    loadMapObjects:function(jsonMap) {
        var that = this;
        $.each(jsonMap, function(index, element) {
            var tokens = index.replace(/[(),]/g, "").split(" ");
            var row = parseInt(tokens[0]);
            var col = parseInt(tokens[1]);
            $.each(element.objects, function(id, jsonObj) {
                that.addObject(cs1010s.GameObjectFactory.createFromJSON(jsonObj), row, col);
            });
        })
    },

    addObject:function(obj, row, col) {
        console.log(row, col);
        console.log(obj);
    }
});

cs1010s.GameScene.create = function(json) {
    var config = json.rounds[0].config;
    var mapSize = config.map.size;
    var scene = new cs1010s.GameScene(mapSize);
    scene.loadMapObjects(json.rounds[0].history[0].map);
    return scene;
};