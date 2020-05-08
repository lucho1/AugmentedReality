//Global variables
var gl;
var renderer, AppInput, MainCamera;
var DrawMeshes, meshesSize, defShader;

//Delta Time
var time = { dt: 1.0/0.0, lastTimeMS: 0}

//Global Const Variables
const PI = 3.14159265359
const TWOPI = 6.28318530718
const HALFPI = 1.57079632679

//Global Utility Functions
function DEGTORAD(deg) { return PI*deg/180.0; }
function RADTODEG(rad) { return 180.0*rad/PI; }
function mod(val1, val2) { return val1%val2; }
function clamp(val1, min, max) { return val1 < min ? min : (val1 > max ? max : val1); }

//Time Initialization
function InitTime()
{
    var d = new Date();
    time.lastTimeMS = d.getTime();
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
    var cameraPos = vec3.create(MainCamera.getPosition());
    mat4.translate(mvMatrix, vec3.negate(cameraPos));
    mat4.rotate(mvMatrix, MainCamera.getXRotation(), [1.0, 0.0, 0.0]);
    mat4.rotate(mvMatrix, MainCamera.getYRotation(), [0.0, 1.0, 0.0]);
    
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
    MainCamera.MoveCamera(time.dt);
    //ProcessInput();    
    DrawScene();
    AppInput.ResetInput();
}


// App's Main Loop
var mainLoop = function()
{
    //Time Start
    InitTime();

    //Create Renderer
    renderer = new GLRenderer();
    renderer.Init("screen_canvas", "webgl2"); //"experimental-webgl"

    //Create Input & Main Camera
    AppInput = new Input();
    MainCamera = new Camera();

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