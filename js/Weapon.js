cs1010s.Weapon = cs1010s.NamedObject.extend({
    minDmg : null,
    maxDmg : null,
    owner : null,

    ctor:function(name, minDmg, maxDmg, owner) {
        this._super(name);
        this.minDmg = minDmg;
        this.maxDmg = maxDmg;
        this.owner = owner;
    }
});

cs1010s.RangedWeapon = cs1010s.Weapon.extend({
    shotsCount : null,

    ctor:function(name, minDmg, maxDmg, shotsCount, owner) {
        this._super(name, minDmg, maxDmg, owner);
        this.shotsCount = shotsCount;
    }
});