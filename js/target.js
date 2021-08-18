let target = {
    position: null,
    velocity: null,
    create: function (position, velocity) {
        let objcet = Object.create(this)
        objcet.setPosition(position)
        objcet.setVelocity(velocity)
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
    getVelocity () {
        return this.velocity
    }
}
