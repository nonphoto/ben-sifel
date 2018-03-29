import * as three from 'three'

const maxSpeed = 0.01
const maxForce = 0.0001

export default class Vehicle {
    constructor() {
        this.position = new three.Vector3()
        this.velocity = new three.Vector3()
        this.acceleration = new three.Vector3()
    }

    seek(target) {
        const desiredPosition = target.clone().sub(this.position).clampLength(0, maxSpeed)
        const steer = desiredPosition.sub(this.velocity).clampLength(0, maxForce)
        this.applyForce(steer)
    }

    applyForce(force) {
        this.acceleration.add(force.clone())
    }

    update() {
        this.velocity.add(this.acceleration)
        this.velocity.clampLength(0, maxSpeed)
        this.position.add(this.velocity)
        this.acceleration.multiplyScalar(0)
    }
}