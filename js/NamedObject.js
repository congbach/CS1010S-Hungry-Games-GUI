var cs1010s = cs1010s = cs1010s || {};

cs1010s.NamedObject = cc.Sprite.extend({
    name : null,
    objectID : null,

    ctor:function(name, objectID) {
        this.name = name;
        this.objectID = objectID;
        this._super("images/" + this.getImageFile());
    },

    getImageFile:function() {
        return this.name.replace(/[ ]/g, "_").toLowerCase() + ".png";
    },

    matchJSON:function(json) {
        return json.name == this.name;
    }
});