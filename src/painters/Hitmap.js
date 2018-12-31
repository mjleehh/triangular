import ColorIter from '../ColorIter'
import {Vector} from 'p5'
import {colorToValue, valueToColor} from "../Color"
import {ComponentTypes} from "../mesh/Mesh"

const VERTEX_SIZE      = 20
const EDGES_OFFSET     = 0x000fff
const FACES_OFFSET     = 0x00ff00
const VERTICES_OFFSET  = 0xff0000

export default class Hitmap {
    /**
     * the mesh is part of the hitmap painter's state
     */
    constructor(mesh, canvas) {
        this._mesh = mesh
        this._canvas = canvas
    }

    paint() {
        this._canvas.background(0)
        this.paintTriangles()
        this.paintEdges()
        this.paintVertices()
    }

    paintTriangles() {
        const mesh = this._mesh
        const s = this._canvas

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

    paintEdges() {
        const mesh = this._mesh
        const s = this._canvas

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

    paintVertices() {
        const mesh = this._mesh
        const s = this._canvas

        s.noStroke()
        const color = ColorIter(VERTICES_OFFSET)
        for (let vertex of mesh.vertices()) {
            const c = color.next().value
            s.fill(s.color(...c))
            s.ellipse(vertex.x, vertex.y, VERTEX_SIZE)
        }
    }

    get(x, y) {
        const colorValue = this._canvas.get(x, y)
        try {
            const mesh = this._mesh
            const value = colorToValue(...colorValue)
            if (value >= VERTICES_OFFSET) {
                const index = value - VERTICES_OFFSET
                return {
                    type: ComponentTypes.VERTEX,
                    vertex: mesh.vertex(index),
                    x,
                    y,
                }
            } else if (value >= FACES_OFFSET) {
                const index = value - FACES_OFFSET
                return {
                    type: ComponentTypes.FACE,
                    face: mesh.face(index),
                    x,
                    y,
                }
            } else if (value >= EDGES_OFFSET) {
                const index = value - EDGES_OFFSET
                return {
                    type: ComponentTypes.EDGE,
                    edge: mesh.edge(index),
                    x,
                    y,
                }
            } else {
                return {
                    type: ComponentTypes.NONE,
                    x,
                    y,
                }
            }
        } catch (e) {}
        return null
    }

    _mesh = null
    _canvas = null
}