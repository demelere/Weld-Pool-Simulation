// Initialize WebGL
const canvas = document.querySelector('#glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}

// Initialize shaders
const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

// Get the attribute and uniform locations
const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        width: gl.getUniformLocation(shaderProgram, 'uWidth'),
        depth: gl.getUniformLocation(shaderProgram, 'uDepth'),
        energy: gl.getUniformLocation(shaderProgram, 'uEnergy'),
        maxEnergy: gl.getUniformLocation(shaderProgram, 'uMaxEnergy'),
    },
};

// Create buffers
const buffers = initBuffers(gl);

function initBuffers(gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create a square
    const positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create texture coordinate buffer
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        0.0,  1.0,
        1.0,  1.0,
        0.0,  0.0,
        1.0,  0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
    };
}

// Draw the scene
function drawScene(gl, programInfo, buffers, currentData) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create the projection matrix
    const projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1, 1, -1, 1, -1, 1);

    // Create the modelView matrix
    const modelViewMatrix = mat4.create();

    // Tell WebGL how to pull out the positions from the position buffer
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the texture coordinates from buffer
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    
    // Set the current simulation data
    gl.uniform1f(programInfo.uniformLocations.width, currentData[1]);
    gl.uniform1f(programInfo.uniformLocations.depth, currentData[2]);
    gl.uniform1f(programInfo.uniformLocations.energy, currentData[3]);
    gl.uniform1f(programInfo.uniformLocations.maxEnergy, maxValues.energy);

    // Draw the square
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

// Animation state
let currentTimeIndex = 0;
let isAnimating = true;

// UI Elements
const timeSlider = document.getElementById('timeSlider');
const timeValue = document.getElementById('timeValue');
const widthValue = document.getElementById('width');
const depthValue = document.getElementById('depth');
const energyValue = document.getElementById('energy');
const animateCheckbox = document.getElementById('animate');

// Update the display
function updateDisplay(index) {
    const data = simulationData[index];
    timeValue.textContent = data[0].toFixed(1);
    widthValue.textContent = data[1].toFixed(4);
    depthValue.textContent = data[2].toFixed(4);
    energyValue.textContent = data[3].toFixed(1);
    timeSlider.value = index;
    drawScene(gl, programInfo, buffers, data);
}

// Handle window resizing
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

// Animation loop
function animate() {
    resizeCanvasToDisplaySize(canvas);
    
    if (isAnimating) {
        currentTimeIndex = (currentTimeIndex + 1) % simulationData.length;
        updateDisplay(currentTimeIndex);
    }
    
    requestAnimationFrame(animate);
}

// Event listeners
timeSlider.addEventListener('input', (e) => {
    currentTimeIndex = parseInt(e.target.value);
    updateDisplay(currentTimeIndex);
});

animateCheckbox.addEventListener('change', (e) => {
    isAnimating = e.target.checked;
});

// Set up mat4 for matrix operations
const mat4 = {
    create: function() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    },
    ortho: function(out, left, right, bottom, top, near, far) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        
        return out;
    }
};

// Start the animation
animate(); 