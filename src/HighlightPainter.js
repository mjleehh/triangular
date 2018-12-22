import ColorIter from './ColorIter'
import {Vector} from 'p5'
import {colorToValue, valueToColor} from "./Color"
import {ComponentTypes} from "./Mesh"

const VERTEX_SIZE      = 8
const EDGE_SIZE        = 8
const TRIANGLE_COLOR   = '#598ee0'
const EDGE_COLOR       = '#78e281'
const VERTEX_COLOR     = '#bf8ece'

export default class HighlightPainter {
    constructor(mesh) {
        this._mesh = mesh
    }

    paint(s, component) {
        const {type} = component
        switch (type) {
            case ComponentTypes.FACE: {
                HighlightPainter.paintTriangle(s, component.face)
                break
            }
            case ComponentTypes.EDGE: {
                HighlightPainter.paintEdge(s, component.edge)
                break
            }
            case ComponentTypes.VERTEX: {
                HighlightPainter.paintVertex(s, component.vertex)
                break
            }
            default:
                throw 'bad component type'
        }
    }

    static paintTriangle(s, face) {
        s.fill(TRIANGLE_COLOR)
        const vertices = []
        for (let vertex of face.vertices()) {
            vertices.push(vertex.x)
            vertices.push(vertex.y)
        }
        s.triangle(...vertices)
    }

    static paintEdge(s, edge) {
        s.stroke(EDGE_COLOR)
        s.strokeWeight(EDGE_SIZE)
        const [v1, v2] = edge.vertices()
        s.line(v1.x, v1.y, v2.x, v2.y)
    }

    static paintVertex(s, vertex) {
        s.noStroke()
        s.fill(VERTEX_COLOR)
        s.ellipse(vertex.x, vertex.y, VERTEX_SIZE)
    }

    _mesh = null
}