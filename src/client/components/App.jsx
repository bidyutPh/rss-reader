import React, {Component} from 'react';
import Content from './Content.jsx';
import SideBar from './Sidebar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.updateFeeds = this.updateFeeds.bind(this);
  }

  updateFeeds(url) {
    this.contentRef.state.categories = [];
    this.contentRef.getFeeds(url);
  }

  componentDidMount(){

  }

	render(){
		return (
      <div  id="app-container" className="row">
        {/*<div className="row" styleName="height:100%">*/}
          <SideBar callUpdateFeed={this.updateFeeds}></SideBar>
          <Content ref={ref => this.contentRef = ref}></Content>
        {/*</div>*/}
      </div>
     )
	}
}

export default App;
