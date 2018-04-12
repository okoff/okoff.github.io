3DFactory = function () {

var properties = {
	vertexes: [
		{
			x: 0,
			y: 0,
			z: 0,
		},
	],
	edges: [
		{
			a: 0,
			b: 0,
		},
	],
};

var prototypes = {
    getTriangles: function() {
};

var classList = {
	polyhedron: {
        _properties: [
            "vertexes",
            "edges"
        ],
        _prototypes: [
			"getTriangles"
		]
};

var object = {};

// наследуем свойства
for(var name in properties) {    
    object[name] = properties[name];
}

// наследуем методы
for(var method in prototypes) {  
    object.prototype[method] = prototype[method];
}
return object;

}