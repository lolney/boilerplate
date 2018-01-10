game.initObjectArray = function(){
  return [
    {
      location: [968.00,2080.00],
      objclass: game.RockEntity,
      props:  {
        gid: null,
        height: 32,
        image: "Rock1",
        name: "Rock1",
        framewidth: 32,
        framewidth: 32,
        type: undefined,
        width: 32,
        z: 2
      }
    },
    {
      location: null,
      objclass: game.RockEntity,
      count: 100,
      props:  {
        gid: null,
        height: 32,
        image: "Rock2",
        name: "Rock2",
        framewidth: 32,
        framewidth: 32,
        type: undefined,
        width: 32,
        z: 2
      }
    }
  ]
}