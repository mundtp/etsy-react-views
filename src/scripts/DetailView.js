import React from 'react'
import ReactDOM from 'react-dom'

var DetailView = React.createClass({

	render: function() {
		console.log(this.props.notKey.attributes)
		return (
			<div className="detailView">
				<NavBar />
				<h1> {this.props.notKey.get('title')} </h1>
				<img src={this.props.notKey.get('Images')[0].url_fullxfull}/>
				<p>Price: ${this.props.notKey.get('price')} </p>
				<p> {this.props.notKey.get('description')} </p>
			</div>
			)
	}
})

var NavBar = React.createClass({
	_doSearch: function(e) {
		if (e.keyCode === 13) {
		location.hash = "search/" + e.target.value
		e.target.value = ''
		}
	},


		render: function() {
			//We are returning a virtual DOM element of the Header class that has children h1 and input.
			return (
				<div id="navBar">
				<a href="#home">Home</a>
				<a>Clothing & Accessories</a>
				<a>Jewelry</a>
				<a>Weddings</a>
				<a>Entertainment</a>
				<a>Craft Supplies</a>
				<a>Tools</a>
				<input onKeyDown={this._doSearch} type="text" placeholder="Search an item"/>
				</div>
				)
		}
})

export default DetailView