import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'


const app = function() { 

	var ArticlesView = React.createClass({
		render: function() {
			//this return creates a virtual DOM element and will render this html to the DOM. 
			return (
				<div className="articlesView">
				{/*The Header and NewsContainer will be rendered as children of the div.articlesView. We define them later.*/}
					<Header />
				{/*We are adding a key-value pair of the form articleColl:[Backbone collection] to the props object on the NewsContainer component */}
					<NewsContainer articleColl={this.props.articleColl} />
				</div>
				)
		} 
	})

	var Header = React.createClass({
		render: function() {
			//We are returning a virtual DOM element of the Header class that has children h1 and input.
			return (
				<div className="headerContainer">
					<h1>This Just In</h1>
					<input />
				</div>
				)
		}
	})

	var NewsContainer = React.createClass({

		_getJsxArray: function(articlesArray) {
			// We are creating an empty array and will pass each article model to it.
			var jsxArray = []
			// .forEach is a built-in method for arrays that takes a callback function as input. For each element of the articlesArray, we are passing that element into the callback function. 

			articlesArray.forEach(function(model){
				jsxArray.push(<Article articleModel={model} />)
			})
			//For each articlesArray model we are creating an Article component with custom properties that stores information specfic to the article. Our callback function is pushing each model of the articlesArray to the jsxArray.


			// The following lines accomplish the same as the forEach method:

			// for (var i = 0; i < articlesArray.length; i ++) {
			// 	var model = articlesArray[i]
			// 	// push onto my jsxArray an Article component that has this 
			// 	// model on its props
			// 	jsxArray.push(<Article articleModel={model} />)
			// }

			return jsxArray
		},

		render: function() {
			/*We are invoking the _getJsxArray method to get each model from the article collection and the return value of this method will be an array of article models that will displayed in the NewsContainer class.*/
			return (
				<div className="newsContainer">
					{this._getJsxArray(this.props.articleColl.models)}
				</div>
			)
		}
	})

	var Article = React.createClass({
		render: function() {
			return ( {/*We are getting the headline property of the model and putting it in an h2 tag. */}
				<div className="articleContainer">
					<h2>{this.props.articleModel.get('headline').main}</h2>
				</div>
				)
		}
	})


	var NewsModel = Backbone.Model.extend({
			url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
			_key: '11eaa2ee2ebb78f1cfb25971ad39c74d',
			parse: function(rawJSON){
				return rawJSON.response.docs[0]
			}
		})


	var NewsCollection = Backbone.Collection.extend({
		url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
		_key: '11eaa2ee2ebb78f1cfb25971ad39c74d',
		parse: function(rawJSON) {
			return rawJSON.response.docs
		}
	})
	

	var NewsRouter = Backbone.Router.extend({
		routes: {
			"detail/:articleId": "doDetailView",
			"search/:topic": "doArticleSearch",
			"home": "showHomePage",
			"*catchall": "redirect"
		},

		doArticleSearch: function(searchTerm) {
			var searchCollection = new NewsCollection()
			searchCollection.fetch({
				data: {
					"apikey": searchCollection._key,
					q: searchTerm
				}

			})
		},

		doDetailView: function(id) {
			var newsModel = new NewsModel()
			newsModel.fetch({
				data: {
					fq: "_id:" + id,
					"apikey": newsModel._key
				}
			})
		},

		redirect: function() {
			location.hash = "home"
		},

		showHomePage: function() {
			var homeCollection = new NewsCollection()
			homeCollection.fetch({
				data: {
					apikey: homeCollection._key
				}
			}).then(function(){
				ReactDOM.render(<ArticlesView articleColl={homeCollection} />, document.querySelector('.container'))				
			})

		},

		initialize: function() {
			Backbone.history.start()
		}
	})

	new NewsRouter()
}

app()