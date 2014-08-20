cs1010s.GameObjectFactory = {};
cs1010s.GameObjectFactory.createFromJSON = function(json) {
    switch (json.type) {
        case "Medicine":
            return cs1010s.GameObjectFactory.createMedicineFromJSON(json);

        case "Weapon":
            return cs1010s.GameObjectFactory.createWeaponFromJSON(json);

        case "RangedWeapon":
            return cs1010s.GameObjectFactory.createRangedWeaponFromJSON(json);

        case "Ammo":
            return cs1010s.GameObjectFactory.createAmmoFromJSON(json);

        case "Animal":
        case "WildAnimal":
            return cs1010s.GameObjectFactory.createAnimalFromJSON(json);

        case "Food":
            return cs1010s.GameObjectFactory.createFoodFromJSON(json);

        case "Player":
            return cs1010s.GameObjectFactory.createPlayerFromJSON(json);

        default:
            console.log(json);
            return null;
    }
};

cs1010s.GameObjectFactory.createMedicineFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.Medicine(name, objectID);
};

cs1010s.GameObjectFactory.createWeaponFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.Weapon(name, objectID);
};

cs1010s.GameObjectFactory.createRangedWeaponFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.RangedWeapon(name, objectID);
};

cs1010s.GameObjectFactory.createAmmoFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.Ammo(name, objectID);
};

cs1010s.GameObjectFactory.createAnimalFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.Animal(name, objectID);
};

cs1010s.GameObjectFactory.createFoodFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.Food(name, objectID);
};

cs1010s.GameObjectFactory.createPlayerFromJSON = function(json) {
    var name = json.name;
    var objectID = json.id;

    return new cs1010s.Player(name, objectID);
};