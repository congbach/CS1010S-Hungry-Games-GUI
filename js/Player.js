(function() {
    var playerCounter = 0;
    var playersIds = {};

    cs1010s.Player = cs1010s.NamedObject.extend({
        playerId: null,

        ctor:function(name, objectID) {
            this.playerId = playersIds[name] != undefined ? playersIds[name] : playerCounter++;
            playersIds[name] = this.playerId;
            this._super(name, objectID);
        },

        getImageFile:function() {
            return "AI" + (this.playerId + 1) + ".png";
        }
    });
}());