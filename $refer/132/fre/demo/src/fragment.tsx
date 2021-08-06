import { render, Fragment, h, useState } from '../../src/index'

function View() {
	const [key, setKey] = useState([])
	const modifyList = () => {
		const array = []
		for (let i = 0; i < 20000; i++) {
			array.push(Math.random())
		}
		setKey(array)
    console.log(key, array)
	}
	return (
		<main>
			<button onClick={() => { modifyList() }}> Modify List {key.length}</button>
			<ul>
				{key.map((item, index) => {
					return <li>{item}</li>
				})}
			</ul>
		</main>
	)
}
render(<View />, document.getElementById('app'))