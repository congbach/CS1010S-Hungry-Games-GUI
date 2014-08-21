(function() {
    cs1010s.GridSize = { Small : { name: "small", maxObjects : 9 },
                         Medium : { name: "medium", maxObjects : 16 } };

    cs1010s.Grid = cc.Sprite.extend({
        _objects: null,
        _maxObjectsCount: null,

        ctor:function(gridSize) {
            this._super(this.getGridImage(gridSize));
            this._maxObjectsCount = gridSize.maxObjects;

            this._objects = [];
            for (var i = 0; i < this._maxObjectsCount; i++)
                this._objects.push(null);
        },

        getGridImage:function(gridSize) {
            return "images/square.png";
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

        replaceObject:function(object, replacement) {
            var index = this._objects.indexOf(object);
            if (index != -1)
                this._objects[index] = replacement;
            return index;
        },

        removeAllObjects:function() {
            for (var i = 0; i < this._objects.length; i++)
                this._objects[i] = null;
        },

        getAllObjects:function() {
            var ret = [];
            for (var i = 0; i < this._objects.length; i++)
                if (this._objects[i])
                    ret.push(this._objects[i]);
            return ret;
        },

        searchForObjectByJSON:function(json) {
            var ret = null;
            $.each(this._objects, function(index, object) {
                // FIXME: eventually all objects much implement matchJSON
                if (object && object.matchJSON && object.matchJSON(json)) {
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

        repositionObjectAtIndex:function(index) {
            var object = this._objects[index];
            if (object)
                object.setPosition(this._getPositionForObjectAtIndex(index));
        },

        repositionAllObjects:function() {
            var that = this;
            $.each(this._objects, function(index, object) {
                if (object)
                    object.setPosition(that._getPositionForObjectAtIndex(index));
            });
        },

        _getPositionForObjectAtIndex:function(index) {
            var GRID_MAP;
            switch (this._maxObjectsCount) {
                case 9:
                    GRID_MAP = [
                        [1, 5, 3],
                        [6, 0, 7],
                        [4, 8, 2]
                    ];
                    break;

                case 16:
                    GRID_MAP = [
                        [4, 8, 9, 2],
                        [10, 0, 6, 11],
                        [12, 7, 1, 13],
                        [3, 14, 15, 5]
                    ];
                    break;
            }
            var subRowId, subColId;
            for (var i = 0; i < GRID_MAP.length; i++)
                for (var j = 0; j < GRID_MAP[i].length; j++)
                    if (GRID_MAP[i][j] == index) {
                        subRowId = i;
                        subColId = j;
                    }
            var subRowHeight = this.getContentSize().height / GRID_MAP.length;
            var subColWidth = this.getContentSize().width / GRID_MAP[0].length;

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

        ctor:function(mapSize, gridSize) {
            this._super();

            this.constructMap(mapSize, gridSize);
        },

        constructMap:function(mapSize, gridSize) {
            this._grids = [];
            for (var i = 0; i < mapSize; i++) {
                var row = [];
                for (var j = 0; j < mapSize; j++) {
                    var grid = new cs1010s.Grid(gridSize);
                    grid.setPosition((i + 0.5) * grid.getContentSize().width,
                                     (j + 0.5) * grid.getContentSize().height);
                    this.addChild(grid);
                    row.push(grid);
                }
                this._grids.push(row);
            }
        },

        loadNewMapObjects:function(jsonMap) {
            var that = this;
            $.each(jsonMap, function(index, element) {
                var tokens = index.replace(/[(),]/g, "").split(" ");
                var row = parseInt(tokens[0]) - 1;
                var col = parseInt(tokens[1]) - 1;
                var grid = that.getGrid(row, col);
                if (element.objects)
                    $.each(element.objects, function(id, jsonObj) {
                        if (!grid.searchForObjectByJSON(jsonObj))
                            that.addObject(cs1010s.GameObjectFactory.createFromJSON(jsonObj), row, col);
                    });
            });

            this.repositionAllObjects();
        },

        _clearMap:function() {
            var that = this;
            $.each(this._grids, function(rowId, row) {
                $.each(row, function(colId, grid) {
                    var objects = grid.getAllObjects();
                    grid.removeAllObjects();
                    $.each(objects, function(index, object) {
                        that.removeChild(object);
                    });
                })
            });
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