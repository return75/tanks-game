let tank = {
    angle: null,
    position: null,
    power: null,
    player: null,
    create: function (position, angle) {
        let object = Object.create(this);
        object.setAngle(angle);
        object.setPosition(position);
        return object;
    },
    setAngle (angle) {
        this.angle = angle;
    },
    getAngle (angle) {
        return this.angle;
    },
    setPower (power) {
        this.power = power;
    },
    getPower (power) {
        return this.power;
    },
    setPlayer (player) {
        this.player = player;
    },
    getPlayer (player) {
        return this.player;
    },
    setPosition (position) {
        this.position = position;
    },
    getPosition (position) {
        return this.position;
    },

};
