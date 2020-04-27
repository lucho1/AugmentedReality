class Texture
{
    #m_ID = 0;
    #m_Image = null;
    #m_Path = "null";

    constructor(path)
    {
        this.#GenerateTexture(path);

        this.getPath = function() { return this.#m_Path; }
        this.getID = function() { return this.#m_ID; }
        this.getImage = function() { return this.#m_Image; }
    }

    #GenerateTexture = function(path)
    {
        this.#m_ID = gl.createTexture();
        this.#m_Image = new Image();

        this.#m_Image.onload = function() { this.#LoadTexture(this.#m_Image, this.#m_ID) }
        this.#m_Path = path;
    }

    #LoadTexture = function(image, texture)
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}