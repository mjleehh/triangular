import {Vector} from 'p5'
import {ComponentTypes} from "../mesh/Mesh"

const VERTEX_SIZE      = 16
const EDGE_SIZE        = 8
const TRIANGLE_COLOR   = '#598ee0'
const EDGE_COLOR       = '#78e281'
const VERTEX_COLOR     = '#bf8ece'

export default class HighlightPainter {
    constructor(canvas) {
        this._canvas = canvas
    }

    paint(component) {
        const {type} = component
        console.log(type)
        switch (type) {
            case ComponentTypes.FACE: {
                this.paintTriangle(component.face)
                break
            }
            case ComponentTypes.EDGE: {
                this.paintEdge(component.edge)
                break
            }
            case ComponentTypes.VERTEX: {
                this.paintVertex(component.vertex)
                break
            }
            case ComponentTypes.NONE: {
                break
            }
            default:
                throw 'bad component type'
        }
    }

    paintTriangle(face) {
        const s = this._canvas
        s.fill(TRIANGLE_COLOR)
        const vertices = []
        for (let vertex of face.vertices()) {
            vertices.push(vertex.x)
            vertices.push(vertex.y)
        }
        s.triangle(...vertices)
    }

    paintEdge(edge) {
        const s = this._canvas
        s.stroke(EDGE_COLOR)
        s.strokeWeight(EDGE_SIZE)
        const [v1, v2] = edge.vertices()
        s.line(v1.x, v1.y, v2.x, v2.y)
    }

    paintVertex(vertex) {
        const s = this._canvas
        console.log(vertex)
        s.noStroke()
        s.fill(VERTEX_COLOR)
        s.ellipse(vertex.x, vertex.y, VERTEX_SIZE)
    }
}
