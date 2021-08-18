let ball = {
    position: null,
    velocity: null,
    player: null,
    create: function (position, velocity, player) {
        let objcet = Object.create(this)
        objcet.setPosition (position)
        objcet.setVelocity (velocity)
        objcet.setPlayer (player)
        return objcet
    },
    setPosition: function (position) {
        this.position = position
    },
    getPosition: function (position) {
        return this.position
    },
    setVelocity: function (velocity) {
        this.velocity = velocity
    },
    setPlayer: function (player) {
        this.player = player
    },
    getPlayer: function (player) {
        return this.player
    },
    getVelocity () {
        return this.velocity
    }
}
