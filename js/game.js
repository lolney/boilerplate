var myCodeMirror = CodeMirror(document.body, {
  value: "function myScript(){alert('test');}\n",
  mode:  "javascript"
});

myCodeMirror.on("change", function(x){
    eval(myCodeMirror.getValue());
});

/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Plugins
        // First two arguments are width/height of world
        me.plugin.register(pathFindingPlugin, "pathFinding",
          3200, 3200, 'JumpPointFinder', 1, 'lib/plugins/pathfinding_webworkers/');

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    /**
     * callback when everything is loaded
     */
    loaded : function () {
      // set the "Play/Ingame" Screen Object
      me.state.set(me.state.PLAY, new game.PlayScreen());

      // register our player entity in the object pool
      me.pool.register("mainPlayer", game.PlayerEntity);

      // register NPC entity in the object pool
      me.pool.register("NPC1", game.NPCEntity);

      // register Rock1 entity in the object pool
      me.pool.register("Rock1", game.RockEntity);

      // register Rock2 entity in the object pool
      me.pool.register("Rock2", game.RockEntity);

       // register Rock3 entity in the object pool
      me.pool.register("Rock3", game.RockEntity);

      // register Tree1 entity in the object pool
      me.pool.register("Tree1", game.TreeEntity);

      // enable the keyboard
      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");
      me.input.bindKey(me.input.KEY.UP, "up");
      me.input.bindKey(me.input.KEY.DOWN, "down");

      // start the game
      me.state.change(me.state.PLAY);
    }

};
