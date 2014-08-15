(function() {
    var GRID_MAX_OBJECTS = 9;

    cs1010s.Grid = cc.Sprite.extend({
        _objects: null,

        ctor:function() {
            this._super("images/square.png");

            this._objects = [];
            for (var i = 0; i < GRID_MAX_OBJECTS; i++)
                this._objects.push(null);
        },

        addObject:function(object) {
            this._objects[this._getNextObjectIndex()] = object;
        },

        _getNextObjectIndex:function() {
            for (var i = 0; i < this._objects.length; i++)
                if (this._objects[i] == null)
                    return i;

            // FIXME: do some assertion or throw some error here
            return -1;
        },

        removeObject:function(object) {
            var index = this._objects.indexOf(object);
            if (index != -1)
                this._objects[index] = null;
        },

        searchForObjectByJSON:function(json) {
            var ret = null;
            $.each(this._objects, function(index, object) {
                // FIXME: eventually all objects much implement matchJSON
                if (object.matchJSON && object.matchJSON(json)) {
                    ret = object;
                    return false;
                }
            });
            return ret;
        },

//        repositionAllObjects:function() {
//            var subRowCount = this._objects.length < 3 ? 1 : this._objects.length < 7 ? 2 : 3;
//            var subColCount = this._objects.length < 2 ? 1 : this._objects.length < 5 ? 2 : 3;
//            var subRowHeight = this.getContentSize().height / subRowCount;
//            var subColWidth = this.getContentSize().width / subColCount;
//
//            var x = this.getPosition().x - this.getContentSize().width/2;
//            var y = this.getPosition().y - this.getContentSize().height/2;
//
//            for (var i = 0; i < this._objects.length; i++) {
//                var r = Math.floor(i / subColCount);
//                var c = i % subColCount;
//                var object = this._objects[i];
//                object.setPosition(x + (c + 0.5) * subColWidth,
//                                   y + (r + 0.5) * subRowHeight);
//            }
//        },

        repositionAllObjects:function() {
            var that = this;
            $.each(this._objects, function(index, object) {
                if (object)
                    object.setPosition(that._getPositionForObjectAtIndex(index));
            });
        },

        _getPositionForObjectAtIndex:function(index) {
            var GRID_MAP = [
                [1, 5, 3],
                [6, 0, 7],
                [4, 8, 2]
            ];
            var subRowId, subColId;
            for (var i = 0; i < 3; i++)
                for (var j = 0; j < 3; j++)
                    if (GRID_MAP[i][j] == index) {
                        subRowId = i;
                        subColId = j;
                    }
            var subRowHeight = this.getContentSize().height / 3;
            var subColWidth = this.getContentSize().width / 3;

            var x = this.getPosition().x - this.getContentSize().width/2;
            var y = this.getPosition().y - this.getContentSize().height/2;

            return cc.p(x + (subColId + 0.5) * subColWidth, y + (subRowId + 0.5) * subRowHeight);
        },

        getNextObjectPosition:function() {
            return this._getPositionForObjectAtIndex(this._getNextObjectIndex());
        }
    });

    cs1010s.GridCoordinate = cc.Class.extend({
        row : null,
        col : null,

        ctor:function(row, col) {
            this.row = row;
            this.col = col;
        }
    });

    cs1010s.GridCoordinate.createFromJSON = function(json) {
        var tokens = json.replace(/[(),]/g, "").split(" ");
        var row = parseInt(tokens[0]) - 1;
        var col = parseInt(tokens[1]) - 1;

        return new cs1010s.GridCoordinate(row, col);
    };

    cs1010s.GameScene = cc.Scene.extend({
        _grids : null,

        ctor:function(mapSize) {
            this._super();

            this.constructMap(mapSize);
        },

        constructMap:function(mapSize) {
            this._grids = [];
            for (var i = 0; i < mapSize; i++) {
                var row = [];
                for (var j = 0; j < mapSize; j++) {
                    var grid = new cs1010s.Grid();
                    grid.setPosition((i + 0.5) * grid.getContentSize().width,
                                     (j + 0.5) * grid.getContentSize().height);
                    this.addChild(grid);
                    row.push(grid);
                }
                this._grids.push(row);
            }
        },

        loadMapObjects:function(jsonMap) {
            var that = this;
            $.each(jsonMap, function(index, element) {
                var tokens = index.replace(/[(),]/g, "").split(" ");
                var row = parseInt(tokens[0]) - 1;
                var col = parseInt(tokens[1]) - 1;
                $.each(element.objects, function(id, jsonObj) {
                    that.addObject(cs1010s.GameObjectFactory.createFromJSON(jsonObj), row, col);
                });
            })

            this.repositionAllObjects();
        },

        addObject:function(obj, row, col) {
            // FIXME: assert here after supporting all objects
            if (obj) {
                this.addChild(obj);
                this.getGrid(row, col).addObject(obj);
            }
        },

        repositionAllObjects:function() {
            for (var row = 0; row < this._grids.length; row++)
                for (var col = 0; col < this._grids[row].length; col++)
                    this.getGrid(row, col).repositionAllObjects();
        },

        getGrid:function() {
            if (arguments.length == 1) {
                var coordinate = arguments[0];
                return this._grids[coordinate.row][coordinate.col];
            }
            else {
                var row = arguments[0];
                var col = arguments[1];
                return this._grids[row][col];
            }
        }
    });

}());