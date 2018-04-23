class Context3D {
	
	constructor(canvas, opt_attribs, opt_onError) {
		
		this.gl = null;
	  
		function handleCreationError(msg) {
			let GET_A_WEBGL_BROWSER = '' +
	'This page requires a browser that supports WebGL.<br/>' +
	'<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
			let OTHER_PROBLEM = '' +
	"It doesn't appear your computer can support WebGL.<br/>" +
	'<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';
			let container = canvas.parentNode;
			if (container) {
				let str = window.WebGLRenderingContext ?
					OTHER_PROBLEM :
					GET_A_WEBGL_BROWSER;
				if (msg) {
					str += "<br/><br/>Status: " + msg;
				}
				container.innerHTML = '' +
    '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
    '<td align="center">' +
    '<div style="display: table-cell; vertical-align: middle;">' +
    '<div style="">' + str + '</div>' +
    '</div>' +
    '</td></tr></table>';
			}
		};

		opt_onError = opt_onError || handleCreationError;

		if (canvas.addEventListener) {
			canvas.addEventListener("webglcontextcreationerror", function(event) {
				opt_onError(event.statusMessage);
			}, false);
		}
		
		let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		for (let ii = 0; ii < names.length; ++ii) {
			try {
				this.gl = canvas.getContext(names[ii], opt_attribs);
				this.glname = names[ii];
				this.gl.viewportWidth = canvas.width;
				this.gl.viewportHeight = canvas.height;
			} catch(e) {}
			if (this.gl) {
				break;
			}
		}

		if (!this.gl) {
			if (!window.WebGLRenderingContext) {
			  opt_onError("");
			}
		}
	};
	
	setColor(p) {
		this.gl.clearColor(p.r, p.g, p.b, p.a);
	};
	
	setBuffers(vertices,triangles) {
		this.vertices = vertices;
		this.VertexPositionBuffer = this.gl.createBuffer();
		this.VertexPositionBuffer.itemSize = 3;
		this.VertexPositionBuffer.numItems = vertices.length/this.VertexPositionBuffer.itemSize;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		
		this.VertexIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
        this.VertexIndexBuffer.itemSize = 2;
        this.VertexIndexBuffer.numItems = triangles.length;
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), this.gl.STATIC_DRAW);
	}
	
	setShaders(vsrc,fsrc) {
		this.vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vshader, vsrc);
        this.gl.compileShader(this.vshader);
        if (!this.gl.getShaderParameter(this.vshader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(this.vshader));
            return null;
        }
		this.fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fshader, fsrc);
        this.gl.compileShader(this.fshader);
        if (!this.gl.getShaderParameter(this.fshader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(this.fshader));
            return null;
        }
		this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, this.vshader);
		this.gl.attachShader(this.shaderProgram, this.fshader);
        this.gl.linkProgram(this.shaderProgram);
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        this.gl.useProgram(this.shaderProgram);
		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
	}

	drawScene(s) {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		if (s) {
			//console.log(s);
			this.gl.enable(this.gl.SCISSOR_TEST);
			this.gl.scissor(s.x, s.y, s.w, s.h);
		}
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		if (this.VertexIndexBuffer && this.VertexIndexBuffer.numItems>0) {
			//gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
			this.gl.drawElements(this.gl.LINES, this.VertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
		}
	};
	
};