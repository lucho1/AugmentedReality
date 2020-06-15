//Global variables
var gl;
var Renderer, AppInput, MainCamera, ThirdCamera, SecondCamera, MainScene, currentCamera;
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


    if(input.keys[49] == ButtonState.PRESSED)
        currentCamera = MainCamera;
    if(input.keys[51] == ButtonState.PRESSED)
        currentCamera = ThirdCamera;
    if(input.keys[50] == ButtonState.PRESSED)
        currentCamera = SecondCamera;


    requestAnimationFrame(Update);

    if(currentCamera == MainCamera)
        MainCamera.MoveCamera(time.dt);


    MainScene.UpdateScene(time.dt);
    MainScene.DrawScene(currentCamera, defShader, Renderer);
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
    currentCamera = MainCamera;

    SecondCamera = new Camera();
    ThirdCamera = new Camera();
    SecondCamera.SetPosition([-5.0, 5.0, 10.0]);
    ThirdCamera.SetPosition([10.0, 10.0, -3.0]);

    //Setup Default Shader
    Renderer.CreateDefaultShader("DefaultVertexShader", "DefaultFragmentShader");    
    defShader = Renderer.getDefaultShader();

    //Setup Main Scene
    MainScene = new Scene();
    MainScene.LoadScene(defShader);

    //var mod = new Mesh();
    var defScale = [1.0, 1.0, 1.0];
    var position = [Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0];
    var rotation = [0.0, 0.0, 0.0];

    var wallColor = [0.08, 0.08, 0.08];
    var towerColor = [0.55, 0.43, 0.43];
    var roofColor = [0.6, 0.6, 0.6];

    // --- 1st Tower ---
    LoadModel("images/Cylinder.json", defShader, MainScene, "Tower1", [5.0, 10.0, 5.0], [0.0, 0.0, 0.0], rotation, towerColor, 16.0);
    LoadModel("images/Cone.json", defShader, MainScene, "Tower1Roof", [2.5, 4.0, 2.5], [0.0, 3.5, 0.0], rotation, roofColor, 12.0);
    
    // --- 2nd Tower ---
    LoadModel("images/Cylinder.json", defShader, MainScene, "Tower2", [5.0, 10.0, 5.0], [10.0, 0.0, 0.0], rotation, towerColor, 16.0);
    LoadModel("images/Cone.json", defShader, MainScene, "Tower2Roof", [2.5, 4.0, 2.5], [20.0, 3.5, 0.0], rotation, roofColor, 12.0);
    
    // --- Wall towers 1-2 ---
    LoadModel("images/Cube.json", defShader, MainScene, "Wall1", [23.4, 6.8, 2.0], [1.06, -0.46, 0.0], rotation, wallColor, 16.0);

    // --- 3rd Tower ---
    LoadModel("images/Cylinder.json", defShader, MainScene, "Tower3", [5.0, 10.0, 5.0], [10.0, 0.0, -10.0], rotation, towerColor, 16.0);
    LoadModel("images/Cone.json", defShader, MainScene, "Tower3Roof", [2.5, 4.0, 2.5], [20.0, 3.5, -20.0], rotation, roofColor, 12.0);

    // --- Wall towers 2-3 ---
    LoadModel("images/Cube.json", defShader, MainScene, "Wall2", [2.0, 6.8, 23.4], [25.0, -0.46, -1.06], rotation, wallColor, 16.0);

    // --- 4yh Tower ---
    LoadModel("images/Cylinder.json", defShader, MainScene, "Tower4", [5.0, 10.0, 5.0], [0.0, 0.0, -10.0], rotation, towerColor, 16.0);
    LoadModel("images/Cone.json", defShader, MainScene, "Tower4Roof", [2.5, 4.0, 2.5], [0.0, 3.5, -20.0], rotation, roofColor, 12.0);

    // --- Wall towers 3-4 and 1-4 ---
    LoadModel("images/Cube.json", defShader, MainScene, "Wall3", [23.4, 6.8, 2.0], [1.06, -0.46, -25.0], rotation, wallColor, 16.0);
    LoadModel("images/Cube.json", defShader, MainScene, "Wall4", [2.0, 6.8, 23.4], [0.0, -0.46, -1.06], rotation, wallColor, 16.0);

    // --- Central Cube ---
    LoadModel("images/Cube.json", defShader, MainScene, "WallCentral", [15.0, 12.0, 15.0], [1.7, 0.16, -1.7], rotation, [0.83, 0.69, 0.22], 256.0);

    // --- Floor ---
    LoadModel("images/Plane.json", defShader, MainScene, "FloorPlane", [40.0, 1.0, 40.0], [0.6, -10.0, -0.6], rotation, [0.43, 0.23, 0.0], 1.0);

    // --- Central Roof ---
    LoadModel("images/Sphere.json", defShader, MainScene, "RoofSphere", [15.0, 15.0, 15.0], [1.7, 0.8, -1.7], rotation, [0.5, 0.0, 0.0], 150.0);
    LoadModel("images/Teapot.json", defShader, MainScene, "RoofTeapot", [0.3, 0.3, 0.3], [86.0, 96.0, -86.0], rotation, undefined, 256.0);


    //Create Textures for meshes
    //new Texture("images/awesomeface.png", "texture2")
    var tex1 = new Texture("images/wall.jpg", "texture1");
    //MainScene.getMeshesToDraw()[0].SetMeshTexture(tex1);
    //MainScene.getMeshesToDraw()[1].SetMeshTexture(tex1);
    //MainScene.getMeshesToDraw()[2].SetMeshTexture(tex1);
    //MainScene.getMeshesToDraw()[3].SetMeshTexture(tex1);

    //Finally, Update
    Update();
}