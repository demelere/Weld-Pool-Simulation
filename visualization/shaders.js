const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying vec2 vTextureCoord;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    
    varying vec2 vTextureCoord;
    
    uniform float uWidth;
    uniform float uDepth;
    uniform float uEnergy;
    uniform float uMaxEnergy;
    
    void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vTextureCoord, center);
        
        // Normalize width and depth to visualization space
        float normWidth = uWidth / 2.0;  // Assuming max width is around 2.0 cm
        float normDepth = uDepth / 0.8;  // Assuming max depth is around 0.8 cm
        
        // Create an elliptical shape for the weld pool
        float poolShape = smoothstep(normWidth, normWidth - 0.1, dist);
        
        // Energy-based color gradient
        float energyNorm = uEnergy / uMaxEnergy;
        vec3 poolColor = mix(
            vec3(0.8, 0.4, 0.0),  // Cooler orange
            vec3(1.0, 0.9, 0.3),  // Hot yellow
            energyNorm
        );
        
        // Add depth-based shading
        float depthShading = 1.0 - (dist / normWidth) * normDepth;
        depthShading = clamp(depthShading, 0.0, 1.0);
        
        // Combine colors with pool shape and depth
        vec3 finalColor = poolColor * poolShape * depthShading;
        
        // Add glow effect
        float glow = smoothstep(normWidth + 0.2, normWidth, dist) * 0.5;
        finalColor += vec3(1.0, 0.6, 0.2) * glow;
        
        gl_FragColor = vec4(finalColor, poolShape);
    }
`;

// Function to create and compile a shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Function to initialize the shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
} 