console.log('yolo')

import React from 'react'
import ReactDOM from 'react-dom'

var ArticlesView = React.createClass({

	render: function() {
		console.log(this)
		return (
			<div className="articlesView">
				<Header />
				<NewsContainer />
			</div>
			)
	} 
})

var Header = React.createClass({
	render: function() {
		return (
			<div className="headerContainer">
				<h1>This Just In</h1>
				<input />
			</div>
			)
	}
})

var NewsContainer = React.createClass({
	render: function() {
		return (
			<div className="newsContainer">
			</div>
		)
	}
})

export default ArticlesView