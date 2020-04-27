class Mesh
{
    #m_ID = 0;
    #m_VerticesArr = [0.0];
    #m_VertexNum = 0;
    #m_VertexSize = [0];
    
    #m_ModelMatrix = mat4.create();
    #m_Position = [0.0, 0.0, -10.0];
    #m_Orientation = [0.0, 0.0, 0.0];
    
    #m_Color = [1.0, 1.0, 1.0, 1.0];
    #m_Texture = null;

    constructor()
    {
        mat4.identity(this.#m_ModelMatrix);

        this.getID              = function() { return this.#m_ID; }
        this.getVertices        = function() { return this.#m_VerticesArr; }
        this.getVertexNumber    = function() { return this.#m_VertexNum; }
        this.getVertexSize      = function() { return this.#m_VertexSize; }
        
        this.getModelMatrix     = function() { return this.#m_ModelMatrix; }
        this.getPos             = function() { return this.#m_Position; }
        this.getOrientation     = function() { return this.#m_Orientation; }
        
        this.getMeshColor       = function() { return this.#m_Color; }
        this.getMeshTexture     = function() { return this.#m_Texture; }

        this.SetMeshColor       = function(col) { this.#m_Color = col; }
        this.SetMeshTexture     = function(texture) { this.#m_Texture = texture; }
    }

    //Mesh Modifications
    SetPosition = function(pos)
    {
        this.#m_Position = pos;
        mat4.translate(this.#m_ModelMatrix, pos);
    }

    SetRotation = function(degrees, axis)
    {
        var angle = degrees/180*3.1415;
        mat4.rotate(this.#m_ModelMatrix, angle, axis);
    }

    //Mesh Load
    #SetBuffer = function(id, verts_size, vertices, vPosAttribute, TCoordsAttribute)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, id);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var stride = (verts_size[0] + verts_size[1]) * 4.0;
        gl.vertexAttribPointer(vPosAttribute, verts_size[0], gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(TCoordsAttribute, verts_size[1], gl.FLOAT, false, stride, verts_size[0]*4.0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // Load a square with its buffer
    LoadSquare = function(shader)
    {
        this.#m_ID = gl.createBuffer();
        this.#m_VertexNum = 6;
        this.#m_VertexSize = [3, 2];
        
        var verts = [
            -1.0, 1.0, 0.0, 0.0, 1.0,   //v1
            -1.0, -1.0, 0.0, 0.0, 0.0,  //v2
             1.0, 1.0, 0.0, 1.0, 1.0,   //v3
             1.0, 1.0, 0.0, 1.0, 1.0,   //v4
             1.0, -1.0, 0.0, 1.0, 0.0,  //v5
            -1.0, -1.0, 0.0, 0.0, 0.0   //v6
        ];

        this.#SetBuffer(this.#m_ID, this.#m_VertexSize, verts, shader.vPosAtt, shader.vTCoordAtt);
        return this.#m_ID;
    }

    // Load a Triangle with its buffer
    LoadTriangle = function(shader)
    {
        this.#m_ID = gl.createBuffer();
        this.#m_VertexNum = 3;
        this.#m_VertexSize = [3, 2];
        
        var verts = [
             0.0, 1.0, 0.0, 0.5, 1.0,    //v1
            -1.0, -1.0, 0.0, 0.0, 0.0,   //v2
             1.0, -1.0, 0.0, 1.0, 0.0    //v3
        ];
        
        this.#SetBuffer(this.#m_ID, this.#m_VertexSize, verts, shader.vPosAtt, shader.vTCoordAtt); 
        return this.#m_ID;
    }
}