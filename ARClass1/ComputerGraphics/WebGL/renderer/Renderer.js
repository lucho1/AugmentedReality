class GLRenderer
{
    #m_Name = "GL Renderer"

    // --- Constructor ---
    constructor()
    {
        this.getName = function() { return this.#m_Name; }
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
        else
        {
            var ctx = WebGLDebugUtils.makeDebugContext(new_canvas.getContext(context_type));
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
            //gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
            gl = WebGLDebugUtils.makeDebugContext(gl, undefined, validateNoneOfTheArgsAreUndefined);
            WebGLDebugUtils.init(ctx);
            //alert(WebGLDebugUtils.glEnumToString(ctx.getError()));
        }
    }

    // --- Create Default Shader ---
    CreateShader = function(vertex_shader, fragment_shader, name, vAtts)
    {
        return new GLShader(name, vertex_shader, fragment_shader, vAtts);
    }

    // --- Drawing a Mesh ---
    DrawMesh = function(mesh, shader_bound, depthRenderPass) //Considers the shader already bound
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getID());
        shader_bound.SetUniformMat4f("u_ModelMatrix", mesh.getModelMatrix());

        var vSize = mesh.getVertexSize();
        //var stride = (vSize[0] + vSize[1] + vSize[2]) * 4.0;
        //gl.vertexAttribPointer(shader_bound.vPosAtt, vSize[0], gl.FLOAT, false, stride, 0);
        //gl.vertexAttribPointer(shader_bound.vTCoordAtt, vSize[1], gl.FLOAT, false, stride, vSize[0]*4.0);
        //gl.vertexAttribPointer(shader_bound.vNormsAtt, vSize[2], gl.FLOAT, false, stride, (vSize[0]+vSize[1])*4.0);

        if(!depthRenderPass)
        {
            //var stride = (vSize[0] + vSize[1] + vSize[2]) * 4.0;
            //gl.vertexAttribPointer(shader_bound.vPosAtt, vSize[0], gl.FLOAT, false, stride, 0);
            //gl.vertexAttribPointer(shader_bound.vTCoordAtt, vSize[1], gl.FLOAT, false, stride, vSize[0]*4.0);
            //gl.vertexAttribPointer(shader_bound.vNormsAtt, vSize[2], gl.FLOAT, false, stride, (vSize[0]+vSize[1])*4.0);

            gl.enableVertexAttribArray(shader_bound.vPosAtt);
            gl.enableVertexAttribArray(shader_bound.vTCoordAtt);
            gl.enableVertexAttribArray(shader_bound.vNormsAtt);

            shader_bound.SetUniformVec4f("u_Color", mesh.getMeshColor());   
            shader_bound.SetUniform1i("u_UseTextures", 0);
        }
        else            
            gl.vertexAttribPointer(shader_bound.vPosAtt, vSize[0], gl.FLOAT, false, 0, 0);        
        

        if(mesh.getMeshTexture() != null && !depthRenderPass)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, mesh.getMeshTexture().getTexture());
            shader_bound.SetUniform1i("u_AlbedoTexture", 0);
            shader_bound.SetUniform1i("u_UseTextures", 1);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndices());
        gl.drawElements(gl.TRIANGLES, mesh.getIndicesSize(), gl.UNSIGNED_SHORT, 0);

        if(!depthRenderPass)
        {
            gl.disableVertexAttribArray(shader_bound.vPosAtt);
            gl.disableVertexAttribArray(shader_bound.vTCoordAtt);
            gl.disableVertexAttribArray(shader_bound.vNormsAtt);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}