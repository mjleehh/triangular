import Vector from './Vector'
import _ from 'lodash'


export const ComponentTypes = {
    VERTEX: Symbol('VERTEX'),
    EDGE:   Symbol('EDGE'),
    FACE:   Symbol('FACE'),
    NONE:   Symbol('NONE'),

}
Object.freeze(ComponentTypes)

export class Face {
    constructor(firstEdge, label = "") {
        this.firstEdge = firstEdge
        this.label = ""
    }

    firstEdge = -1
    label = ""
}

export class Edge {
    constructor(next, vertex, other = -1) {
        this.next = next
        this.vertex = vertex
        this.other = other
    }

    next = -1
    other = -1
    vertex = -1
}

class FaceProxy {
    constructor(index, mesh) {
        this._index = index
        this._mesh = mesh
    }

    vertices() {
        const face = this._mesh._faces[this._index]
        const vertices = this._mesh._vertices
        const edges = this._mesh._edges

        const faceVertices = new Array(3)
        let edge = edges[face.firstEdge]
        for (let i = 1; i <= 3; ++i) {
            faceVertices[i % 3] = vertices[edge.vertex]
            edge = edges[edge.next]
        }
        return faceVertices
    }

    _index = -1
    _mesh = null
}

class EdgeProxy {
    constructor(index, mesh) {
        this.index = index
        this._mesh = mesh
    }

    vertices() {
        if (!this._vertices) {
            const {index} = this
            const edges = this._mesh._edges
            const edge = edges[index]
            const nextNext = edges[edges[edge.next].next]
            if (nextNext.next !== index) {
                throw 'degenerate polygon'
            }
            const vertices = this._mesh._vertices
            this._vertices = [vertices[nextNext.vertex], vertices[edge.vertex]]
        }
        // cache the value
        return this._vertices
    }

    other() {
        const {other} = this._mesh._edges[this.index]
        if (other >= 0) {
            return new EdgeProxy(other)
        }
        return null
    }

    normal() {
        const [v1, v2] = this.vertices()
        const direction = Vector.sub(v2, v1)
        return (new Vector(direction.y, -direction.x)).normalize()
    }

    index = -1
    _mesh = null
    _vertices = null
}

export default class Mesh {
    constructor(vertices = [], edges = [], faces = []) {
        if (!_.isArray(vertices)) {
            throw 'invalid mesh vertices'
        }
        if (!_.isArray(edges)) {
            throw 'invalid mesh edges'
        }
        if (!_.isArray(faces)) {
            throw 'invalid mesh faces'
        }

        this._vertices = vertices
        this._edges = edges
        this._faces = faces
    }

    face(index) {
        if (index >= this._faces.length) {
            throw 'face index out of range'
        }
        return new FaceProxy(index, this)
    }

    faces() {
        const mesh = this
        return function* () {
            for (let faceIndex = 0; faceIndex < mesh._faces.length; ++faceIndex) {
                yield new FaceProxy(faceIndex, mesh)
            }
        }()
    }

    edge(index) {
        if (index >= this._edges.length) {
            throw 'edge index out of range'
        }
        return new EdgeProxy(index, this)
    }

    edges() {
        const mesh = this
        return function*() {
            for (let edgeIndex = 0; edgeIndex < mesh._edges.length; ++edgeIndex) {
                yield new EdgeProxy(edgeIndex, mesh)
            }
        }()
    }

    vertex(index) {
        if (index >= this._vertices.length) {
            throw 'vertex index out of range'
        }
        return this._vertices[index]
    }

    vertices() {
        return this._vertices
    }

    isEmpty() {
        return _faces.length < 1
    }

    static fromJson(json) {
        const {vertices, edges, faces} = JSON.parse(json)
        const vectors = vertices.map(e => new Vector(e.x, e.y))
        return new Mesh(vectors, edges, faces)
    }

    toJson() {
        return JSON.stringify({
            vertices: this._vertices,
            edges: this._edges,
            faces: this._faces,
        })
    }

    _faces = []
    _edges = []
    _vertices = []
}