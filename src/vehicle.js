import * as three from 'three'

const maxSpeed = 0.01
const maxForce = 0.0001

export default class Vehicle {
    constructor() {
        this.position = new three.Vector3()
        this.velocity = new three.Vector3()
    }

    seek(target) {
        const desiredPosition = target.clone().sub(this.position).clampLength(0, maxSpeed)
        return desiredPosition.sub(this.velocity).clampLength(0, maxForce)
    }

    update(target, mouse) {
        const seekForce = this.seek(target)

        this.velocity.add(seekForce)
        this.velocity.clampLength(0, maxSpeed)
        this.position.add(this.velocity)
    }
}