import {ComponentTypes} from "./mesh/Mesh"
import {Vector} from 'p5'

export default class AppendTool {
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
        }
    }

    addSelection(component) {
        const {type, x, y} = component
        const {newVertices} = this._selection
        switch (type) {
            case ComponentTypes.NONE: {
                newVertices.push(new Vector(x, y))
                if (newVertices.length === 3) {
                    this._mesh.addUnconnected(...newVertices)
                    this.reset()
                }
            }
        }
    }

    _mesh = null
}
