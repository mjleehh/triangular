import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import Mesh from './Mesh'
import HitmapPainter from './HitmapPainter'
import Painter from './Painter'
import HighlightPainter from "./HighlightPainter"

import './style.scss'


const mesh = new Mesh()
let vertexAcc = []

let hp
let rp
let lp
let hitmap
let render
let hover

new p5((s) => {
    s.setup = () => {
        s.frameRate(5)

        //const hitmap = s.createCanvas(window.innerWidth, window.innerHeight)
        const canvas = s.createCanvas(1280, 480)
        canvas.addClass('main-area')
        hitmap = s.createGraphics(640, 480)
        render = s.createGraphics(640, 480)
        hp = new HitmapPainter(mesh)
        rp = new Painter(mesh)
        lp = new HighlightPainter(mesh)
    }

    s.mouseMoved = () => {
        const hitColor = s.get(s.mouseX, s.mouseY)
        const hitElement = hp.element(hitColor)
        if (hitElement !== null) {
            console.log(hitElement)
        }
        hover = hitElement
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
        hitmap.background(0)
        render.background('white')

        hp.paintTriangles(hitmap)
        hp.paintEdges(hitmap)
        hp.paintVertices(hitmap)
        rp.paintTriangles(render)
        rp.paintEdges(render)
        rp.paintVertices(render)
        if (hover) {
            lp.paint(render, hover)
        }

        s.image(hitmap, 0, 0)
        s.image(render, 640, 0)
    }
})