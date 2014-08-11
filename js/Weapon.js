var cs1010s = cs1010s = cs1010s || {};

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

