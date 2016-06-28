import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'


const app = function() {

	var ArticlesView = React.createClass({

		render: function() {
			return (
				<div className="articlesView">
					<Header />
					<NewsContainer articleColl={this.props.articleColl} />
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

		_getJsxArray: function(articlesArray) {
			// articlesArray.forEach(function())
			var jsxArray = []

			articlesArray.forEach(function(model){
				jsxArray.push(<Article articleModel={model} />)
			})
			// for (var i = 0; i < articlesArray.length; i ++) {
			// 	var model = articlesArray[i]
			// 	// push onto my jsxArray an Article component that has this 
			// 	// model on its props
			// 	jsxArray.push(<Article articleModel={model} />)

			// }



			return jsxArray
		},

		render: function() {
			return (
				<div className="newsContainer">
					{this._getJsxArray(this.props.articleColl.models)}
				</div>
			)
		}
	})

	var Article = React.createClass({
		render: function() {
			console.log('article data...')
			console.log(this.props)
			return (
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