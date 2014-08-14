var cs1010s = cs1010s = cs1010s || {};

cs1010s.GameObjectFactory = {};
cs1010s.GameObjectFactory.createFromJSON = function(json) {
    switch (json.type) {
        case "Medicine":
            return cs1010s.GameObjectFactory.createMedicineFromJSON(json);

        case "Weapon":
            return cs1010s.GameObjectFactory.createWeaponFromJSON(json);

        case "RangedWeapon":
            return cs1010s.GameObjectFactory.createRangedWeaponFromJSON(json);

        case "Animal":
        case "WildAnimal":
            return cs1010s.GameObjectFactory.createAnimalFromJSON(json);

        case "Food":
            return cs1010s.GameObjectFactory.createFoodFromJSON(json);

        default:
            console.log(json);
            return null;
    }
};

cs1010s.GameObjectFactory.createMedicineFromJSON = function(json) {
    var name = json.name;
    var foodValue = json.food_value;
    var medicineValue = json.medicine_value;
    var owner = json.owner;
    return new cs1010s.Medicine(name, foodValue, medicineValue, owner);
};

cs1010s.GameObjectFactory.createWeaponFromJSON = function(json) {
    var name = json.name;
    var minDmg = json.min_dmg;
    var maxDmg = json.max_dmg;
    var owner = json.owner;
    return new cs1010s.Weapon(name, minDmg, maxDmg, owner);
};

cs1010s.GameObjectFactory.createRangedWeaponFromJSON = function(json) {
    var name = json.name;
    var minDmg = json.min_dmg;
    var maxDmg = json.max_dmg;
    var shotsCount = json.shots_left;
    var owner = json.owner;

    return new cs1010s.RangedWeapon(name, minDmg, maxDmg, shotsCount, owner);
};

cs1010s.GameObjectFactory.createAnimalFromJSON = function(json) {
    var name = json.name;

    return new cs1010s.Animal(name);
};

cs1010s.GameObjectFactory.createFoodFromJSON = function(json) {
    var name = json.name;

    return new cs1010s.Food(name);
};