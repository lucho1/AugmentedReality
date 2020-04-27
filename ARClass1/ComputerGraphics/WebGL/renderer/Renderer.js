class GLRenderer
{
    #m_Name = "GL Renderer"
    #m_DefaultShader = 0;

    // --- Constructor ---
    constructor()
    {
        this.getName = function() { return this.#m_Name; }
        this.getDefaultShader = function() { return this.#m_DefaultShader; }
    }
    
    // --- Initialize WebGL ---
    Init = function(canvas_id, context_type)
    {    
        var new_canvas = document.getElementById(canvas_id);
        new_canvas.width = window.innerWidth;
        new_canvas.height = window.innerHeight;

        try
        {
            gl = new_canvas.getContext(context_type);
            gl.viewportWidth = new_canvas.width;
            gl.viewportHeight = new_canvas.height;
        }
        catch (e) {}
        if (!gl)
            alert("Could not initialise WebGL, sorry :-(... Try suicide");
    }

    // --- Create Default Shader ---
    CreateDefaultShader = function(vertex_shader, fragment_shader)
    {
        this.#m_DefaultShader = new GLShader("Default Shader", vertex_shader, fragment_shader);
    }

    // --- Drawing ---
    DrawMesh = function(mesh, shader_bound) //Considers the shader already bound
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getID());

        var vSize = mesh.getVertexSize();
        var stride = (vSize[0] + vSize[1]) * 4.0;
        gl.vertexAttribPointer(shader_bound.vPosAtt, vSize[0], gl.FLOAT, false, stride, 0);        
        gl.vertexAttribPointer(shader_bound.vTCoordAtt, vSize[1], gl.FLOAT, false, stride, vSize[0]*4.0);

        shader_bound.SetUniformMat4f("u_ModelMatrix", mesh.getModelMatrix());
        shader_bound.SetUniformVec4f("u_Color", mesh.getMeshColor());   

        gl.drawArrays(gl.TRIANGLES, 0, mesh.getVertexNumber());
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}