import React, {Component} from 'react';

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feeds : [],
      showMask: false,
      categories: []//,
      //buttonModes : {selected: 'btn-primary', unselected: 'btn-light'},
      //buttonMode : this.state.buttonModes.unselected
    }
  }

  getImageLink(feed){
    if(feed['media:content']) {
      if (feed['media:content'] instanceof Array) {
        return feed['media:content'][1]['@']['url'];
      } else {
        return feed['media:content']['@']['url'];
      }
    } else if(feed['image']) {
      return feed['image'].url;
    }
  }

  getDescription(content) {
    var el = document.createElement('html');
    el.innerHTML = "'" + content + "'";

    if ((el.getElementsByTagName('p')).length > 0) {
      return el.getElementsByTagName('p')[0].innerText;
    } else {
      return el.innerText;
    }

  }

  getFeeds(url){
    this.setState({showMask : true});
    fetch('/feeds', {
      body:JSON.stringify({url:url}),
      headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
      },
      method:'POST'
    })
    .then(response => response.json())
    .then(data => {
      if (this.state.categories.length === 0) {
        this.getCategories(url);
      }
      this.setState({feeds : data.data});
      this.setState({showMask : false});
    })
  }

  getCategories(url){
    fetch('/getCategories', {
      body:JSON.stringify({url:url}),
      headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
      },
      method:'POST'
    })
    .then(response => response.json())
    .then(data => {
      this.setState({categories:data.categories});
      this.state.categories.forEach(function(category, index) {
        if (index === 0) {
          category.class = 'btn-primary';
        } else {
          category.class = 'btn-light';
        }
      })
      this.setState({categories:this.state.categories});
    })
  }

  getCategoryFilteredFeeds(categoryObj) {
    //this.setState({buttonMode: this.state.buttonModes.selected});
    this.state.categories.forEach(function(category, index) {
      if (categoryObj.label === category.label) {
        category.class = 'btn-primary';
      } else {
        category.class = 'btn-light';
      }
    })
    this.getFeeds(categoryObj.url);
  }

  redirectUserToArticle(evt,feed) {
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }
    window.open(feed.link, '_blank');
  }

  componentDidMount(){
    this.getFeeds('http://www.guardian.co.uk/world/usa/rss');
    //this.getCategories('http://www.guardian.co.uk/world/usa/rss');
  }

	render(){
		return (
      <div id="feeds-container" className="col-lg-10">
      {this.state.showMask ? <div className="mask">
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div> : null}
        {/*{this.state.feeds.map((feed,index)=><li>Hello Bidyut {feed} </li>)};*/}
        <div className="categoryContainer">
          {this.state.categories.map((category) =>
            <button type="button" key={category.label} onClick={() => this.getCategoryFilteredFeeds(category)} className={"btn " + category.class}>{category.label}</button>
          )}
        </div>
        {this.state.feeds.map((feed, index)=>(<div key={index} className="container row-container" onClick={(evt) => {this.redirectUserToArticle(evt, feed)}}>
            {this.getImageLink(feed) ? <div className="row"><div className="col-lg-3"><img className="feed-image"
             src={this.getImageLink(feed)}></img></div><div className="col-lg-9 row"><div className="title-content col-lg-12"><a onClick={(evt) => {this.redirectUserToArticle(evt,feed)}}>{feed.title}</a></div>
             <div className="summary-content col-lg-12">{this.getDescription(feed.summary)}</div></div></div> : <div className="row">
             <div className="col-lg-12 row"><div className="title-content col-lg-12"><a onClick={(evt) => {this.redirectUserToArticle(evt,feed)}}>{feed.title}</a></div>
             <div className="summary-content col-lg-12">{this.getDescription(feed.summary)}</div></div>
             </div>}
        </div>))}
      </div>
     )
	}
}

export default Content;
