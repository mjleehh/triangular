import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import Mesh from './Mesh'
import HitmapPainter from './HitmapPainter'

import './style.scss'

const mesh = new Mesh()
let vertexAcc = []

let hp

new p5((s) => {
    s.setup = () => {
        s.frameRate(5)

        const c = s.createCanvas(window.innerWidth, window.innerHeight)
        c.addClass('main-area')
        s.background(0)
        hp = new HitmapPainter(mesh)
    }

    s.mouseMoved = () => {
        const c = s.get(s.mouseX, s.mouseY)
        const e = hp.element(c)
        if (e !== null) {
            console.log(e)
        }
    }

    s.mouseClicked = () => {
        console.log('click')
        vertexAcc.push(s.createVector(s.mouseX, s.mouseY))
        if (vertexAcc.length === 3) {
            mesh.addUnconnected(...vertexAcc)
            vertexAcc = []
        }
    }

    s.windowResized = () => {
        s.resizeCanvas(window.innerWidth, innerHeight)
    }

    s.draw = () => {
        s.background(0)
        hp.paintTriangles(s)
        hp.paintEdges(s)
        hp.paintVertices(s)
    }
})