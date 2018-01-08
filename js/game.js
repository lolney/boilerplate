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
    * Choose a random location 
    */
    chooseRandomPoint : function() {
      var bounds = me.game.world.getBounds();

      x = Math.floor((Math.random() * bounds._width));
      y = Math.floor((Math.random() * bounds._height));

      return [x,y];
    },

    _spawn : function() {
      var objects = game.objectArray;
      for(var i = 0; i < objects.length; i++){
        var obj = objects[i];
        var x; var y;
        if(obj.location){
          x = obj.location[0];
          y = obj.location[1]
        } else{
          // TODO: collision check? Probably have to spawn
          // the object prematurely and take it out if it collides
          var loc = this.chooseRandomPoint();
          x = loc[0]; y = loc[1];
        }
        me.game.world.addChild(new obj.objclass(x,y,obj.props), 2);
      }
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
      //me.pool.register("Rock1", game.RockEntity);
      this._spawn();

      // register Rock2 entity in the object pool
      me.pool.register("Rock2", game.RockEntity);

       // register Rock3 entity in the object pool
      me.pool.register("Rock3", game.RockEntity);

      // register Tree1 entity in the object pool
      me.pool.register("Tree1", game.TreeEntity);

      // register Tree2 entity in the object pool
      me.pool.register("Tree2", game.TreeEntity);

      // enable the keyboard
      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");
      me.input.bindKey(me.input.KEY.UP, "up");
      me.input.bindKey(me.input.KEY.DOWN, "down");

      // start the game
      me.state.change(me.state.PLAY);
    }

};
