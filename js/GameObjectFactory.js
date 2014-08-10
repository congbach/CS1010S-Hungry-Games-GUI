var cs1010s = cs1010s = cs1010s || {};

cs1010s.GameObjectFactory = {};
cs1010s.GameObjectFactory.createFromJSON = function(json) {
    switch (json.type) {
        case "Medicine":
            return cs1010s.GameObjectFactory.createMedicineFromJSON(json);
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
}