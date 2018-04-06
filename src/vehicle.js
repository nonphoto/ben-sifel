import * as three from 'three'

const maxSpeed = 0.01
const maxForce = 0.0001

export default class Vehicle {
    constructor() {
        this.position = new three.Vector3()
        this.velocity = new three.Vector3()
        this.panic = 0;
    }

    get inversePanic() {
        return 1 - this.panic
    }

    seek(target) {
        const desiredPosition = target.clone().sub(this.position).clampLength(0, maxSpeed)
        return desiredPosition.sub(this.velocity).clampLength(0, maxForce)
    }

    flee(target) {
        const desiredPosition = this.position.clone().sub(target)

        if (desiredPosition.length() < 0.1) {
            this.panic = 1
        }

        return desiredPosition.sub(this.velocity).setLength(maxForce * 10)
    }

    update(target, mouse) {
        const seekForce = this.seek(target).multiplyScalar(this.inversePanic)
        const fleeForce = this.flee(mouse).multiplyScalar(this.panic)

        const speed = (this.inversePanic + (2 * this.panic)) * maxSpeed
        this.velocity.add(seekForce).add(fleeForce)
        this.velocity.clampLength(0, speed)
        this.position.add(this.velocity)

        this.panic = Math.max(this.panic - 0.01, 0)
    }
}