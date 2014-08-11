var cs1010s = cs1010s = cs1010s || {};

cs1010s.Medicine = cs1010s.NamedObject.extend({
    foodValue : null,
    medicineValue : null,
    owner : null,

    ctor:function(name, foodValue, medicineValue, owner) {
        this._super(name);
        this.foodValue = foodValue;
        this.medicineValue = medicineValue;
        this.owner = owner;
    }
});