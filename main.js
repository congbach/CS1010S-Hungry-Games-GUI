window.onload = function(){
    var resources = [
        "images/square.png",

        // medicine
        "images/panadol.png",
        "images/aloe_vera.png",

        // weapons
        "images/sword.png",
        "images/machete.png",

        // ranged weapons
        "images/bow.png",
        "images/crossbow.png",
        "images/pistol.png",

        // animals
        "images/sheep.png",
        "images/cow.png",
        "images/pig.png",
        "images/boar.png",
        "images/python.png",
        "images/chicken.png",

        // food
        "images/watermelon.png",
        "images/cabbage.png",
        "images/potato.png",
        "images/apple.png"
    ];

    cc.game.onStart = function(){
        //load resources
        cc.LoaderScene.preload(resources, function () {
            $.getJSON("sample_data.json", function(data) {
                cc.director.runScene(cs1010s.GameScene.create(data));
            });
        }, this);
    };
    cc.game.run("gameCanvas");
};