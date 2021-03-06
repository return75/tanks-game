let plate = {
    position: null,
    width: 2,
    height: null,
    color: null,
    velocity: null,
    acceleration: vector.create(0, 1),

    create: function (position, velocity, color, height) {
        let object = Object.create(this)
        object.setPosition(position)
        object.setColor(color)
        object.setVelocity(velocity)
        object.setHeight(height)
        return object
    },
    setPosition: function (position) {
        this.position = position
    },
    getPosition: function () {
        return this.position
    },
    getHeight: function () {
        return this.height
    },
    setHeight: function (height) {
        this.height = height
    },
    setColor: function (color) {
        this.color = color
    },
    getColor: function () {
        return this.color
    },
    setVelocity: function (velocity) {
        this.velocity = velocity
    },
    getVelocity: function () {
        return this.velocity
    },
    setAcceleration: function (acceleration) {
        this.acceleration = acceleration
    },
    getAcceleration: function () {
        return this.acceleration
    },
}
