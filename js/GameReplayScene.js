(function() {
    cs1010s.GameReplayScene = cs1010s.GameScene.extend({
        jsonHistoryLog : null,
        eventId : null,

        playHistory:function(jsonHistoryLog) {
            this.jsonHistoryLog = jsonHistoryLog;
            this.loadMapObjectsFromHistoryLog();
            this.eventId = -1;
            this.replayNextEvent();
        },

        loadMapObjectsFromHistoryLog:function() {
            this.loadMapObjects(this.jsonHistoryLog.map);
        },

        replayNextEvent:function() {
            if (++this.eventId >= this.jsonHistoryLog.events.length)
                return;

            var event = this.jsonHistoryLog.events[this.eventId];
            if (this.shouldReplayEvent(event))
                this.replayEvent(event);
            else
                this.replayNextEvent();
        },

        shouldReplayEvent:function(event) {
            var replayableEvents = [ "MOVE", "ATTACK", "TAKE", "KILLED" ];
            return replayableEvents.indexOf(event[0]) != -1;
        },

        replayEvent:function(event) {
            console.log(event);
            switch (event[0]) {
                case "MOVE":
                    this.replayMoveEvent(event);
                    break;

                case "ATTACK":
                    this.replayAttackEvent(event);
                    break;

//                case "TAKE":
//                    this.replayTakeEvent(event);
//                    break;
//
                case "KILLED":
                    this.replayDeadEvent(event);
                    break;

                default:
                    // FIXME: eventually all events should be supported -> throw assertion here
                    console.log("Unknown replayable event: " + event[0]);
                    this.replayNextEvent();
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
            this.getGrid(gridCoordinate).removeObject(deadObject);
            this.removeChild(deadObject);
        }
    });

    cs1010s.GameReplayScene.create = function(json) {
        var config = json.rounds[0].config;
        var mapSize = config.map.size;
        var scene = new cs1010s.GameReplayScene(mapSize);
        scene.playHistory(json.rounds[0].history[0]);
        return scene;
    };
}());