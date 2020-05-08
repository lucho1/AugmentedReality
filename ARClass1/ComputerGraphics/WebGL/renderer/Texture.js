var p_Texture;
LoadTexture = function(texture)
{
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
}

class Texture
{
    #m_Texture = 0;
    #m_Path = "";

    constructor(path, name)
    {
        this.#GenerateTexture(path);
        this.getTexture = function() { return this.#m_Texture; }
    }

    #GenerateTexture = function(path)
    {
        p_Texture = gl.createTexture();
        p_Texture.image = new Image();
        p_Texture.image.onload = function() { LoadTexture(p_Texture) }
        p_Texture.image.src = path;
        this.#m_Texture = p_Texture;
        this.#m_Path = p_Texture.image.src;
    }
}