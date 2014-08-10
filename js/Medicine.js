var cs1010s = cs1010s = cs1010s || {};

cs1010s.Medicine = cc.Sprite.extend({
    foodValue : null,
    medicineValue : null,
    name : null,
    owner : null,

    ctor:function(name, foodValue, medicineValue, owner) {
        this._super("images/medicine.png");
        this.name = name;
        this.foodValue = foodValue;
        this.medicineValue = medicineValue;
        this.owner = owner;
    }
});