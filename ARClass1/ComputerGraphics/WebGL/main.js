//Global variables
var gl;
var shaderProgram;
var triangleVertexPositionBuffer;
var canvas_id = "screen_canvas"
var renderer;

// Load Scene (basically, loads the triangle with its buffer)
function LoadTriangle(shader)
{
    var triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    var vertices = [
         0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.vertexSize = 3;
    triangleVertexPositionBuffer.vertexNum = 3;
    gl.vertexAttribPointer(shader.vertexPositionAttribute, triangleVertexPositionBuffer.vertexSize, gl.FLOAT, false, 0, 0);     

    return triangleVertexPositionBuffer;
}

//Draw the Scene
function drawScene(meshes, meshes_size, shader)
{
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    renderer.getDefaultShader().BindShader();
    
    var pMatrix = mat4.create();
    var mvMatrix = mat4.create();
    mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0, pMatrix);
    
    mesh_color = [0.0, 1.0, 0.0, 1.0];
    transf = [0.0, 0.0, -10.0];
    
    var i = 0;
    while(i < meshes_size)
    {
        mat4.identity(mvMatrix);
        drawTriangle(meshes[i], pMatrix, mvMatrix, transf, mesh_color, shader);
        mesh_color = [1.0, 0.0, 0.0, 1.0];
        transf = [-5.0, 0.0, -10.0]
        ++i;
    }
}

function drawTriangle(triangle, proj_Mat, view_Mat, translation, color, shader)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle);        
    mat4.translate(view_Mat, translation);

    gl.uniformMatrix4fv(shader.ProjUniform, false, proj_Mat);
    gl.uniformMatrix4fv(shader.ModelViewUniform, false, view_Mat);
    gl.uniform4fv(shader.ColorUniform, color);

    gl.drawArrays(gl.TRIANGLES, 0, triangle.vertexNum);
}



var RunMainLoop = function()
{
    renderer = new GLRenderer();
    renderer.Init("screen_canvas", "experimental-webgl");
    renderer.CreateDefaultShader("DefaultVertexShader", "DefaultFragmentShader");

    shaderProgram = renderer.getDefaultShader();
    renderer.getDefaultShader().BindShader();

    var tri1 = LoadTriangle(renderer.getDefaultShader());
    var tri2 = LoadTriangle(renderer.getDefaultShader());
    var meshes_to_draw = new Array(tri1, tri2);

    drawScene(meshes_to_draw, 2, renderer.getDefaultShader());
}