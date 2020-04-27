class Texture
{
    constructor(path)
    {
        this.#GenerateTexture(path);
    }

    #GenerateTexture = function(path)
    {
        var texture = gl.createTexture();
        var image = new Image();
        this.#LoadTexture(image, texture);
        image.src = path;
    }

    #LoadTexture = function(image, texture)
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
    }
}