import Vector from "./Vector"
import Mesh, {Edge, Face} from './Mesh'

export function addUnconnected(mesh, vertex1, vertex2, vertex3) {
    const additionalVertices = [vertex1, vertex2, vertex3]
    const v1 = Vector.sub(vertex2, vertex1)
    const v2 = Vector.sub(vertex3, vertex2)
    const orientation = Vector.cross(v1, v2)
    if (orientation.z > 0) {
        console.log('reverse')
        additionalVertices.reverse()
    }

    const vertices = mesh._vertices
    const vertexOffset = vertices.length
    const newVertices = [...vertices, ...additionalVertices]

    const edges = mesh._edges
    const edgeOffset = edges.length
    const newEdges = [
        ...edges,
        new Edge(edgeOffset + 1, vertexOffset + 1),
        new Edge(edgeOffset + 2, vertexOffset + 2),
        new Edge(edgeOffset + 0, vertexOffset + 0),
    ]
    const newFaces = [...mesh._faces, new Face(edgeOffset)]
    const newMesh = new Mesh(newVertices, newEdges, newFaces)

    console.log(newMesh)

    return () => newMesh
}
