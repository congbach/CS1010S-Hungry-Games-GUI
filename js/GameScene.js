var cs1010s = cs1010s = cs1010s || {};

(function() {
    var GRID_SIZE = 128.0;

    cs1010s.GameScene = cc.Scene.extend({
        _mapObjects : null,

        ctor:function(mapSize) {
            this._super();

            this.constructMap(mapSize);
            this.initializeMapObjects(mapSize);
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

        initializeMapObjects:function(mapSize) {
            this._mapObjects = [];
            for (var row = 0; row < mapSize; row++) {
                this._mapObjects.push([]);
                for (var col = 0; col < mapSize; col++) {
                    this._mapObjects[row].push([]);
                }
            }
        },

        loadMapObjects:function(jsonMap) {
            var that = this;
            $.each(jsonMap, function(index, element) {
                var tokens = index.replace(/[(),]/g, "").split(" ");
                var row = parseInt(tokens[0]) - 1;
                var col = parseInt(tokens[1]) - 1;
                $.each(element.objects, function(id, jsonObj) {
                    console.log(row, col);
                    that.addObject(cs1010s.GameObjectFactory.createFromJSON(jsonObj), row, col);
                });
            })

            this.repositionAllObjects();
        },

        addObject:function(obj, row, col) {
            if (obj)
            {
                this.addChild(obj);
                this._mapObjects[row][col].push(obj);
//                this.repositionObjectsAtGrid(row, col);
            }
        },

        repositionAllObjects:function() {
            for (var row = 0; row < this._mapObjects.length; row++)
                for (var col = 0; col < this._mapObjects[row].length; col++)
                    this.repositionObjectsAtGrid(row, col);
        },

        repositionObjectsAtGrid:function(row, col) {
            var gridObjectsCount = this._mapObjects[row][col].length;
            var gridSubRowCount = gridObjectsCount < 3 ? 1 : gridObjectsCount < 7 ? 2 : 3;
            var gridSubColCount = gridObjectsCount < 2 ? 1 : gridObjectsCount < 5 ? 2 : 3;
            var gridSubRowHeight = GRID_SIZE / gridSubRowCount;
            var gridSubColWidth = GRID_SIZE / gridSubColCount;

            var gridTopX = row * GRID_SIZE;
            var gridTopY = col * GRID_SIZE;

            for (var i = 0; i < this._mapObjects[row][col].length; i++) {
                var r = Math.floor(i / gridSubColCount);
                var c = i % gridSubColCount;
                var gridObject = this._mapObjects[row][col][i];
                gridObject.setPosition(gridTopX + (c + 0.5) * gridSubColWidth,
                                       gridTopY + (r + 0.5) * gridSubRowHeight);
                }
        }
    });

    cs1010s.GameScene.create = function(json) {
        var config = json.rounds[0].config;
        var mapSize = config.map.size;
        var scene = new cs1010s.GameScene(mapSize);
        scene.loadMapObjects(json.rounds[0].history[0].map);
        return scene;
    };

}());