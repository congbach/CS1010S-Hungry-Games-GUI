(function() {
    var ANIMATION_DURATION = 1.0;

    cs1010s.GameEventAnimationController = cc.Class.extend({
        callback : null,
        callbackTarget : null,

        ctor:function(callback, callbackTarget) {
            this.callback = callback;
            this.callbackTarget = callbackTarget;
        },

        invokeCallback:function(callback) {
            this.callback.apply(this.callbackTarget);
        },

        startAnimating:function() {

        }
    });

    cs1010s.MoveEventAnimationController = cs1010s.GameEventAnimationController.extend({
        _movingObject : null,
        _destinationGrid : null,

        ctor:function(movingObject, destinationGrid, callback, callbackTarget) {
            this._super(callback, callbackTarget);
            this._movingObject = movingObject;
            this._destinationGrid = destinationGrid;
        },

        startAnimating:function() {
            var toPosition = this._destinationGrid.getNextObjectPosition();
            var animationAction = cc.MoveTo.create(ANIMATION_DURATION, toPosition);
            var animationEndAction = cc.CallFunc.create(this.invokeCallback, this);
            this._movingObject.runAction(cc.Sequence.create(animationAction, animationEndAction));
        }
    });
}());