class Factory3D {
	
	constructor() {
		this.objects = [];
	}
	
	polyhedron (vertexes,edges) {
		let obj = {};
		obj.vertexes = [];
		obj.edges = [];
		vertexes.forEach(function(e) {
			obj.vertexes.push(Object.assign({}, e));
		});
		edges.forEach(function(e) {
			obj.edges.push(Object.assign({}, e));
		});
		obj.id = this.objects.length+1;
		obj.move = function (vect) {
				this.vertexes.forEach(function(e) {
					e.x += vect.x;
					e.y += vect.y;
					e.z += vect.z;
				});
			};
		obj.scale = function (vect) {
				this.vertexes.forEach(function(e) {
					e.x *= vect.x;
					e.y *= vect.y;
					e.z *= vect.z;
				});
			}
		this.objects.push(obj);
		//console.log(obj);
		//console.log("Objects: " + this.objects.length);
		return obj;
	}
	
	move (obj, vect) {
		obj.vertexes.forEach(function(e) {
			e.x += vect.x;
			e.y += vect.y;
			e.z += vect.z;
		});
	}
	
	scale (obj, vect) {
		obj.vertexes.forEach(function(e) {
			e.x *= vect.x;
			e.y *= vect.y;
			e.z *= vect.z;
		});
	}
	
	triangles (obj) {
		obj.triangles = [];
		let e = obj.edges;
		let m = obj.edges.length;
		
		function edge_exists(em,e) {
			for (let f in em) {
				if (em[f].a == e.a && em[f].b == e.b) {
					return true;
				}
			}
			return false;
		}
		
		function intersect(v,e1,e2) {
			let mx = mat3.create();
			mx[0] = v[e1.b].x-v[e1.a].x;
			mx[1] = v[e1.b].y-v[e1.a].y;
			mx[2] = v[e1.b].z-v[e1.a].z;
			mx[3] = v[e2.b].x-v[e2.a].x;
			mx[4] = v[e2.b].y-v[e2.a].y;
			mx[5] = v[e2.b].z-v[e2.a].z;
			mx[6] = v[e1.a].x-v[e2.a].x;
			mx[7] = v[e1.a].y-v[e2.a].y;
			mx[8] = v[e1.a].z-v[e2.a].z;
			return mat3.determinant(mx);
		}
			
		for (let v1=0; v1<m-1; v1++) {
			for (let v2=v1+1; v2<m; v2++) {
				if(e[v1].a == e[v2].a) {
					let n = {
						a: e[v1].b,
						b: e[v2].b,
						m: true
					}
					if (edge_exists(e,n)) {
						continue;
					}
					e.push(n);
					//console.log("+n: " + n.a + "-" + n.b);
				} else {
					break;
				}
			}
		}
		
		//console.log(e);
		//e.push(a);
		//e.sort(function(x,y){return(x.a-y.a)});
		m = e.length;
		//console.log(e);
		
		for (let v1=0; v1<m-1; v1++) {
			//console.log("e[" + v1 + "]: " + e[v1].a + "-" + e[v1].b);
			for (let v2=v1+1; v2<m; v2++) {
				if(e[v1].a == e[v2].a) {
					let n;
					if (e[v1].b < e[v2].b) {
						n = {
							a: e[v1].b,
							b: e[v2].b
						}
					} else {
						n = {
							a: e[v2].b,
							b: e[v1].b
						}
					}
					if (!edge_exists(e,n)) {
						continue;
					}
					if ((e[v1].m || false) && (e[v2].m || false)) {
						continue;
					}
					let t = {
						a: e[v1].a,
						b: e[v1].b,
						c: e[v2].b
					};
					obj.triangles.push(t);
					//console.log("+t(a): " + t.a + " " + t.b + " " + t.c);
				}
			}
		}

		//for (let e1 in a) {
		//	for (let e2 in a) {
		//		let x = intersect(obj.vertexes,a[e1],a[e2]);
		//		console.log("X: " + a[e1].a + "-" + a[e1].b + " x " + a[e2].a + "-" + a[e2].b + " = " + x);
		//	}
		//}
			
		return obj.triangles;
	}

}