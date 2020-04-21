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
}