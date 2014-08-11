var cs1010s = cs1010s = cs1010s || {};

cs1010s.Medicine = cc.Sprite.extend({
    name : null,
    foodValue : null,
    medicineValue : null,
    owner : null,

    ctor:function(name, foodValue, medicineValue, owner) {
        this._super("images/" + name.replace(/[ ]/g, "_").toLowerCase() + ".png");
        this.name = name;
        this.foodValue = foodValue;
        this.medicineValue = medicineValue;
        this.owner = owner;
    }
});