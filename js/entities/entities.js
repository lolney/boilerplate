game.CharacterEntity = me.Entity.extend({

    init : function (x, y, settings) {
        // call the constructor
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(5, 5);

        this.body.gravity = 0;

        this.renderable.anchorPoint = new me.Vector2d(0.5, 0.5);
    },

    move : function(directions, dt){
        //this.renderable.anchorPoint = new me.Vector2d(0.5, 0.5);

        if(directions.length == 0){
            this.body.vel.x = 0;
            this.body.vel.y = 0;

              // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }
        for(var i = 0; i < directions.length; i++){
            var x = directions[i];
            if(x == 'left'){
                // flip the sprite on horizontal axis
              this.renderable.flipX(true);

              // update the entity velocity
              this.body.vel.x -= this.body.accel.x * me.timer.tick;

              // change to the walking animation
              if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
              }
            }
            else if(x == 'right'){
                // unflip the sprite
              this.renderable.flipX(false);

              // update the entity velocity
              this.body.vel.x += this.body.accel.x * me.timer.tick;

              // change to the walking animation
              if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
              }
            }
            else if(x == 'up'){
                // update the entity velocity
              this.body.vel.y -= this.body.accel.y * me.timer.tick;

              // change to the walking animation
              if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
              }
            }
            else if(x == 'down'){
                // update the entity velocity
              this.body.vel.y += this.body.accel.y * me.timer.tick;

              // change to the walking animation
              if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
              }
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        return this._super(me.Entity, 'update', [dt]);
    },

    /**
    * colision handler
    * (called when colliding with other objects)
    */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }

});

game.NPCEntity = game.CharacterEntity.extend({

    moveTo : function(x,y){
        me.astar.search(this.pos.x,this.pos.y, x,y);
    }
});

/**
 * a player entity
 */
game.PlayerEntity = game.CharacterEntity.extend({
  /**
   * constructor
   */
  init : function (x, y, settings) {
    // call the constructor
    this._super(game.CharacterEntity, 'init', [x, y, settings]);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation("walk",  [0, 1, 2, 3]);

    // define a standing animation (using the first frame)
    this.renderable.addAnimation("stand",  [0]);

    // set the standing animation as default
    this.renderable.setCurrentAnimation("stand");
  },

  /*
   * update the player pos
   */
  update : function (dt) {
    var directions = [];
    if(me.input.isKeyPressed('right') || me.input.isKeyPressed('left') ||
        me.input.isKeyPressed('up') || me.input.isKeyPressed('down')){
        if (me.input.isKeyPressed('left')) {
          directions.push('left');
        }
        else if(me.input.isKeyPressed('right')){
          directions.push('right');
        }

        if (me.input.isKeyPressed('up')) {
          directions.push('up');
          
        }
        else if (me.input.isKeyPressed('down')){
            directions.push('down');
        }
    }

    var moved = this.move(directions, dt);

    // return true if we moved or if the renderable was updated
    return (moved || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

});