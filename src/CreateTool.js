import {ComponentTypes} from "./mesh/Mesh"
import {addUnconnected} from "./mesh/operations"
import Vector from './mesh/Vector'

export default class CreateTool {
    constructor(mesh) {
        this._mesh = mesh
        this.reset()
    }

    canSelect(component) {
        const {newVertices} = this._selection
        const {type} = component
        switch (type) {
            case ComponentTypes.NONE: {
                return true
            }
            case ComponentTypes.EDGE: {
                if (newVertices.length > 1) {
                    return false
                }
                // only open edges can be used for creation
                if (component.edge.other() !== null) {
                    console.log(component.edge.other())
                    return false
                }
                return true
            }
            default:
                return false
        }
    }

    reset() {
        this._selection = {
            newVertices: [],
            edge: [],
        }
    }

    addSelection(component) {
        const {type, x, y} = component
        const {newVertices} = this._selection
        switch (type) {
            case ComponentTypes.NONE: {
                newVertices.push(new Vector(x, y))
                if (newVertices.length === 3) {
                    const operation = addUnconnected(this._mesh, ...newVertices)
                    this.reset()
                    return operation
                }
                return null
            }
            default:
                return null
        }
    }

    _mesh = null
}
