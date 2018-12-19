import p5, {Vector} from 'p5'

export const ComponentTypes = {
    VERTEX: Symbol('VERTEX'),
    EDGE:   Symbol('EDGE'),
    FACE:   Symbol('FACE'),
}
Object.freeze(ComponentTypes)

class Face {
    constructor(firstEdge, label = "") {
        this.firstEdge = firstEdge
        this.label = ""
    }

    firstEdge = -1
    label = ""
}

class Edge {
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
        this._index = index
        this._mesh = mesh
    }

    vertices() {
        if (!this._vertices) {
            const index = this._index
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

    normal() {
        const [v1, v2] = this.vertices()
        const direction = Vector.sub(v2, v1)
        return (new Vector(direction.y, -direction.x)).normalize()
    }

    _index = -1
    _mesh = null
    _vertices = null
}

export default class Mesh {
    addUnconnected(vertex1, vertex2, vertex3) {
        const newVertices = [vertex1, vertex2, vertex3]
        const v1 = p5.Vector.sub(vertex2, vertex1)
        const v2 = p5.Vector.sub(vertex3, vertex2)
        const orientation = p5.Vector.cross(v1, v2)
        if (orientation.z > 0) {
            console.log('reverse')
            newVertices.reverse()
        }

        const vertices = this._vertices
        const vertexOffset = vertices.length
        this._vertices = vertices.concat(newVertices)

        const edges = this._edges
        const edgeOffset = edges.length
        this._edges = edges.concat([
            new Edge(edgeOffset + 1, vertexOffset + 1),
            new Edge(edgeOffset + 2, vertexOffset + 2),
            new Edge(edgeOffset + 0, vertexOffset + 0),
        ])
        this._faces.push(new Face(edgeOffset))
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

    _faces = []
    _edges = []
    _vertices = []
}