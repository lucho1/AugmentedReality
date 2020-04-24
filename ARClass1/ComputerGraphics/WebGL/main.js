//Global variables
var gl;

//Draw the Scene
function DrawScene(meshes, meshes_size, shader)
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
    shader.BindShader();
    shader.SetUniformMat4f("u_ProjMatrix", pMatrix);    
    shader.SetUniformMat4f("u_ViewMatrix", mvMatrix);
    
    //meshes[1].SetTransform([0.0, -1.5, -10.0]);    
    //meshes[3].SetTransform([-3.0, 0.0, -10.0]);
    
    //Rendering
    var i = 0;
    while(i < meshes_size)
    {
        //if(i == 3)
            //mat4.rotate(mvMatrix, 3.1415 * 0.25, [0.0, 0.0, 1.0]);

        DrawMesh(meshes[i], shader);
        ++i;      
    }
}

function DrawMesh(mesh, shader)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getID());
    gl.vertexAttribPointer(shader.vPosAtt, mesh.getVertexSize(), gl.FLOAT, false, 0, 0);

    shader.SetUniformMat4f("u_ModelMatrix", mesh.getModelMatrix());
    shader.SetUniformVec4f("u_Color", mesh.getMeshColor());   

    gl.drawArrays(gl.TRIANGLES, 0, mesh.getVertexNumber());
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
    
    //Draw
    var meshes_to_draw = new Array(tri1, tri2, sq1, sq2);
    DrawScene(meshes_to_draw, 4, shaderProgram);
}