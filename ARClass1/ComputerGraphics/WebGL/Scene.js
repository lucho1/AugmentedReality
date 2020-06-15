class Scene
{
    #m_MeshesToDraw = [];
    #m_MeshesDrawSize = 0;
    #m_SceneObjects;
    //#m_CurrentLight;

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

        var cube = new Mesh();
        cube.LoadCube(shader);
        cube.SetPosition([0.0, 50.0, 10.0]);
        cube.SetMeshColor([1.0, 1.0, 1.0, 1.0]);
        cube.SetScale([0.2, 0.2, 0.2]);
        this.#m_SceneObjects.set("Light", cube);

        //this.#m_MeshesToDraw = new Array(tri1, tri2, sq1, sq2, cube);
        this.#m_MeshesToDraw = new Array();
        this.#m_MeshesDrawSize = this.#m_MeshesToDraw.length;
    }

    AddObjectToScene = function(object, name, scale, pos, rot)
    {
        if(this.#m_SceneObjects.get(name) == undefined)
        {
            this.#m_SceneObjects.set(name, object);
            this.#m_MeshesToDraw.push(object);
            this.#m_MeshesDrawSize++;

            object.SetScale(scale);
            object.SetPosition(pos);
            //object.SetRotation(rot, [1.0, 0.0, 0.0]);
        }
        else
            console.log("Object was already in scene");
    }

    AddMeshToScene = function(mesh)
    {
        this.#m_MeshesToDraw.push(mesh);
        this.#m_MeshesDrawSize++;
    }

    UpdateScene(dt)
    {
        //var light_cube = this.#m_SceneObjects.get("Light");
        //if(light_cube != undefined)
        //{
            //this.#m_CurrentLight = light_cube;

            //var speed = 20.0, angular_speed = 150.0;
            //var new_pos = [0.0, 0.0, 0.0];
            //var rot = [0.0, 0.0];

            //Process Keyboard to move light
            //if(input.keys[16] == ButtonState.PRESSED) //SHIFT == double speed
            //{
            //    speed *= 2.0;
            //    angular_speed *= 2.0;
            //}
            
            //if(input.keys[73] == ButtonState.PRESSED) //I
            //    new_pos[2] -= speed * dt;
            //if(input.keys[75] == ButtonState.PRESSED) //K
            //    new_pos[2] += speed * dt;
            //if(input.keys[74] == ButtonState.PRESSED) //J
            //    new_pos[0] -= speed * dt;
            //if(input.keys[76] == ButtonState.PRESSED) //L
            //    new_pos[0] += speed * dt;
            //if(input.keys[79] == ButtonState.PRESSED) //O
            //    new_pos[1] += speed * dt;
            //if(input.keys[85] == ButtonState.PRESSED) //U
            //    new_pos[1] -= speed * dt;
            //if(input.keys[89] == ButtonState.PRESSED) //Y (Rot Pitch)
            //    rot[0] += angular_speed * dt;
            //if(input.keys[72] == ButtonState.PRESSED) //H (Rot Yaw)
            //    rot[1] += angular_speed * dt;
            
            //if(new_pos[0] > 0.0 || new_pos[1] > 0.0 || new_pos[2] > 0.0 || new_pos[0] < 0.0 || new_pos[1] < 0.0 || new_pos[2] < 0.0)
            //    this.#m_SceneObjects.get("Light").SetPosition(new_pos);

            //this.#m_SceneObjects.get("Light").SetRotation(rot[0], [1.0, 0.0, 0.0]);
            //this.#m_SceneObjects.get("Light").SetRotation(rot[1], [0.0, 1.0, 0.0]);
        //}
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
        mat4.perspective(60, gl.viewportWidth/gl.viewportHeight, 0.1, 10000.0, pMatrix);

        //Camera Move
        var cameraPos = vec3.create(mainCamera.getPosition());
        mat4.translate(mvMatrix, vec3.negate(cameraPos));
        mat4.rotate(mvMatrix, mainCamera.getXRotation(), [1.0, 0.0, 0.0]);
        mat4.rotate(mvMatrix, mainCamera.getYRotation(), [0.0, 1.0, 0.0]);
        
        //Rendering preparation (Binding & Uniforms)
        shader.BindShader();
        shader.SetUniformMat4f("u_ProjMatrix", pMatrix);    
        shader.SetUniformMat4f("u_ViewMatrix", mvMatrix);
        shader.SetUniformVec3f("u_ViewPos", mainCamera.getPosition());

        //Pass Lighting Uniforms
        //var light_cube = this.#m_SceneObjects.get("Light");
        //if(light_cube != undefined)
        //    this.#m_CurrentLight = light_cube;

        //shader.SetUniformVec3f("u_LightPos", light_cube.getPos());
        //shader.SetUniformVec4f("u_LightColor", light_cube.getMeshColor());

        if(this.#m_SceneObjects.get("RoofTeapot") != undefined)
            this.#m_SceneObjects.get("RoofTeapot").SetRotation(2.0, [0.0, 1.0, 0.0]);

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