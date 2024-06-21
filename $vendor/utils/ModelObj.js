function Ven$ModelObj_getWordLength(str, start) {
	for (let i = start, len = str.length; i < len; i++) {
		const c = str.charAt(i)
		if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') {
			break
		}
	}
	return i - start
}

function Ven$ModelObj_calcNormal(p0, p1, p2) {
	const v0 = new Float32Array(3)
	const v1 = new Float32Array(3)
	for (let i = 0; i < 3; i++) {
		v0[i] = p0[i] - p1[i]
		v1[i] = p2[i] - p1[i]
	}
	const c = new Float32Array(3)
	c[0] = v0[1] * v1[2] - v0[2] * v1[1]
	c[1] = v0[2] * v1[0] - v0[0] * v1[2]
	c[2] = v0[0] * v1[1] - v0[1] * v1[0]
	const v = new Ven$Vector3(c[0], c[1], c[2])
	v.normalize()
	return v.elements
}

function Ven$ModelObj_readMTLFile(fileString, mtl) {
	let lines = fileString.split('\n')
	lines.push(null)
	let index = 0
	let line
	let name = ''
	let sp = new StringParser()
	while ((line = lines[index++]) != null) {
		sp.init(line)
		let command = sp.getWord()
		if (command == null) {
			continue
		}
		switch (command) {
			case '#': {
				continue
			}
			case 'newmtl': {
				name = mtl.parseNewmtl(sp)
				continue
			}
			case 'Kd': {
				if (name == '') {
					continue
				}
				let material = mtl.parseRGB(sp, name)
				mtl.materials.push(material)
				name = ''
				continue
			}
		}
	}
	mtl.complete = true
}

class Ven$ModelObjStringParser {
	constructor(str) {
		this._str = str
		this._index = -1
	}

	get str() {
		return this._str
	}

	get index() {
		return this._index
	}

	skipDelimiters() {
		for (let i = this._index, len = this._str.length; i < len; i++) {
			const c = this._str.charAt(i)
			if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') {
				continue
			}
			break
		}
		this._index = i
	}

	skipToNextWord() {
		this.skipDelimiters()
		const n = Ven$ModelObj_getWordLength(this._str, this._index)
		this._index += n + 1
	}

	getWord() {
		this.skipDelimiters()
		const n = Ven$ModelObj_getWordLength(this._str, this._index)
		if (n == 0) {
			return null
		}
		const word = this._str.substr(this._index, n)
		this._index += n + 1
		return word
	}

	getInt() {
		return parseInt(this.getWord())
	}

	getFloat() {
		return parseFloat(this.getWord())
	}
}

class Ven$ModelObjFace {
	constructor(materialName) {
		this._materialName = materialName
		if (materialName == null) {
			this._materialName = ''
		}
		this._vIndices = []
		this._nIndices = []
	}

	get materialName() {
		return this._materialName
	}

	get vIndices() {
		return this._vIndices
	}

	get nIndices() {
		return this._nIndices
	}
}

class Ven$ModelObjDrawingInfo {
	constructor(vertices, normals, colors, indices) {
		this._vertices = vertices
		this._normals = normals
		this._colors = colors
		this._indices = indices
	}

	get vertices() {
		return this._vertices
	}

	get normals() {
		return this._normals
	}

	get colors() {
		return this._colors
	}

	get indices() {
		return this._indices
	}
}

class Ven$ModelObjInsObject {
	constructor(name) {
		this._name = name
		this._faces = []
		this._numIndices = 0
	}

	get name() {
		return this._name
	}

	get faces() {
		return this._faces
	}

	get numIndices() {
		return this._numIndices
	}
}

class Ven$ModelObjColor {
	constructor(r, g, b, a) {
		this._r = r
		this._g = g
		this._b = b
		this._a = a
	}

	get r() {
		return this._r
	}

	get g() {
		return this._g
	}

	get b() {
		return this._b
	}

	get a() {
		return this._a
	}
}

class Ven$ModelObjNormal {
	constructor(x, y, z) {
		this._x = x
		this._y = y
		this._z = z
	}

	get x() {
		return this._x
	}

	get y() {
		return this._y
	}

	get z() {
		return this._z
	}
}

class Ven$ModelObjVertex {
	constructor(x, y, z) {
		this._x = x
		this._y = y
		this._z = z
	}

