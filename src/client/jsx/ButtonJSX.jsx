import React from "jsx-dom"
function Button(name) {
	return (
		<button className="button is-black is-medium has-text-centered">
			<span className="icon">
				<i className="mdi mdi-gamepad"></i>
			</span>
			<span>{name}</span>
		</button>
	)
}

export default Button;