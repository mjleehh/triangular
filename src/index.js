import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import App from "./App"
import './style.scss'

const app = new App()

new p5((s) => {
    s.setup = () => {
        app.setup(s)
    }

    s.mouseMoved = () => {
        app.mouseMove(s.mouseX, s.mouseY)
    }

    s.mouseClicked = () => {
        app.mouseClicked(s.mouseX, s.mouseY)
    }

    s.windowResized = () => {
        // dont't rescale the test setup
        // s.resizeCanvas(window.innerWidth, innerHeight)
    }

    s.draw = () => {
        app.paint(s)
    }
})