	get x() {
		return this._x
	}

	get y() {
		return this._y
	}

	get z() {
		return this._z
	}
}

class Ven$ModelObjMaterial {
	constructor(name, r, g, b, a) {
		this._name = name
		this._color = new Ven$ModelObjColor(r, g, b, a)
	}

	get name() {
		return this._name
	}

	get color() {
		return this._color
	}
}

class Ven$ModelObjMTLDoc {
	constructor() {
		this._complete = false
		this._materials = []
	}

	parseNewmtl(sp) {
		return sp.getWord()
	}

	parseRGB(sp, name) {
		const r = sp.getFloat()
		const g = sp.getFloat()
		const b = sp.getFloat()
		return new Ven$ModelObjMaterial(name, r, g, b, 1)
	}
}

class Ven$ModelObjInsDoc {
	constructor(fileName) {
		this._fileName = fileName
		this._mtls = []
		this._objects = []
		this._vertices = []
		this._normals = []
	}

	get fileName() {
		return this._fileName
	}

	get mtls() {
		return this._mtls
	}

	get objects() {
		return this._objects
	}

	get vertices() {
		return this._vertices
	}

	get normals() {
		return this._normals
	}

	parse(fileString, scale, reverse) {
		const lines = fileString.split('\n')
		lines.push(null)
		const sp = new Ven$ModelObjStringParser()
		let index = 0
		let currentObject = null
		let currentMaterialName = ''
		let line
		while ((line = lines[index++]) != null) {
			sp.init(line)
			const command = sp.getWord()
			if (command == null) {
				continue
			}
			switch (command) {
				case '#': {
					continue
				}
				case 'mtllib': {
					const path = this.parseMtllib(sp, this.fileName)
					const mtl = new Ven$ModelObjMTLDoc()
					this._mtls.push(mtl)
					const request = new XMLHttpRequest()
					request.onreadystatechange = function () {
						if (request.readyState == 4) {
							if (request.status != 404) {
								Ven$ModelObj_readMTLFile(request.responseText, mtl)
							} else {
								mtl.complete = true
							}
						}
					}
					request.open('GET', path, true)
					request.send()
					continue
				}
				case 'o':
				case 'g': {
					const object = this.parseObjectName(sp)
					this._objects.push(object)
					currentObject = object
					continue
				}
				case 'v': {
					const vertex = this.parseVertex(sp, scale)
					this._vertices.push(vertex)
					continue
				}
				case 'vn': {
					const normal = this.parseNormal(sp)
					this._normals.push(normal)
					continue
				}
				case 'usemtl': {
					currentMaterialName = this.parseUsemtl(sp)
					continue
				}
				case 'f': {
					const face = this.parseFace(sp, currentMaterialName, this._vertices, reverse)
					currentObject.addFace(face)
					continue
				}
			}
		}
		return true
	}

	parseMtllib(sp, fileName) {
		const i = fileName.lastIndexOf('/')
		let dirPath = ''
		if (i > 0) {
			dirPath = fileName.substr(0, i + 1)
		}
		return dirPath + sp.getWord()
	}

	parseObjectName(sp) {
		return new Ven$ModelObjInsObject(sp.getWord())
	}

	parseVertex(sp, scale) {
		const x = sp.getFloat() * scale
		const y = sp.getFloat() * scale
		const z = sp.getFloat() * scale
		return new Ven$ModelObjVertex(x, y, z)
	}

	parseNormal(sp) {
		const x = sp.getFloat()
		const y = sp.getFloat()
		const z = sp.getFloat()
		return new Ven$ModelObjNormal(x, y, z)
	}

	parseUsemtl(sp) {
		return sp.getWord()
	}

