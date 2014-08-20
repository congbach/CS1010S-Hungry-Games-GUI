cs1010s.Food = cs1010s.NamedObject.extend({
    getImageFile:function() {
        if (this.name.indexOf("meat") != -1)
            return "meat.png";
        return this._super();
    }
});