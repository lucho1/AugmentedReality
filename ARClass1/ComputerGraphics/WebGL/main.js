//Global variables
var gl;
var Renderer, AppInput, MainCamera, MainScene;
var defShader;

//Global Const Variables
const PI = 3.14159265359
const TWOPI = 6.28318530718
const HALFPI = 1.57079632679

//Delta Time
var time = { dt: 1.0/0.0, lastTimeMS: 0}

//Global Utility Functions
function DEGTORAD(deg) { return PI*deg/180.0; }
function RADTODEG(rad) { return 180.0*rad/PI; }
function mod(val1, val2) { return val1%val2; }
function clamp(val1, min, max) { return val1 < min ? min : (val1 > max ? max : val1); }

//Update Function
function Update()
{
    var d = new Date();
    var timeMS = d.getTime();
    time.dt = (timeMS - time.lastTimeMS)/1000.0;
    time.lastTimeMS = timeMS;

    requestAnimationFrame(Update);
    MainCamera.MoveCamera(time.dt);
    MainScene.UpdateScene(time.dt);
    MainScene.DrawScene(MainCamera, defShader, Renderer);
    AppInput.ResetInput();
}

// App's Main Loop
var mainLoop = function()
{
    //Time Start
    var t = new Date();
    time.lastTimeMS = t.getTime();

    //Create Renderer
    Renderer = new GLRenderer();
    Renderer.Init("screen_canvas", "webgl2"); //"experimental-webgl"

    //Create Input & Main Camera
    AppInput = new Input();
    MainCamera = new Camera();

    //Setup Default Shader
    Renderer.CreateDefaultShader("DefaultVertexShader", "DefaultFragmentShader");    
    defShader = Renderer.getDefaultShader();

    //Setup Main Scene
    MainScene = new Scene();
    MainScene.LoadScene(defShader);

    //var mod = new Mesh();
    var defScale = [1.0, 1.0, 1.0];
    var position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];

    LoadModel("images/Laptop.json", defShader, MainScene, "Laptop", defScale, position);
    LoadModel("images/Teapot.json", defShader, MainScene, "Teapot", [0.05, 0.05, 0.05], [25.0, 0.0, 0.0]);

    position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];
    LoadModel("images/Cylinder.json", defShader, MainScene, "Cylinder", defScale, position);

    position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];
    LoadModel("images/Plane.json", defShader, MainScene, "Plane", defScale, position);

    position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];
    LoadModel("images/Sphere.json", defShader, MainScene, "Sphere", defScale, position);

    position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];
    LoadModel("images/Cone.json", defShader, MainScene, "Cone", defScale, position);

    position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];
    LoadModel("images/Cube.json", defShader, MainScene, "Cube", defScale, position);

    //Create Textures for meshes
    //new Texture("images/awesomeface.png", "texture2")
    var tex1 = new Texture("images/wall.jpg", "texture1");
    MainScene.getMeshesToDraw()[0].SetMeshTexture(tex1);
    MainScene.getMeshesToDraw()[1].SetMeshTexture(tex1);
    MainScene.getMeshesToDraw()[2].SetMeshTexture(tex1);
    MainScene.getMeshesToDraw()[3].SetMeshTexture(tex1);

    //Finally, Update
    Update();
}