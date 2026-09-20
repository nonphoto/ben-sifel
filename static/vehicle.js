import * as three from 'three'

const maxSpeed = 0.01
const maxForce = 0.0001
const dtConstant = 1000 / 60

export default class Vehicle {
    constructor() {
        this.position = new three.Vector3()
        this.velocity = new three.Vector3()
        this.progress = 0
    }

    seek(target) {
        const desiredPosition = target.clone().sub(this.position).clampLength(0, maxSpeed)
        return desiredPosition.sub(this.velocity).clampLength(0, maxForce)
    }

    update(target, dt) {
        const dtFactor = dt / dtConstant
        this.velocity.add(this.seek(target).clone().multiplyScalar(dtFactor))
        this.velocity.clampLength(0, maxSpeed)
        this.position.add(this.velocity.clone().multiplyScalar(dtFactor))
        this.progress += this.velocity.length() * dtFactor
    }
}
