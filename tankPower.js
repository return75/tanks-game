let tankPower = {
    power: null,
    player: null,
    position: null,
    direction: 'down',
    height: 100,
    width: 20,
    create: function (position, power, player) {
        let object = Object.create(this);
        object.setPlayer(player);
        object.setPower(power);
        object.setPosition(position);
        return object;
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
    getPlayer () {
        return this.player;
    },
    setPosition (position) {
        this.position = position;
    },
    getPosition () {
        return this.position;
    },

    setDirection (direction) {
        this.direction = direction;
    },
    getDirection (direction) {
        return this.direction;
    }
};
