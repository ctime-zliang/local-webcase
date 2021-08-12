import { render, Fragment, h, useState } from '../../src/index'

function View() {
	const [number, setNumber] = useState(0)
	const [list, setList] = useState([])
	const modifyList = () => {
		setNumber(number + 1)
		const array = []
		for (let i = 0; i < number; i++) {
			array.push(i)
		}
		setList(array)
	}
	return (
		<div className="row-view">
			<div onClick={modifyList}>
				Modify List {list.length} - {number}
			</div>
			<ul>
				<li>Initial Li</li>
				{list.map((item, index) => {
					return <li>{item}</li>
				})}
			</ul>
		</div>
	)
}
render(<View />, document.getElementById('app'))