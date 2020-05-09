function LoadModel(file, shader, scene)
{ 
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(request.readyState == request.DONE) // == 4
        {
            if(request.status == 200 && request.response)
            {
                var new_mesh = new Mesh();
                new_mesh.handleLoadedModel(JSON.parse(request.responseText), shader);
                scene.AddMeshToScene(new_mesh);
            }
            else
            console.log("Failed to load " + request.status + " " + request.statusText);
        }
    }
    
    request.open("GET", file);
    request.send();
}

class Mesh
{
    //Buffers
    #m_VBOID = 0;
    #m_VertexSize = [0];

    #m_IBOID = 0;
    #m_IndicesSize = 0;
    
    //Transformations
    #m_ModelMatrix = mat4.create();
    #m_Position = [0.0, 0.0, -10.0];
    #m_Orientation = [0.0, 0.0, 0.0];
    
    //Graphics
    #m_Color = [1.0, 1.0, 1.0, 1.0];
    #m_Texture = null;

    constructor()
    {        
        //Buffers
        this.getID              = function() { return this.#m_VBOID; }
        this.getVertexSize      = function() { return this.#m_VertexSize; }
        this.getIndices         = function() { return this.#m_IBOID; }
        this.getIndicesSize     = function() { return this.#m_IndicesSize; }
        
        //Transformations
        mat4.identity(this.#m_ModelMatrix);
        this.getModelMatrix     = function() { return this.#m_ModelMatrix; }
        this.getPos             = function() { return this.#m_Position; }
        this.getOrientation     = function() { return this.#m_Orientation; }
        
        //Graphics
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

    #SetIndexBuffer = function(id, indices)
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, id);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    // Load a square with its buffer
    LoadSquare = function(shader)
    {
        this.#m_VBOID = gl.createBuffer();
        this.#m_VertexSize = [3, 2];
        
        var verts = [
             1.0, -1.0, 0.0, 1.0, 0.0,
             1.0, 1.0, 0.0, 1.0, 1.0,
            -1.0, 1.0, 0.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0, 0.0
        ];

        var indices = [ 0, 1, 3, 3, 2, 1];
        this.#m_IBOID = gl.createBuffer();
        this.#m_IndicesSize = 6;
        
        this.#SetBuffer(this.#m_VBOID, this.#m_VertexSize, verts, shader.vPosAtt, shader.vTCoordAtt);
        this.#SetIndexBuffer(this.#m_IBOID, indices);
        return this.#m_VBOID;
    }

    // Load a Triangle with its buffer
    LoadTriangle = function(shader)
    {
        this.#m_VBOID = gl.createBuffer();
        this.#m_VertexSize = [3, 2];
        
        var verts = [
             0.0, 1.0, 0.0, 0.5, 1.0,
            -1.0, -1.0, 0.0, 0.0, 0.0,
             1.0, -1.0, 0.0, 1.0, 0.0
        ];
        
        var indices = [0, 1, 2];
        this.#m_IBOID = gl.createBuffer();
        this.#m_IndicesSize = 3;

        this.#SetBuffer(this.#m_VBOID, this.#m_VertexSize, verts, shader.vPosAtt, shader.vTCoordAtt); 
        this.#SetIndexBuffer(this.#m_IBOID, indices);
        return this.#m_VBOID;
    }


    handleLoadedModel(modelData, shader)
    {
        //Put Geometry Together
        var vPos_Arr = modelData.vertexPositions;
        var tC_Arr = modelData.vertexTextureCoords;
        var vertices = [];

        var i = 0, j = 0, k = 0;
        while(i < (vPos_Arr.length + tC_Arr.length))
        {
            vertices[i] = vPos_Arr[j];
            vertices[i+1] = vPos_Arr[j+1];
            vertices[i+2] = vPos_Arr[j+2];
            vertices[i+3] = tC_Arr[k];
            vertices[i+4] = tC_Arr[k+1];
            i += 5; j += 3; k += 2;
        }
        
        //Setup Vertices (pos + tCoord)
        this.#m_VertexSize = [3, 2];
        this.#m_VBOID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#m_VBOID);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        gl.vertexAttribPointer(shader.vPosAtt, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(shader.vTCoordAtt, 2, gl.FLOAT, false, 20, 3*4.0);
        
        this.#m_IndicesSize = modelData.indices.length;
        this.#m_IBOID = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#m_IBOID);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indices), gl.STATIC_DRAW);

        //Unbind All
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}