var cs1010s = cs1010s = cs1010s || {};

cs1010s.NamedObject = cc.Sprite.extend({
    name : null,

    ctor:function(name) {
        this._super("images/" + name.replace(/[ ]/g, "_").toLowerCase() + ".png");
        this.name = name;
    }
});