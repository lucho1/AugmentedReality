class GLShader
{
    #m_Name = "Unnamed Shader";
    #m_ID = 0;
    #m_VertID = 0;
    #m_FragID = 0;

    // --- Constructor ---
    constructor(name, vertex_shader, fragment_shader)
    {
        this.#m_Name = name;

        this.CreateShader(vertex_shader, fragment_shader);
        this.getName = function() { return m_Name; }
        this.getID = function() { return m_ID; }
    }

    // --- Compile a 'sub-' Shader ---
    CompileShader = function(id)
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
       var v_id = this.CompileShader(vertex_shader);
       var f_id = this.CompileShader(fragment_shader);
       var id = gl.createProgram();

        gl.attachShader(id, v_id);
        gl.attachShader(id, f_id);
        gl.linkProgram(id);

        if (!gl.getProgramParameter(id, gl.LINK_STATUS))
        {
            alert("Couldn't Link Shader");
            return null;
        }

        gl.useProgram(id);
        this.#m_VertID = v_id;
        this.#m_FragID = f_id;
        this.#m_ID = id;

        this.vertexPositionAttribute = gl.getAttribLocation(id, "a_Position");
        gl.enableVertexAttribArray(this.vertexPositionAttribute);

        this.ProjUniform = gl.getUniformLocation(id, "u_ProjMatrix");
        this.ModelViewUniform = gl.getUniformLocation(id, "u_ModelViewMatrix");
        this.ColorUniform = gl.getUniformLocation(id, "u_Color");
        gl.useProgram(null);
    }

    BindShader = function()
    {
        gl.useProgram(this.#m_ID)
    }
}