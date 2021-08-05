import { render, Fragment, h, useState } from '../../src/index'

function View() {
	const [key, setKey] = useState([])
	const modifyList = () => {
		const array = []
		for (let i = 0; i < 50000; i++) {
			array.push(Math.random())
		}
		setKey(array)
    console.log(key, array)
	}
	return (
		<div className="row-view">
			<div onClick={() => { modifyList() }}>Modify List {key.length}</div>
			<ul>
				{key.map((item, index) => {
					return <li>{item}</li>
				})}
			</ul>
		</div>
	)
}
render(<View />, document.getElementById('app'))
render(<View />, document.getElementById('app2'))