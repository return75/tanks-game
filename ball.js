let ball = {
    position: null,
    velocity: null,
    player: 1,
    create: function (position, velocity, player = 1) {
        let objcet = Object.create(this);
        objcet.setPosition (position);
        objcet.setVelocity (velocity);
        objcet.setPlayer (player);
        return objcet;
    },
    setPosition: function (position) {
        this.position = position;
    },
    setVelocity: function (velocity) {
        this.velocity = velocity;
    },
    setPlayer: function (player) {
        this.player = player;
    },
    getVelocity () {
        return this.velocity;
    }
}