// key    11eaa2ee2ebb78f1cfb25971ad39c74d

// url https://api.nytimes.com/svc/search/v2/articlesearch.json"

// params: apikey, q (search term)

var qs = function(input) {
	return document.querySelector(input)
}

var NewsCollection = Backbone.Collection.extend({
	url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
	_key: '11eaa2ee2ebb78f1cfb25971ad39c74d',
	parse: function(rawJSON) {
		//takes as input the raw response. use parse if you need to 
		//drill down and find the array that you want to use as your
		//array of models. return that array. it will get stored on the
		// .models property of the collection.
		return rawJSON.response.docs
	}
})
var NewsModel = Backbone.Model.extend({
	url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
	_key: '11eaa2ee2ebb78f1cfb25971ad39c74d',
	parse: function(rawJSON){
		// console.log(rawJSON)
		return rawJSON.response.docs[0]
	}
})



var NewsView = Backbone.View.extend({
	// the el property is the DOM node that will contain the view (exclusively)
	el: qs('#container'),

	// keys have the form "<event type> <selector>". values are event handlers.
	// the handler will be assigned to EVERY node matching the selector. 
	// pretty darn convenient! 

	// note that this will only work if the view has an .el property. the <selector>
	// is sought WITHIN the view's .el 

	// i.e., the events are assigned to node's contained within the view. 
	// backbone can only know WHAT is within the view, if it knows what element
	// will contain the view.
	events: {
		"click .snippet": "_handleClick"
	},

	initialize: function(coll) {		
		var thisView = this
		// add the input collection as a property on the view, so that it 
		// can be accessed from anywhere on the view object
		this.coll = coll

		// subscribe the the "sync" event on the view's collection, so that
		// as soon as the collection gets data, the view will automatically render.
		var boundRender = this._render.bind(thisView)		
		this.coll.on('sync',boundRender)
	},

	_handleClick: function(e) {
		var articleDiv = e.target
		window.articleDiv = articleDiv
		location.hash = 'detail/' + articleDiv.getAttribute('data-id')
	},

	_render: function() {
		var docsArray = this.coll.models
		var htmlString = ''
		for (var i = 0; i < docsArray.length; i ++) {
			var articleMod = docsArray[i]
			// .get() is a method on a model that will pull a value out of
			// the model's .attributes.
			htmlString += '<div data-id="' + articleMod.get('_id') + '" class="snippet">' 
			htmlString += articleMod.get('snippet')
			htmlString += '</div>'
		}
		this.el.innerHTML = htmlString
	}
})

var DetailView = Backbone.View.extend({
	el: qs('#container'),

	initialize: function(model){
		this.model = model
		var boundRender = this._render.bind(this)
		this.model.on('sync', boundRender)

	},
	_render: function (){
		console.log(this.model)
		var story = this.model
		var imgUrlBase = 'https://static01.nyt.com/'
		var htmlString = ''
		htmlString += '<div class="story">'
		htmlString += '<h1>' + story.get('headline').main + '</h1>'
		htmlString += '<img src="'+ imgUrlBase + story.get("multimedia")[1].url +' ">'
		htmlString += '</div>'
		this.el.innerHTML = htmlString
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
		new NewsView(searchCollection)
	},

	doDetailView: function(id) {
		var newsModel = new NewsModel()
		newsModel.fetch({
			data: {
				fq: "_id:" + id,
				"apikey": newsModel._key
			}
		})
		new DetailView(newsModel)
	},

	redirect: function() {
		location.hash = "home"
	},

	showHomePage: function() {
		var homeCollection = new NewsCollection()
		console.log(homeCollection)
		homeCollection.fetch({
			// json is actually the default, but ... IMPORTANT!
			// for the etsy database you'll need to set the dataType to jsonp
			dataType: 'json',
			// the data property is where we put the parameters that go on the end of the url
			data: {
				apikey: homeCollection._key
			}
		})
		new NewsView(homeCollection)
	},

	initialize: function() {
		Backbone.history.start()
	}
})

new NewsRouter()

qs('input').addEventListener('keydown',function(e) {
	if (e.keyCode === 13) {
		location.hash = "search/" + e.target.value
	}
})

