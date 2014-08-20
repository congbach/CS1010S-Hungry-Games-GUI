var cs1010s = {};

cs1010s.resources = [
    "images/square.png",

    // medicine
    "images/panadol.png",
    "images/aloe_vera.png",
    "images/health_potion.png",

    // weapons
    "images/sword.png",
    "images/machete.png",
    "images/dagger.png",
    "images/mace.png",

    // ranged weapons
    "images/bow.png",
    "images/crossbow.png",
    "images/pistol.png",
    "images/rifle.png",

    // ammo
    "images/arrows.png",
    "images/healing_herbs.png",
    "images/wild_mushroom.png",
    "images/5.56mm.png",
    "images/9mm.png",
    "images/bolts.png",

    // animals
    "images/sheep.png",
    "images/cow.png",
    "images/pig.png",
    "images/boar.png",
    "images/python.png",
    "images/chicken.png",
    "images/deer.png",
    "images/bear.png",
    "images/wolf.png",

    // food
    "images/watermelon.png",
    "images/cabbage.png",
    "images/potato.png",
    "images/apple.png",
    "images/carrot.png",

    // players
    "images/AI.png",
    "images/AI1.png",
    "images/AI2.png"
];

cs1010s.hasResource = function(resource) {
    for (var i = 0; i < cs1010s.resources.length; i++)
        if (cs1010s.resources[i].replace("images/", "") == resource)
            return true;
    return false;
};

window.onload = function(){
    cc.game.onStart = function(){
        //load resources
        cc.LoaderScene.preload(cs1010s.resources, function () {
            $.getJSON("sample_data_bak.json", function(data) {
                cc.director.runScene(cs1010s.GameReplayScene.create(data));
            });
        }, this);
    };
    cc.game.run("gameCanvas");
};