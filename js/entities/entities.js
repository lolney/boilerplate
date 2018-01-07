game.CharacterEntity = me.Entity.extend({

    init : function (x, y, settings) {
        // call the constructor
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal & vertical speed (accel vector)
        this.body.gravity = 0;
        this.body.setVelocity(4, 7);
        
    },

    nearestNeighbor : function(){
        // Solve for current square in quadtree
        // When solved, check vs. distance to 
        // closest point on each boundary line;
        // If closer, try again in adjoining square
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

    init : function (x, y, settings) {
        // call the constructor
        this._super(game.CharacterEntity, 'init', [x, y, settings]);

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 1, 2, 3]);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        // Not awaiting path from webworker
        this.awaiting = false;
        this.listenerAdded = false;
        // set movement queue
        this.moveQueue = [];
    },

    chooseRandomPoint : function(){
        var oldy = this.pos.y; var oldx = this.pos.x;
        var x; var y;
        var respobj = new me.collision.ResponseObject();

        // Choose a point we can actually reach
        do {
            var point = game.chooseRandomPoint();
            
            this.pos.x = point[0]; this.pos.y = point[1];
            console.log(point);
            
            var collides = me.collision.check(this, respobj)
           
        } while(respobj.aInB || respobj.bInA || collides);

        this.pos.y = oldy; this.pos.x = oldx;
        
        return [x,y]
    },

    /**
     * select a random destination on the map
     */
    selectDestination : function(){
        // Have to consider effects of having multiple NPCs 
        // (and therefore multiple listeners) at once
        if(!this.listenerAdded){
            me.pathFinding.addListener((e) => {
                var object = e.data;
                // TODO: Do the filtering on the pathfinding end?
                this.moveQueue = object.data.filter((x) => {return Math.random() < .1;}).reverse();
                console.log(this.moveQueue);
                this.awaiting = false;
            });
            this.listenerAdded = true;
        }

        point = this.chooseRandomPoint();
        var message = {
            name: "findPath",
            data: {initialPosition:{
                x:this.pos.x,y:this.pos.y},
                endPosition: {x:point[0], y:point[1]},
                zLevel: 0,
                offset: 0
            }
        };
        this.awaiting = true;
        me.pathFinding.postMessage(message);
    },

    /**
    *   Move along the path provided by the pathfinder
    */
    update : function(dt){
        directions = [];
        if(this.moveQueue.length > 0){
            next = this.moveQueue.pop();
            // Choose direction in which to move
            if(next[0] > this.pos.x){
                directions.push('right')
            } else if(next[0] < this.pos.x){
                directions.push('left')
            }
            if(next[1] > this.pos.y){
                directions.push('down')
            } else if(next[1] < this.pos.y){
                directions.push('up')
            }
            console.log(next, this.pos, directions);
            this.move(directions, dt);

            // tolerance
            var d = 5;
            // Find out if we moved enough yet
            for(var i = 0; i < directions.length; i++){
                var x = directions[i];
                if(x == 'right'){
                    if(next[0] - d > this.pos.x){
                        this.moveQueue.push(next);
                        break;
                    }
                } 
                else if(x == 'left'){
                    if(next[0] + d < this.pos.x){
                        this.moveQueue.push(next);
                        break;
                    }
                }
                else if(x == 'down'){
                    if(next[1] - d > this.pos.y){
                        this.moveQueue.push(next);
                        break;
                    } 
                }
                else if(x == 'up'){
                    if(next[1] + d < this.pos.y){
                        this.moveQueue.push(next);
                        break;
                    }
                }
            }
        }
        else{
            if(!this.awaiting) {
                this.selectDestination();
            }
        }

        return true;
    }
});

game.RockEntity = me.Entity.extend({

    init : function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },

    update : function(){
        return false;
    }
});

game.TreeEntity = me.Entity.extend({

    init : function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // define a basic chopping animation (using all frames)
        this.renderable.addAnimation("chop",  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 100);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("chop");

        this.dt = 0;

        // Particles
        var image = me.loader.getImage('log_particle');
        var emitter = new me.ParticleEmitter(784, 2624, {
            image: image,
            width: 32,
            height: 32,
            minLife: 1000,
            maxLife: 3000,
            totalParticles: 300,
            angleVariation: 0.3490658503988659,
            frequency: 50
        });
        emitter.name = 'wood';
        emitter.pos.z = 2;
        me.game.world.addChild(emitter);
        emitter.streamParticles();
    },

    update : function(dt){
        var frame = this.renderable.getCurrentAnimationFrame();
        this.dt = dt + this.dt;
        if (this.dt > 200) {
          this.renderable.setAnimationFrame(frame+1);
          this.dt = 0;
        }
        return true;
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