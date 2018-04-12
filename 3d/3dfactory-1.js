class Factory3D {
	
	constructor() {
		this.objects = [];
	}
	
	polyhedron (vertexes,edges) {
		let obj = {};
		obj.vertexes = vertexes;
		obj.edges = edges;
		obj.triangles = [];
		this.objects.push(obj);
		console.log("Objects: " + this.objects.length);
		return obj;
	}

}