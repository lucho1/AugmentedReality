//Global variables
var gl;
var renderer;
var DrawMeshes, meshesSize, defShader;

//Input Stuff
var camera = {
    position: [0.0, 0.0, 5.0],
    yaw: 0.0,
    pitch: 0.0
}

var time = { dt: 1.0/0.0, lastTimeMS: 0}
const PI = 3.14159265359
const TWOPI = 6.28318530718
const HALFPI = 1.57079632679
function DEGTORAD(deg) { return PI*deg/180.0; }
function RADTODEG(rad) { return 180.0*rad/PI; }
function mod(val1, val2) { return val1%val2; }
function clamp(val1, min, max) { return val1 < min ? min : (val1 > max ? max : val1); }

function InitTime()
{
    var d = new Date();
    time.lastTimeMS = d.getTime();
}

function ProcessInput()
{
    //https://keycode.info/
    var speed = 20.0;
    var mouse_speed = 50.0;
    
    //Process Keyboard
    if(input.keys[16] == ButtonState.PRESSED) //SHIFT == double speed
        speed *= 2.0;
    if(input.keys[87] == ButtonState.PRESSED) //W
        camera.position[2] -= speed * time.dt;
    if(input.keys[83] == ButtonState.PRESSED) //S
        camera.position[2] += speed * time.dt;
    if(input.keys[65] == ButtonState.PRESSED) //A
        camera.position[0] -= speed * time.dt;
    if(input.keys[68] == ButtonState.PRESSED) //D
        camera.position[0] += speed * time.dt;
    if(input.keys[69] == ButtonState.PRESSED) //E
        camera.position[1] += speed * time.dt;
    if(input.keys[81] == ButtonState.PRESSED) //Q
        camera.position[1] -= speed * time.dt;
    if(input.keys[82] == ButtonState.PRESSED) //R
    {
        camera.position = [0.0, 0.0, 5.0];
        camera.yaw = 0.0;
        camera.pitch = 0.0;
    }

    //Process Mouse
    if(input.mouseButtons[0] == ButtonState.PRESSED) //Rotation
    {
        camera.yaw += input.mouseDX * 0.01;
        camera.yaw = mod(camera.yaw, TWOPI);
        camera.pitch += input.mouseDY * 0.01;
        camera.pitch = clamp(camera.pitch, -HALFPI, HALFPI);
    }
    if(input.mouseButtons[1] == ButtonState.PRESSED) //Pan
    {
        camera.position[0] -= input.mouseDX*time.dt;
        camera.position[1] += input.mouseDY*time.dt;
    }
    if(input.mouseButtons[0] == ButtonState.SCROLLED) //Zoom
    {
        var dir = input.mouseDW/100;
        camera.position[2] += dir * mouse_speed * time.dt;
        input.mouseDW = 0;
    }

    //Auto Transitions
    for(var i = 0; i < 300; ++i)
    {
        if(input.keys[i] == ButtonState.DOWN) input.keys[i] = ButtonState.PRESSED;
        if(input.keys[i] == ButtonState.UP) input.keys[i] = ButtonState.IDLE;
    }
    for(var i = 0; i < 10; ++i)
    {
        if(input.mouseButtons[i] == ButtonState.DOWN) input.mouseButtons[i] = ButtonState.PRESSED;
        if(input.mouseButtons[i] == ButtonState.UP) input.mouseButtons[i] = ButtonState.IDLE;
    }

    input.mouseDX = 0;
    input.mouseDY = 0;
    input.mouseDW = 0;
}


//Draw the Scene
function DrawScene()
{
    //Pre-rendering orders
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //Rendering Variables Setup
    var pMatrix = mat4.create();
    var mvMatrix = mat4.create();

    mat4.identity(mvMatrix);
    mat4.perspective(60, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0, pMatrix);

    //Camera Move
    var cameraPos = vec3.create(camera.position);
    mat4.translate(mvMatrix, vec3.negate(cameraPos));
    mat4.rotate(mvMatrix, camera.pitch, [1.0, 0.0, 0.0]);
    mat4.rotate(mvMatrix, camera.yaw, [0.0, 1.0, 0.0]);
    
    //Rendering preparation (Binding & Uniforms)
    defShader.BindShader();
    defShader.SetUniformMat4f("u_ProjMatrix", pMatrix);    
    defShader.SetUniformMat4f("u_ViewMatrix", mvMatrix);

    //Rendering
    var i = 0;
    while(i < meshesSize)
    {        
        renderer.DrawMesh(DrawMeshes[i], defShader);
        ++i;      
    }

    defShader.UnbindShader();
}

function Update()
{
    var d = new Date();
    var timeMS = d.getTime();
    time.dt = (timeMS - time.lastTimeMS)/1000.0;
    time.lastTimeMS = timeMS;

    requestAnimationFrame(Update);
    ProcessInput();
    DrawScene();
}


// App's Main Loop
var mainLoop = function()
{
    InitTime();

    //Create Renderer
    renderer = new GLRenderer();
    renderer.Init("screen_canvas", "webgl2"); //"experimental-webgl"

    //Create Input
    var InputObject = new Input();

    //Setup Default Shader
    renderer.CreateDefaultShader("DefaultVertexShader", "DefaultFragmentShader");    
    defShader = renderer.getDefaultShader();

    //Setup meshes
    tri1 = new Mesh();
    tri1.LoadTriangle(defShader);
    tri1.SetPosition([0.0, 1.5, -10.0]);
    tri1.SetMeshColor([0.0, 1.0, 0.5, 1.0]);

    sq1 = new Mesh();
    sq1.LoadSquare(defShader);
    sq1.SetPosition([3.0, 0.0, -10.0]);
    sq1.SetMeshColor([0.0, 0.5, 1.0, 1.0]);

    tri2 = new Mesh();
    tri2.LoadTriangle(defShader);
    tri2.SetPosition([0.0, -1.5, -10.0]);
    tri2.SetMeshColor([1.0, 0.0, 0.5, 1.0]);

    sq2 = new Mesh();
    sq2.LoadSquare(defShader);
    sq2.SetPosition([-3.0, 0.0, -10.0]);
    sq2.SetMeshColor([1.0, 1.0, 0.5, 1.0]);
    sq2.SetRotation(45, [0.0, 0.0, 1.0]);

    //Create Textures
    texture1 = new Texture("images/wall.jpg", "texture1");
    tri1.SetMeshTexture(texture1);
    //texture2 = new Texture("images/awesomeface.png", "texture2");
    //sq2.SetMeshTexture(texture2);
    
    //Draw
    DrawMeshes = new Array(tri1, tri2, sq1, sq2);
    meshesSize = 4;
    Update();
}