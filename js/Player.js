(function() {
    var playerCounter = 0;

    cs1010s.Player = cs1010s.NamedObject.extend({
        playerId: null,

        ctor:function(name, objectID) {
            this.playerId = playerCounter++;
            this._super(name, objectID);
        },

        getImageFile:function() {
            return "AI" + (this.playerId + 1) + ".png";
        }
    });
}());