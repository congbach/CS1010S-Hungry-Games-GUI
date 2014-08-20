cs1010s.NamedObject = cc.Sprite.extend({
    name : null,
    objectID : null,

    ctor:function(name, objectID) {
        this.name = name;
        this.objectID = objectID;
        var spriteFile = this.getImageFile();
        if (!cs1010s.hasResource(spriteFile))
            // FIXME: should provide some default image here (?)
            console.log("Image not found: " + spriteFile);
        this._super("images/" + spriteFile);
    },

    getImageFile:function() {
        return this.name.replace(/[ ]/g, "_").toLowerCase() + ".png";
    },

    matchJSON:function(json) {
        return json.id == this.objectID;
    }
});