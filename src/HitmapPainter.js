import ColorIter from './ColorIter'
import {Vector} from 'p5'
import {colorToValue, valueToColor} from "./Color"
import {ComponentTypes} from "./Mesh"

const VERTEX_SIZE      = 20
const EDGES_OFFSET     = 0x000fff
const FACES_OFFSET     = 0x00ff00
const VERTICES_OFFSET  = 0xff0000

export default class HitmapPainter {
    constructor(mesh) {
        this._mesh = mesh
    }

    paintTriangles(s) {
        const mesh = this._mesh

        s.noStroke()
        const color = ColorIter(FACES_OFFSET)
        for (let face of mesh.faces()) {
            const c = color.next().value
            s.fill(s.color(...c))
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

        s.strokeWeight(Math.floor(VERTEX_SIZE / 2))
        const color = ColorIter(EDGES_OFFSET)
        for (let edge of mesh.edges()) {
            const c = color.next().value
            s.stroke(c)
            const [v1, v2] = edge.vertices().map(v => v.copy())
            const offset = edge.normal().mult(VERTEX_SIZE / 8)
            v1.add(offset)
            v2.add(offset)
            s.line(v1.x, v1.y, v2.x, v2.y)
        }
    }

    paintVertices(s) {
        const mesh = this._mesh

        s.noStroke()
        const color = ColorIter(VERTICES_OFFSET)
        for (let vertex of mesh.vertices()) {
            const c = color.next().value
            s.fill(s.color(...c))
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