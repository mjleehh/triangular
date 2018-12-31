import Mesh from "./mesh/Mesh"
import Hitmap from "./painters/Hitmap"
import HighlightPainter from "./painters/HighlightPainter"
import CreateTool from "./CreateTool"
import Painter from "./painters/Painter"

const STORAGE_KEY = 'TRIANGLE_PAINTER_STORED_MESH'

function loadMesh() {
    try {
        const storedMesh = localStorage.getItem(STORAGE_KEY)
        if (!storedMesh) {
            return null
        }
        return Mesh.fromJson(storedMesh)
    } catch (e) {
        return null
    }
}

function saveMesh(mesh) {
    localStorage.setItem(STORAGE_KEY, mesh.toJson())
}

export default class App {
    setup(s) {
        this._s = s
        this.mesh = loadMesh()
        if (!this.mesh) {
            this.mesh = new Mesh()
        }

        const canvas = s.createCanvas(1280, 480)
        canvas.addClass('main-area')
        this._renderCanvas = s.createGraphics(640, 480)
        this._painter = new Painter(this._renderCanvas)
        this._highlightPainter = new HighlightPainter(this._renderCanvas)
        this._hitmapCanvas = s.createGraphics(640, 480)
        this.updateHitmap()
        this.activeTool = new CreateTool(this.mesh)
    }

    paint() {
        const {mesh, hover} = this
        this._painter.paint(mesh)
        if (hover) {
            this._highlightPainter.paint(hover)
        }
        this._s.image(this._renderCanvas, 640, 0)
    }

    mouseMove(x, y) {
        const hitElement = this._hitmap.get(x, y)
        if (hitElement === null) {
            console.warn('invalid hit')
            return
        }

        if (this.activeTool.canSelect(hitElement)) {
            this.hover = hitElement
            return
        }

        this.hover = null
    }

    mouseClicked(x, y) {
        const hitElement = this._hitmap.get(x, y)
        if (hitElement === null) {
            console.warn('invalid hit')
            return
        }
        const operation = this.activeTool.addSelection(hitElement)
        if (operation) {
            this.updateMesh(operation)
        }
    }

    updateMesh(operation) {
        const mesh = operation()
        saveMesh(mesh)
        this.mesh = mesh
        this.updateHitmap()
    }

    updateHitmap() {
        this._hitmap = new Hitmap(this.mesh, this._hitmapCanvas)
        this._hitmap.paint()
        this._s.image(this._hitmapCanvas, 0, 0)
    }

    mesh = null
    hover = null
    activeTool = null

    _renderCanvas = null
    _hitmapCanvas = null
    _highlightPainter = null
    _painter = null
    _hitmap = null

    _s = null
}