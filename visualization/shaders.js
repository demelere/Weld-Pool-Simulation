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
    
    // Common uniforms
    uniform int uVisualizationType;  // 0 for weld pool, 1 for temperature
    
    // Weld pool uniforms
    uniform float uWidth;
    uniform float uDepth;
    uniform float uEnergy;
    uniform float uMaxEnergy;
    
    // Temperature uniforms
    uniform float uTemperature;
    uniform float uMinTemp;
    uniform float uMaxTemp;
    
    // Color mapping function for temperature
    vec3 temperatureToColor(float temp) {
        float t = (temp - uMinTemp) / (uMaxTemp - uMinTemp);
        
        // Blue (cold) to Red (hot) colormap
        vec3 cold = vec3(0.0, 0.0, 1.0);  // Blue
        vec3 medium = vec3(1.0, 1.0, 1.0); // White
        vec3 hot = vec3(1.0, 0.0, 0.0);    // Red
        
        if (t < 0.5) {
            return mix(cold, medium, t * 2.0);
        } else {
            return mix(medium, hot, (t - 0.5) * 2.0);
        }
    }
    
    void main() {
        if (uVisualizationType == 0) {
            // Weld pool visualization
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vTextureCoord, center);
            
            float normWidth = uWidth / 2.0;
            float normDepth = uDepth / 0.8;
            
            float poolShape = smoothstep(normWidth, normWidth - 0.1, dist);
            
            float energyNorm = uEnergy / uMaxEnergy;
            vec3 poolColor = mix(
                vec3(0.8, 0.4, 0.0),
                vec3(1.0, 0.9, 0.3),
                energyNorm
            );
            
            float depthShading = 1.0 - (dist / normWidth) * normDepth;
            depthShading = clamp(depthShading, 0.0, 1.0);
            
            vec3 finalColor = poolColor * poolShape * depthShading;
            float glow = smoothstep(normWidth + 0.2, normWidth, dist) * 0.5;
            finalColor += vec3(1.0, 0.6, 0.2) * glow;
            
            gl_FragColor = vec4(finalColor, poolShape);
        } else {
            // Temperature visualization
            vec3 color = temperatureToColor(uTemperature);
            gl_FragColor = vec4(color, 1.0);
        }
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