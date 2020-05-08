class Camera
{
    #m_Pos = [0.0, 0.0, 5.0];
    #m_Yaw = 0.0;
    #m_Pitch = 0.0;

    constructor()
    {
        this.getPosition = function() { return this.#m_Pos; }
        this.getXRotation = function() { return this.#m_Pitch; }
        this.getYRotation = function() { return this.#m_Yaw; }
    }

    MoveCamera = function(dt)
    {
        //https://keycode.info/
        var speed = 20.0;
        var mouse_speed = 50.0;
        
        //Process Keyboard
        if(input.keys[16] == ButtonState.PRESSED) //SHIFT == double speed
            speed *= 2.0;
        if(input.keys[87] == ButtonState.PRESSED) //W
            this.#m_Pos[2] -= speed * dt;
        if(input.keys[83] == ButtonState.PRESSED) //S
            this.#m_Pos[2] += speed * dt;
        if(input.keys[65] == ButtonState.PRESSED) //A
            this.#m_Pos[0] -= speed * dt;
        if(input.keys[68] == ButtonState.PRESSED) //D
            this.#m_Pos[0] += speed * dt;
        if(input.keys[69] == ButtonState.PRESSED) //E
            this.#m_Pos[1] += speed * dt;
        if(input.keys[81] == ButtonState.PRESSED) //Q
            this.#m_Pos[1] -= speed * dt;
        if(input.keys[70] == ButtonState.PRESSED) //F
            this.#ResetCameraTransform();

        //Process Mouse
        if(input.mouseButtons[0] == ButtonState.PRESSED) //Rotation
            this.#CameraRotation();
        if(input.mouseButtons[1] == ButtonState.PRESSED) //Pan
            this.#CameraPanning(dt);
        if(input.mouseButtons[0] == ButtonState.SCROLLED) //Zoom
            this.#CameraZoom(mouse_speed, dt);
    }

    #ResetCameraTransform = function()
    {
        this.#m_Pos = [0.0, 0.0, 5.0];
        this.#m_Yaw = 0.0;
        this.#m_Pitch = 0.0;
    }

    #CameraRotation = function()
    {
        this.#m_Yaw += input.mouseDX * 0.01;
        this.#m_Yaw = mod(this.#m_Yaw, TWOPI);
        this.#m_Pitch += input.mouseDY * 0.01;
        this.#m_Pitch = clamp(this.#m_Pitch, -HALFPI, HALFPI);
    }

    #CameraPanning = function(dt)
    {
        this.#m_Pos[0] -= input.mouseDX*dt;
        this.#m_Pos[1] += input.mouseDY*dt;
    }

    #CameraZoom = function(vel, dt)
    {
        var dir = input.mouseDW/100;
        this.#m_Pos[2] += dir * vel * dt;
    }
}