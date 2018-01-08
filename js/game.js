var myCodeMirror = CodeMirror(document.body, {
  value: "function myScript(){alert('test');}\n",
  mode:  "javascript"
});

myCodeMirror.on("change", function(x){
    eval(myCodeMirror.getValue());
});

/* Game namespace */
var game = {

    bounds: [3200, 3200],

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
          this.bounds[0], this.bounds[1], 'JumpPointFinder', 1, 'lib/plugins/pathfinding_webworkers/');

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    /**
    * Choose a random location 
    */
    chooseRandomPoint : function() {
      
      x = Math.floor(Math.random() * this.bounds[0]);
      y = Math.floor(Math.random() * this.bounds[1]);

      return [x,y];
    },

    _spawn : function(objects) {
      for(var i = 0; i < objects.length; i++){
        var obj = objects[i];
        var x; var y;
        var count = obj.count || 1;

        for(var j=0; j<count; j++){
          if(obj.location){
            x = obj.location[0];
            y = obj.location[1];
          } else{
            // TODO: collision check? Probably have to spawn
            // the object prematurely and take it out if it collides
            var loc = this.chooseRandomPoint();
            x = loc[0]; y = loc[1];
          }
          var gameObject = me.pool.pull(obj.props.name, x, y, obj.props);
          me.game.world.addChild(gameObject, obj.props.z);
        }

      }
    },

    /**
     * callback when everything is loaded
     */
    loaded : function () {
      var objects = game.initObjectArray();
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

      me.pool.register("Tree2", game.TreeEntity);
      this._spawn(objects);

      // enable the keyboard
      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");
      me.input.bindKey(me.input.KEY.UP, "up");
      me.input.bindKey(me.input.KEY.DOWN, "down");

      // start the game
      me.state.change(me.state.PLAY);
    }

};
