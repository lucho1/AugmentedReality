class Scene
{
    #m_MeshesToDraw = [];
    #m_MeshesDrawSize = 0;
    #m_SceneObjects;
    //#m_CurrentLight;
    m_DepthFBO;
    m_ShadowMap;
    m_LightMatrix;

    constructor()
    {
        this.#m_SceneObjects = new Map();
        this.getSceneObjects = function() { return this.#m_SceneObjects; }
        this.getMeshesToDraw = function() { return this.#m_MeshesToDraw; }
        this.getMeshesVecSize = function() { return this.#m_MeshesDrawSize; }

        this.#CreateFrameBuffer();
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
        cube.SetPosition([0.0, 0.0, -2.0]);
        cube.SetMeshColor([1.0, 1.0, 1.0, 1.0]);
        cube.SetScale([0.2, 0.2, 0.2]);
        this.#m_SceneObjects.set("Light", cube);

        this.#m_MeshesToDraw = new Array(tri1, tri2, sq1, sq2, cube);
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
                object.SetPosition([25.0, 0.0, 0.0]);
            }
            else
                object.SetPosition([0.0, 0.0, 0.0]);
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

    //Create FBO
    #CreateFrameBuffer = function()
    {
        this.m_DepthFBO = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_DepthFBO);
        this.m_DepthFBO.width = 2048;
        this.m_DepthFBO.height = 2048;

        this.m_ShadowMap = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.m_ShadowMap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.m_DepthFBO.width, this.m_DepthFBO.height,
            0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.m_DepthFBO.width, this.m_DepthFBO.height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.m_ShadowMap, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    
        gl.bindTexture(gl.TEXTURE_2D, null),
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    //Draw the scene's shadowmap (render from light)
    DrawShadowMap = function(mainCamera, shader, renderer)
    {
        //gl.enable(gl.DEPTH_TEST);
        var espia = this.m_DepthFBO;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_DepthFBO);
        gl.viewport(0, 0, this.m_DepthFBO.width, this.m_DepthFBO.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //Matrices
        var pMatrix = mat4.create();
        var mvMatrix = mat4.create();
        mat4.identity(mvMatrix);
        mat4.perspective(60, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0, pMatrix);

        //Camera Move
        var cameraPos = vec3.create(mainCamera.getPosition());
        mat4.translate(mvMatrix, vec3.negate(cameraPos));
        mat4.rotate(mvMatrix, mainCamera.getXRotation(), [1.0, 0.0, 0.0]);
        mat4.rotate(mvMatrix, mainCamera.getYRotation(), [0.0, 1.0, 0.0]);

        //Shader Uniforms
        shader.BindShader();
        shader.SetUniformMat4f("u_ProjMatrix", pMatrix);    
        shader.SetUniformMat4f("u_ViewMatrix", mvMatrix);


        var LPMat = mat4.create();
        var LVMat = mat4.create();
        var LVPMat = mat4.create();
        
        mat4.identity(LVMat);
        mat4.translate(LVMat, vec3.negate(vec3.create([0.0, 50.0, 10.0])));
        mat4.ortho(0, 2048, 0, 2048, 0.1, 100.0, LPMat);
        
        mat4.multiply(LVPMat, LPMat, LVMat);
        this.m_LightMatrix = LVPMat;

        //Rendering
        var i = 0;
        while(i < this.#m_MeshesDrawSize)
        {        
            renderer.DrawMesh(this.#m_MeshesToDraw[i], shader, true);
            ++i;      
        }

        shader.UnbindShader();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
        shader.SetUniformMat4f("u_LightSpaceMatrix", this.m_LightMatrix);

        var xddd = this.m_ShadowMap;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.m_ShadowMap);
        shader.SetUniform1i("u_ShadowMap", 1);

        //Pass Lighting Uniforms
        //var light_cube = this.#m_SceneObjects.get("Light");
        //if(light_cube != undefined)
        //    this.#m_CurrentLight = light_cube;

        //shader.SetUniformVec3f("u_LightPos", light_cube.getPos());
        //shader.SetUniformVec4f("u_LightColor", light_cube.getMeshColor());
        shader.SetUniformVec3f("u_ViewPos", mainCamera.getPosition());

        //Rendering
        var i = 0;
        while(i < this.#m_MeshesDrawSize)
        {        
            renderer.DrawMesh(this.#m_MeshesToDraw[i], shader, false);
            ++i;      
        }

        shader.UnbindShader();
    }

}