(function() {
    var MOVE_EVENT_ANIMATION_DURATION = 1.0;
    var ATTACK_EVENT_ATTACKER_ATTACK_WITHDRAW_ANIMATION_DURATION = 0.2;
    var ATTACK_EVENT_TARGET_FLINCH_ANIMATION_DURATION = 1.0;

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
            var animationAction = cc.MoveTo.create(MOVE_EVENT_ANIMATION_DURATION, toPosition);
            var animationEndAction = cc.CallFunc.create(this.invokeCallback, this);
            this._movingObject.runAction(cc.Sequence.create(animationAction, animationEndAction));
        }
    });

    cs1010s.AttackEventAnimationController = cs1010s.GameEventAnimationController.extend({
        _attackingObject : null,
        _attackedObject : null,
        _attackDamage : null,

        ctor:function(attackingObject, attackedObject, attackDamage, callback, callbackTarget) {
            this._super(callback, callbackTarget);

            this._attackingObject = attackingObject;
            this._attackedObject = attackedObject;
            this._attackDamage = attackDamage;
        },

        startAnimating:function() {
            var animationActions = [];
            animationActions.push(cc.MoveTo.create(ATTACK_EVENT_ATTACKER_ATTACK_WITHDRAW_ANIMATION_DURATION,
                                                   this._attackedObject.getPosition()));
            animationActions.push(cc.CallFunc.create(this.playTargetFlinchAnimation, this));
            animationActions.push(cc.MoveTo.create(ATTACK_EVENT_ATTACKER_ATTACK_WITHDRAW_ANIMATION_DURATION,
                                                   this._attackingObject.getPosition()));
            this._attackingObject.runAction(cc.Sequence.create(animationActions));
        },

        playTargetFlinchAnimation:function() {
            var SHAKE_COUNT = 15; // must be an odd number
//            var shakeDistance = 2, shakeDistanceFriction = 0.05;
//            var animationActions = [];
//            for (var i = 0; i < SHAKE_COUNT; i++) {
//                var shouldShakeRightFirst = i % 2;
//                var shakeDistanceMultiplier = shouldShakeRightFirst ? [1, -1] : [-1, 1];
//                animationActions.push(cc.MoveBy.create(ATTACK_EVENT_TARGET_FLINCH_ANIMATION_DURATION / SHAKE_COUNT / 2,
//                    cc.p(shakeDistanceMultiplier[0] * shakeDistance, 0)));
//                animationActions.push(cc.MoveBy.create(ATTACK_EVENT_TARGET_FLINCH_ANIMATION_DURATION / SHAKE_COUNT,
//                    cc.p(shakeDistanceMultiplier[1] * shakeDistance, 0)));
//                shakeDistance *= 1 - shakeDistanceFriction;
//            }

            var SHAKE_DISTANCE = 2;
            var animationActions = [];
            animationActions.push(cc.MoveBy.create(ATTACK_EVENT_TARGET_FLINCH_ANIMATION_DURATION / SHAKE_COUNT / 2,
                                                   cc.p(-SHAKE_DISTANCE, 0)));
            for (var i = 0; i < SHAKE_COUNT - 1; i++) {
                var shouldShakeRight = i % 2 == 0;
                var shakeDistance = (shouldShakeRight ? 2 : -2) * SHAKE_DISTANCE;
                animationActions.push(cc.MoveBy.create(ATTACK_EVENT_TARGET_FLINCH_ANIMATION_DURATION / SHAKE_COUNT,
                                                       cc.p(shakeDistance, 0)));
            }
            animationActions.push(cc.MoveBy.create(ATTACK_EVENT_TARGET_FLINCH_ANIMATION_DURATION / SHAKE_COUNT / 2,
                                                   cc.p(SHAKE_DISTANCE, 0)));
            animationActions.push(cc.CallFunc.create(this.invokeCallback, this));

            this._attackedObject.runAction(cc.Sequence.create(animationActions));
        }
    });
}());