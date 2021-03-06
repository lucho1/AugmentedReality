class GLShader
{
    #m_Name = "Unnamed Shader";
    #m_ID = 0;
    #m_VertID = 0;
    #m_FragID = 0;
    #m_UniformLocCache;

    // --- Constructor ---
    constructor(name, vertex_shader, fragment_shader)
    {
        this.#m_Name = name;
        this.#m_UniformLocCache = new Map();
        this.CreateShader(vertex_shader, fragment_shader);
        
        this.getName = function() { return this.#m_Name; }
        this.getID = function() { return this.#m_ID; }
    }


    // --------------------------------------------------------------------------
    // --- Shader Creation & Methods ---

    // Compile a 'sub-' Shader
    #CompileShader = function(id)
    {
        // Check if shader exists
        var shaderScript = document.getElementById(id);
        if (!shaderScript)
            return null;

        // Get shader string (its source)
        var str = "";
        var k = shaderScript.firstChild;
        while (k)
        {
            if (k.nodeType == 3)
                str += k.textContent;
        
            k = k.nextSibling;
        }

        // Create shader according to its type
        var shader;
        if (shaderScript.type == "x-shader/x-fragment")
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        else if (shaderScript.type == "x-shader/x-vertex")
            shader = gl.createShader(gl.VERTEX_SHADER);
        else
        {
            alert("Invalid Shader Type")
            return null;
        }

        // Compile shader
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            alert("Couldn't Compile Shader: ")
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;        
    }

    // Create a Shader Program
    CreateShader = function(vertex_shader, fragment_shader)
    {
        //Compile Shaders
        var v_id = this.#CompileShader(vertex_shader);
        var f_id = this.#CompileShader(fragment_shader);
        var id = gl.createProgram();

        //Attach & Link Shaders to ShaderProgram
        gl.attachShader(id, v_id);
        gl.attachShader(id, f_id);
        gl.linkProgram(id);

        //Check for Errors
        if (!gl.getProgramParameter(id, gl.LINK_STATUS))
        {
            alert("Couldn't Link Shader");
            return null;
        }

        //Set Class Variables
        this.#m_VertID = v_id;
        this.#m_FragID = f_id;
        this.#m_ID = id;
        
        // --- Set Attributes ---
        gl.useProgram(id);
        this.vPosAtt = gl.getAttribLocation(id, "a_Position");
        gl.enableVertexAttribArray(this.vPosAtt);        
        this.vTCoordAtt = gl.getAttribLocation(id, "a_TexCoords");
        gl.enableVertexAttribArray(this.vTCoordAtt);
        this.vNormsAtt = gl.getAttribLocation(id, "a_Normal");
        gl.enableVertexAttribArray(this.vNormsAtt);

        //Unbind
        gl.useProgram(null);
    }


    // --------------------------------------------------------------------------
    // --- Uniforms and GL Stuff ---

    // Use Shader (bind it)
    BindShader = function()
    {
        gl.useProgram(this.#m_ID)
    }

    //Unuse Shader
    UnbindShader = function()
    {
        gl.useProgram(null);
    }

    // Get uniform location with a cache system
    #GetUniformLocation = function(name)
    {
        var ret = this.#m_UniformLocCache.get(name);
        if(ret != undefined)
            return ret;
        
        ret = gl.getUniformLocation(this.#m_ID, name);
        if(ret == null)
        {
            alert("Uniform location invalid on uniform: ");
            alert(name);
        }

        this.#m_UniformLocCache.set(name, ret);
        return ret;
    }

    // Set Uniforms
    SetUniformMat4f(name, value)
    {
        gl.uniformMatrix4fv(this.#GetUniformLocation(name), false, value);
    }

    SetUniformVec4f(name, value)
    {
        gl.uniform4fv(this.#GetUniformLocation(name), value);
    }

    SetUniformVec3f(name, value)
    {
        gl.uniform3fv(this.#GetUniformLocation(name), value);
    }

    SetUniform1i(name, value)
    {
        gl.uniform1i(this.#GetUniformLocation(name), value);
    }

    SetUniform1f(name, value)
    {
        gl.uniform1f(this.#GetUniformLocation(name), value);
    }
}