	parseFace(sp, materialName, vertices, reverse) {
		const face = new Ven$ModelObjFace(materialName)
		for (;;) {
			const word = sp.getWord()
			if (word == null) {
				break
			}
			const subWords = word.split('/')
			if (subWords.length >= 1) {
				let vi = parseInt(subWords[0]) - 1
				face.vIndices.push(vi)
			}
			if (subWords.length >= 3) {
				const ni = parseInt(subWords[2]) - 1
				face.nIndices.push(ni)
			} else {
				face.nIndices.push(-1)
			}
		}
		const v0 = [vertices[face.vIndices[0]].x, vertices[face.vIndices[0]].y, vertices[face.vIndices[0]].z]
		const v1 = [vertices[face.vIndices[1]].x, vertices[face.vIndices[1]].y, vertices[face.vIndices[1]].z]
		const v2 = [vertices[face.vIndices[2]].x, vertices[face.vIndices[2]].y, vertices[face.vIndices[2]].z]
		let normal = Ven$ModelObj_calcNormal(v0, v1, v2)
		if (normal == null) {
			if (face.vIndices.length >= 4) {
				let v3 = [vertices[face.vIndices[3]].x, vertices[face.vIndices[3]].y, vertices[face.vIndices[3]].z]
				normal = calcNormal(v1, v2, v3)
			}
			if (normal == null) {
				normal = [0.0, 1.0, 0.0]
			}
		}
		if (reverse) {
			normal[0] = -normal[0]
			normal[1] = -normal[1]
			normal[2] = -normal[2]
		}
		face.normal = new Normal(normal[0], normal[1], normal[2])
		if (face.vIndices.length > 3) {
			const n = face.vIndices.length - 2
			const newVIndices = new Array(n * 3)
			const newNIndices = new Array(n * 3)
			for (let i = 0; i < n; i++) {
				newVIndices[i * 3 + 0] = face.vIndices[0]
				newVIndices[i * 3 + 1] = face.vIndices[i + 1]
				newVIndices[i * 3 + 2] = face.vIndices[i + 2]
				newNIndices[i * 3 + 0] = face.nIndices[0]
				newNIndices[i * 3 + 1] = face.nIndices[i + 1]
				newNIndices[i * 3 + 2] = face.nIndices[i + 2]
			}
			face.vIndices = newVIndices
			face.nIndices = newNIndices
		}
		face.numIndices = face.vIndices.length
		return face
	}

	isMTLComplete() {
		if (this._mtls.length == 0) {
			return true
		}
		for (let i = 0; i < this._mtls.length; i++) {
			if (!this._mtls[i].complete) {
				return false
			}
		}
		return true
	}

	findColor(name) {
		for (let i = 0; i < this._mtls.length; i++) {
			for (let j = 0; j < this._mtls[i].materials.length; j++) {
				if (this._mtls[i].materials[j].name == name) {
					return this._mtls[i].materials[j].color
				}
			}
		}
		return new Ven$ModelObjColor(0.8, 0.8, 0.8, 1)
	}

	getDrawingInfo() {
		let numIndices = 0
		for (let i = 0; i < this._objects.length; i++) {
			numIndices += this._objects[i].numIndices
		}
		const numVertices = numIndices
		const vertices = new Float32Array(numVertices * 3)
		const normals = new Float32Array(numVertices * 3)
		const colors = new Float32Array(numVertices * 4)
		const indices = new Uint16Array(numIndices)
		let index_indices = 0
		for (let i = 0; i < this._objects.length; i++) {
			const object = this._objects[i]
			for (let j = 0; j < object.faces.length; j++) {
				const face = object.faces[j]
				const color = this.findColor(face.materialName)
				const faceNormal = face.normal
				for (let k = 0; k < face.vIndices.length; k++) {
					indices[index_indices] = index_indices
					const vIdx = face.vIndices[k]
					const vertex = this._vertices[vIdx]
					vertices[index_indices * 3 + 0] = vertex.x
					vertices[index_indices * 3 + 1] = vertex.y
					vertices[index_indices * 3 + 2] = vertex.z
					colors[index_indices * 4 + 0] = color.r
					colors[index_indices * 4 + 1] = color.g
					colors[index_indices * 4 + 2] = color.b
					colors[index_indices * 4 + 3] = color.a
					let nIdx = face.nIndices[k]
					if (nIdx >= 0) {
						let normal = this._normals[nIdx]
						normals[index_indices * 3 + 0] = normal.x
						normals[index_indices * 3 + 1] = normal.y
						normals[index_indices * 3 + 2] = normal.z
					} else {
						normals[index_indices * 3 + 0] = faceNormal.x
						normals[index_indices * 3 + 1] = faceNormal.y
						normals[index_indices * 3 + 2] = faceNormal.z
					}
					index_indices++
				}
			}
		}
		return new Ven$ModelObjDrawingInfo(vertices, normals, colors, indices)
	}
}
