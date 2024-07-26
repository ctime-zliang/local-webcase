function inputFilter() {
	console.log(ven$onlyPositiveFloatNumber({ value: '12.5245' }))
	console.log(ven$onlyPositiveFloatNumber({ value: '-12.5245' }, 3))

	console.log(ven$onlyRationalFloatNumber({ value: '12.5245' }))
	console.log(ven$onlyRationalFloatNumber({ value: '-12.5245' }, 3))
}
