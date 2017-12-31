
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
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

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

      // enable the keyboard
      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");
      me.input.bindKey(me.input.KEY.UP, "up");
      me.input.bindKey(me.input.KEY.DOWN, "down");

      // start the game
      me.state.change(me.state.PLAY);
    }

};
