var ButtonState = {
    IDLE: 'idle',
    DOWN: 'down',
    PRESSED: 'pressed',
    UP: 'up',
    SCROLLED: 'scrolled'
}

var input = {
    keys: [],
    mouseButtons: [],
    mouseX: 0,
    mouseY: 0,
    mouseDX: 0,
    mouseDY: 0,
    mouseDW: 0,
    lastMouseX: 0,
    lastMouseY: 0
}

class Input
{
    constructor()
    {
        this.#InitInput();
    }

    #HandleKeyDown = function(event) { input.keys[event.keyCode] = ButtonState.DOWN; }
    #HandleKeyUp = function(event) { input.keys[event.keyCode] = ButtonState.UP; }
    #HandleMouseUp = function(event) { input.mouseButtons[event.button] = ButtonState.UP; }
    #HandleMouseDown = function(event)
    {
        input.mouseButtons[event.button] = ButtonState.DOWN;
        input.lastMouseX = event.clientX;
        input.lastMouseY = event.clientY;
    }
    #HandleMouseMove = function(event)
    {
        var mousex = event.clientX;
        var mousey = event.clientY;
        input.mouseDX = mousex - input.lastMouseX;
        input.mouseDY = mousey - input.lastMouseY;
        input.lastMouseX = mousex;
        input.lastMouseY = mousey;
    }

    #HandleMouseWheel = function(event)
    {
        input.mouseButtons[event.button] = ButtonState.SCROLLED;
        input.mouseDW = event.deltaY;
    }

    #InitInput = function()
    {
        for(var i = 0; i < 300; ++i) { input.keys[i] = ButtonState.IDLE; }
        for(var i = 0; i < 10; ++i) { input.mouseButtons[i] = ButtonState.IDLE; }

        document.onkeydown = this.#HandleKeyDown;
        document.onkeyup = this.#HandleKeyUp;
        document.onmousedown = this.#HandleMouseDown;
        document.onmouseup = this.#HandleMouseUp;
        document.onmousemove = this.#HandleMouseMove;
        document.onwheel = this.#HandleMouseWheel;
    }
}