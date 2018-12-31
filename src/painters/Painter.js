import {Vector} from 'p5'
import {colorToValue, valueToColor} from "../Color"
import {ComponentTypes} from "../mesh/Mesh"

const VERTEX_SIZE      = 3
const EDGE_SIZE        = 2
const TRIANGLE_COLOR   = '#3e5f93'
const EDGE_COLOR       = '#47774b'
const VERTEX_COLOR     = '#7f5d89'

export default class Painter {
    constructor(canvas) {
        this._canvas = canvas
    }

    paint(mesh) {
        this._canvas.background('white')
        this.paintTriangles(mesh)
        this.paintEdges(mesh)
        this.paintVertices(mesh)
    }

    paintTriangles(mesh) {
        const s = this._canvas
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

    paintEdges(mesh) {
        const s = this._canvas
        s.strokeWeight(EDGE_SIZE)
        for (let edge of mesh.edges()) {
            s.stroke(EDGE_COLOR)
            const [v1, v2] = edge.vertices()
            s.line(v1.x, v1.y, v2.x, v2.y)
        }
    }


    paintVertices(mesh) {
        const s = this._canvas
        s.noStroke()
        for (let vertex of mesh.vertices()) {
            s.fill(VERTEX_COLOR)
            s.ellipse(vertex.x, vertex.y, VERTEX_SIZE)
        }
    }
}