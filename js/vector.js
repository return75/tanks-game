var vector = {
    _x: 1,
    _y: 1,
    create: function (x, y) {
        let object = Object.create (this)
        object.setX (x)
        object.setY (y)
        return object
    },
    add (vector) {
        this._x += vector._x
        this._y += vector._y
    },
    addTo (vector) {
        return vector.create (this._x + vector._x, this._y + vector._y)
    },
    subtract (vector) {
        this._x -= vector._x
        this._y -= vector._y
    },
    multiplyBy (number) {
        return vector.create (this._x * number, this._y * number)
    },
    setX: function (x) {
        this._x = x
    },
    setY: function (y) {
        this._y = y
    },
    getX: function () {
        return this._x
    },
    getY: function () {
        return this._y
    },
    getLength: function () {
        return Math.sqrt(this._x * this._x + this._y * this._y)
    },
    setLength: function (length) {
        let angle = this.getAngle()
        this._x = length * Math.cos(angle)
        this._y = length * Math.sin(angle)

    },
    setAngle: function (angle) {
        let length = this.getLength ()
        this._x = length * Math.cos(angle)
        this._y = length * Math.sin(angle)
    },
    getAngle: function() {
		return Math.atan2(this._y, this._x)
	},
}
