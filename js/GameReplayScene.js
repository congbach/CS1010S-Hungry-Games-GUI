(function() {
    cs1010s.GameReplayScene = cs1010s.GameScene.extend({
        jsonHistoryLog : null,
        turnId : null,
        eventId : null,

        playHistory:function(jsonHistoryLog) {
            this.jsonHistoryLog = jsonHistoryLog;
            this.turnId = -1;
            this.replayNextTurn();
        },

        replayNextTurn:function() {
            if (++this.turnId >= this.jsonHistoryLog.length)
                return;

            this.loadNewMapObjects(this.jsonHistoryLog[this.turnId].map);
            this.eventId = -1;
            this.replayNextEvent();
        },

        replayNextEvent:function() {
            if (++this.eventId >= this.jsonHistoryLog[this.turnId].events.length) {
                this.replayNextTurn();
                return;
            }

            var event = this.jsonHistoryLog[this.turnId].events[this.eventId];
            if (this.shouldReplayEvent(event))
                this.replayEvent(event);
            else
                this.replayNextEvent();
        },

        shouldReplayEvent:function(event) {
            var replayableEvents = [
                "MOVE",
                "ATTACK",
                "TOOK",
                "KILLED",
                "SPAWNED"
            ];
            return replayableEvents.indexOf(event[0]) != -1;
        },

        replayEvent:function(event) {
            switch (event[0]) {
                case "MOVE":
                    this.replayMoveEvent(event);
                    break;

                case "ATTACK":
                    this.replayAttackEvent(event);
                    break;

                case "TOOK":
                    this.replayTakeEvent(event);
                    break;

                case "KILLED":
                    this.replayDeadEvent(event);
                    break;

                case "SPAWNED":
                    this.replaySpawnEvent(event);
                    break;

                default:
                    // FIXME: eventually all events should be supported -> throw assertion here
                    console.log("Unknown replayable event: " + event[0]);
                    console.log(event);
//                    this.replayNextEvent();
            }
        },

        replayMoveEvent:function(event) {
            var fromCoordinate = cs1010s.GridCoordinate.createFromJSON(event[2].name);
            var fromGrid = this.getGrid(fromCoordinate);
            var movingObj = fromGrid.searchForObjectByJSON(event[1]);
            var toCoordinate = cs1010s.GridCoordinate.createFromJSON(event[3].name);
            var toGrid = this.getGrid(toCoordinate);

            this.animateMoveEvent(movingObj, toGrid);
            fromGrid.removeObject(movingObj);
            toGrid.addObject(movingObj);
        },

        animateMoveEvent:function(movingObj, toGrid) {
            var moveAnimationController =
                new cs1010s.MoveEventAnimationController(movingObj, toGrid, this.replayNextEvent, this);
            moveAnimationController.startAnimating();
        },

        replayAttackEvent:function(event) {
            var attackingCoordinate = cs1010s.GridCoordinate.createFromJSON(event[1].place.name);
            var attackingObject = this.getGrid(attackingCoordinate).searchForObjectByJSON(event[1]);
            var attackedCoordinate = cs1010s.GridCoordinate.createFromJSON(event[2].place.name);
            var attackedObject = this.getGrid(attackedCoordinate).searchForObjectByJSON(event[2]);
            var attackDamage = event[3];

            this.animateAttackEvent(attackingObject, attackedObject, attackDamage);
        },

        animateAttackEvent:function(attackingObject, attackedObject, attackDamage) {
            var attackAnimationController =
                new cs1010s.AttackEventAnimationController(attackingObject, attackedObject, attackDamage,
                    this.replayNextEvent, this);
            attackAnimationController.startAnimating();
        },

        replayTakeEvent:function(event) {
            var gridCoordinate = cs1010s.GridCoordinate.createFromJSON(event[1].place.name);
            var grid = this.getGrid(gridCoordinate);
            var takingObject = grid.searchForObjectByJSON(event[1]);
            var takenObject = grid.searchForObjectByJSON(event[2]);

            this.animateTakeEvent(takingObject, takenObject, gridCoordinate);
        },

        animateTakeEvent:function(takingObject, takenObject, gridCoordinate) {
            var takeAnimationController =
                new cs1010s.TakeEventAnimationController(takingObject, takenObject, gridCoordinate,
                    this.takeEventAnimationDidEnd, this);
            takeAnimationController.startAnimating();
        },

        takeEventAnimationDidEnd:function(takingObject, takenObject, gridCoordinate) {
            this.getGrid(gridCoordinate).removeObject(takenObject);
            this.removeChild(takenObject);
            this.replayNextEvent();
        },

        replayDeadEvent:function(event) {
            var gridCoordinate = cs1010s.GridCoordinate.createFromJSON(event[1].place.name);
            var grid = this.getGrid(gridCoordinate);
            var deadObject = grid.searchForObjectByJSON(event[2]);
            this.animateDeadEvent(deadObject, gridCoordinate);
        },

        animateDeadEvent:function(deadObject, gridCoordinate) {
            var deadAnimationController =
                new cs1010s.DeadEventAnimationController(deadObject, gridCoordinate, this.deadEventAnimationDidEnd, this);
            deadAnimationController.startAnimating();
        },

        deadEventAnimationDidEnd:function(deadObject, gridCoordinate) {
            this.removeChild(deadObject);
            if (deadObject instanceof cs1010s.Animal) {
                if (this.turnId + 1 < this.jsonHistoryLog.length) {
                    // Load meat (spawned next turn) in advance to ensure smoothness of the game
                    var meat = this.scanAnimalMeat(this.jsonHistoryLog[this.turnId + 1].map, deadObject, gridCoordinate);
                    this.addChild(meat);
                    var grid = this.getGrid(gridCoordinate);
                    var index = grid.replaceObject(deadObject, meat);
                    grid.repositionObjectAtIndex(index);
                }
            }
            else
                this.getGrid(gridCoordinate).removeObject(deadObject);
            this.replayNextEvent();
        },

        scanAnimalMeat:function(jsonMap, deadAnimal, gridCoordinate) {
            var jsonGrid = jsonMap["(" + (gridCoordinate.row + 1) + ", " + (gridCoordinate.col + 1) + ")"];
            var that = this;
            var meat = null;
            $.each(jsonGrid.objects, function(id, jsonObj) {
                if (jsonObj.type == cs1010s.GameObjectFactory.ObjectType.Food &&
                    jsonObj.name.indexOf(deadAnimal.name) != -1 &&
                    jsonObj.name.indexOf("meat") != -1) {
                    meat = cs1010s.GameObjectFactory.createFoodFromJSON(jsonObj);
                    return false;
                }
            });
            return meat;
        },

        replaySpawnEvent:function(event) {
            var gridCoordinate = cs1010s.GridCoordinate.createFromJSON(event[1].place.name);
            var spawnedObject = cs1010s.GameObjectFactory.createFromJSON(event[1]);

            var grid = this.getGrid(gridCoordinate);
            spawnedObject.setPosition(grid.getNextObjectPosition());
            this.addObject(spawnedObject, gridCoordinate.row, gridCoordinate.col);
            this.animateSpawnEvent(spawnedObject);
        },

        animateSpawnEvent:function(spawnedObject) {
            var spawnAnimationController =
                new cs1010s.SpawnEventAnimationController(spawnedObject, this.replayNextEvent, this);
            spawnAnimationController.startAnimating();
        }
    });

    cs1010s.GameReplayScene.create = function(json) {
        var roundId = 1;
        var config = json.rounds[roundId].config;
        var mapSize = config.map.size;
        var scene = new cs1010s.GameReplayScene(mapSize, cs1010s.GridSize.Medium);
        scene.playHistory(json.rounds[roundId].history);
        return scene;
    };
}());