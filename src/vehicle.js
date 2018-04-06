import * as three from 'three'

const maxSpeed = 0.01
const maxForce = 0.0001

export default class Vehicle {
    constructor() {
        this.position = new three.Vector3()
        this.velocity = new three.Vector3()
        this.panic = 0;
    }

    startPanic() {
        this.panic = 1
    }

    seek(target) {
        const desiredPosition = target.clone().sub(this.position).clampLength(0, maxSpeed)
        return desiredPosition.sub(this.velocity).clampLength(0, maxForce)
    }

    flee(target) {
        return this.velocity.clone().setLength(this.panic * maxForce * 10)
    }

    update(target, mouse) {
        const seekForce = this.seek(target)
        const fleeForce = this.flee(mouse)

        this.velocity.add(seekForce).add(fleeForce)
        this.velocity.clampLength(0, (1 + this.panic) * maxSpeed)
        this.position.add(this.velocity)

        this.panic = Math.max(this.panic - 0.05, 0)
    }
}