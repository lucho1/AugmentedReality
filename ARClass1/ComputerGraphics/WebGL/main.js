//Global variables
var gl;
var renderer;

var meshes, meshes_size, defShader;

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
    mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0, pMatrix);
    
    //Rendering preparation (Binding & Uniforms)
    defShader.BindShader();
    defShader.SetUniformMat4f("u_ProjMatrix", pMatrix);    
    defShader.SetUniformMat4f("u_ViewMatrix", mvMatrix);

    //Rendering
    var i = 0;
    while(i < meshes_size)
    {        
        renderer.DrawMesh(meshes[i], defShader);
        ++i;      
    }

    defShader.UnbindShader();
}


// App's Main Loop
var mainLoop = function()
{
    //Create Renderer & Setup Default Shader
    renderer = new GLRenderer();
    renderer.Init("screen_canvas", "webgl2"); //"experimental-webgl"
    renderer.CreateDefaultShader("DefaultVertexShader", "DefaultFragmentShader");    
    shaderProgram = renderer.getDefaultShader();

    //Setup meshes
    tri1 = new Mesh();
    tri1.LoadTriangle(shaderProgram);
    tri1.SetPosition([0.0, 1.5, -10.0]);
    tri1.SetMeshColor([0.0, 1.0, 0.5, 1.0]);

    sq1 = new Mesh();
    sq1.LoadSquare(shaderProgram);
    sq1.SetPosition([3.0, 0.0, -10.0]);
    sq1.SetMeshColor([0.0, 0.5, 1.0, 1.0]);

    tri2 = new Mesh();
    tri2.LoadTriangle(shaderProgram);
    tri2.SetPosition([0.0, -1.5, -10.0]);
    tri2.SetMeshColor([1.0, 0.0, 0.5, 1.0]);

    sq2 = new Mesh();
    sq2.LoadSquare(shaderProgram);
    sq2.SetPosition([-3.0, 0.0, -10.0]);
    sq2.SetMeshColor([1.0, 1.0, 0.5, 1.0]);
    sq2.SetRotation(45, [0.0, 0.0, 1.0]);

    //Create Textures
    texture1 = new Texture("images/wall.jpg");
    tri1.SetMeshTexture(texture1);
    //texture2 = new Texture('images/awesomeface.png');
    //sq2.SetMeshTexture(texture2);
    
    //Draw
    var meshes_to_draw = new Array(tri1, tri2, sq1, sq2);
    defShader = shaderProgram;
    meshes = meshes_to_draw;
    meshes_size = 4;
    reDraw();
    //DrawScene(meshes_to_draw, 4, shaderProgram);
}

function reDraw()
{
    requestAnimationFrame(reDraw);    
    DrawScene();
}