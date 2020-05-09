class Scene
{
    #m_MeshesToDraw = [];
    #m_MeshesDrawSize = 0;
    #m_SceneObjects;

    constructor()
    {
        this.#m_SceneObjects = new Map();
        this.getSceneObjects = function() { return this.#m_SceneObjects; }
        this.getMeshesToDraw = function() { return this.#m_MeshesToDraw; }
        this.getMeshesVecSize = function() { return this.#m_MeshesDrawSize; }
    }

    //Load the Scene
    LoadScene = function(shader)
    {
        var tri1 = new Mesh();
        tri1.LoadTriangle(shader);
        tri1.SetPosition([0.0, 1.5, -10.0]);
        tri1.SetMeshColor([0.0, 1.0, 0.5, 1.0]);

        var sq1 = new Mesh();
        sq1.LoadSquare(shader);
        sq1.SetPosition([3.0, 0.0, -10.0]);
        sq1.SetMeshColor([0.0, 0.5, 1.0, 1.0]);

        var tri2 = new Mesh();
        tri2.LoadTriangle(shader);
        tri2.SetPosition([0.0, -1.5, -10.0]);
        tri2.SetMeshColor([1.0, 0.0, 0.5, 1.0]);

        var sq2 = new Mesh();
        sq2.LoadSquare(shader);
        sq2.SetPosition([-3.0, 0.0, -10.0]);
        sq2.SetMeshColor([1.0, 1.0, 0.5, 1.0]);
        sq2.SetRotation(45, [0.0, 0.0, 1.0]);

        this.#m_MeshesToDraw = new Array(tri1, tri2, sq1, sq2);
        this.#m_MeshesDrawSize = this.#m_MeshesToDraw.length;
    }

    AddObjectToScene = function(object, name)
    {
        if(this.#m_SceneObjects.get(name) == undefined)
        {
            this.#m_SceneObjects.set(name, object);
            this.#m_MeshesToDraw.push(object);
            this.#m_MeshesDrawSize++;

            if(name == "Teapot")
            {
                object.SetScale([0.05, 0.05, 0.05]);
                object.SetPosition([25.0, 5.0, -15.0]);
            }
        }
        else
            console.log("Object was already in scene");
    }

    AddMeshToScene = function(mesh)
    {
        this.#m_MeshesToDraw.push(mesh);
        this.#m_MeshesDrawSize++;
    }

    //Draw the Scene
    DrawScene = function(mainCamera, shader, renderer)
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
        var cameraPos = vec3.create(mainCamera.getPosition());
        mat4.translate(mvMatrix, vec3.negate(cameraPos));
        mat4.rotate(mvMatrix, mainCamera.getXRotation(), [1.0, 0.0, 0.0]);
        mat4.rotate(mvMatrix, mainCamera.getYRotation(), [0.0, 1.0, 0.0]);
        
        //Rendering preparation (Binding & Uniforms)
        shader.BindShader();
        shader.SetUniformMat4f("u_ProjMatrix", pMatrix);    
        shader.SetUniformMat4f("u_ViewMatrix", mvMatrix);

        //Rendering
        var i = 0;
        while(i < this.#m_MeshesDrawSize)
        {        
            renderer.DrawMesh(this.#m_MeshesToDraw[i], shader);
            ++i;      
        }

        shader.UnbindShader();
    }

}