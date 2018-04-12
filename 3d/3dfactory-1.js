class Factory3D {
	
	constructor() {
		this.objects = [];
	}
	
	polyhedron (vertexes,edges) {
		let obj = {};
		obj.vertexes = vertexes;
		obj.edges = edges;
		this.objects.push(obj);
//		console.log("Objects: " + this.objects.length);
		return obj;
	}
	
	triangles (obj) {
		obj.triangles = [];
		for (let v1=0; v1<obj.edges.length-1; v1++) {
			for (let v2=v1+1; v2<obj.edges.length; v2++) {
				if(obj.edges[v1].a == obj.edges[v2].a) {
					let t = {
						a: obj.edges[v1].a,
						b: obj.edges[v1].b,
						c: obj.edges[v2].b
					};
					obj.triangles.push(t);
					console.log("+t(a): " + t.a + " " + t.b + " " + t.c);
				}
				if(obj.edges[v1].b == obj.edges[v2].a) {
					let t = {
						a: obj.edges[v1].a,
						b: obj.edges[v1].b,
						c: obj.edges[v2].b
					};
					obj.triangles.push(t);
					console.log("+t(b): " + t.a + " " + t.b + " " + t.c);
				}
			}
		}
		return obj.triangles;
	}

}