import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import ArticlesView from './ArticlesView'
import DetailView from './DetailView'
import SearchView from './SearchView'
	
const app = function() {
	var NewsCollection = Backbone.Collection.extend({
		url: 'https://openapi.etsy.com/v2/listings/active.js',
		_key: 'aavnvygu0h5r52qes74x9zvo',
		parse: function(rawJSON) {
	
		return rawJSON.results
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
			dataType: 'jsonp',
			data: {
				api_key: searchCollection._key,
				tags: searchTerm,
				processData: true,
				includes: "Images,Shop",
				}
			}).then(function(){
				ReactDOM.render(<SearchView articleColl={searchCollection} />, document.querySelector('.container'))
			})
		
		},

		doDetailView: function(id) {
			var NewsModel = Backbone.Model.extend({
			url: 'https://openapi.etsy.com/v2/listings/' + id + '.js',
			_key: 'aavnvygu0h5r52qes74x9zvo',
				parse: function(rawJSON) {
				return rawJSON.results[0]
				}
		})


			var newsModel = new NewsModel()
			newsModel.fetch({
			dataType: 'jsonp',
			data: {
				includes: "Images,Shop",
				api_key: newsModel._key,
				processData: true,
				}
			}).then(function(){
				ReactDOM.render(<DetailView notKey={newsModel} />, document.querySelector('.container'))
			})
		
		},

		redirect: function() {
			location.hash = "home"
		},

		showHomePage: function() {
			var homeCollection = new NewsCollection()
			homeCollection.fetch({
			dataType: 'jsonp',
			data: {
				api_key: homeCollection._key,				
				processData: true,
				includes: "Images,Shop",
			}
		})
			ReactDOM.render(<ArticlesView articleColl={homeCollection} />, document.querySelector('.container'))			
			// articlesView.props.popop = homeCollection
		},

		initialize: function() {
			Backbone.history.start()
		}
	})

	new NewsRouter()
}

app()