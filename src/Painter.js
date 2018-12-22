import {Vector} from 'p5'
import {colorToValue, valueToColor} from "./Color"
import {ComponentTypes} from "./Mesh"

const VERTEX_SIZE      = 3
const EDGE_SIZE        = 2
const TRIANGLE_COLOR   = '#3e5f93'
const EDGE_COLOR       = '#47774b'
const VERTEX_COLOR     = '#7f5d89'

export default class Painter {
    constructor(mesh) {
        this._mesh = mesh
    }

    paintTriangles(s) {
        const mesh = this._mesh

        s.noStroke()
        for (let face of mesh.faces()) {
            s.fill(TRIANGLE_COLOR)
            const vertices = []
            for (let vertex of face.vertices()) {
                vertices.push(vertex.x)
                vertices.push(vertex.y)
            }
            s.triangle(...vertices)
        }
    }

    paintEdges(s) {
        const mesh = this._mesh

        s.strokeWeight(EDGE_SIZE)
        for (let edge of mesh.edges()) {
            s.stroke(EDGE_COLOR)
            const [v1, v2] = edge.vertices()
            s.line(v1.x, v1.y, v2.x, v2.y)
        }
    }

    paintVertices(s) {
        const mesh = this._mesh

        s.noStroke()
        for (let vertex of mesh.vertices()) {
            s.fill(VERTEX_COLOR)
            s.ellipse(vertex.x, vertex.y, VERTEX_SIZE)
        }
    }

    element(colorValue) {
        try {
            const mesh = this._mesh
            const value = colorToValue(...colorValue)
            console.log(value, colorValue, valueToColor(value))
            if (value >= VERTICES_OFFSET) {
                const index = value - VERTICES_OFFSET
                return {
                    type: ComponentTypes.VERTEX,
                    vertex: mesh.vertex(index),
                }
            } else if (value >= FACES_OFFSET) {
                const index = value - FACES_OFFSET
                return {
                    type: ComponentTypes.FACE,
                    face: mesh.face(index),
                }
            } else if (value >= EDGES_OFFSET) {
                const index = value - EDGES_OFFSET
                return {
                    type: ComponentTypes.EDGE,
                    edge: mesh.edge(index),
                }
            }
        } catch (e) {}
        return null
    }

    _mesh = null
}