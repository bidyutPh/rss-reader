import React, {Component} from 'react';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources:[]
    }
  }

  selectSource(sourceObj) {
    this.state.sources.forEach(function(source, index) {
      if (sourceObj.label === source.label) {
        source.class = 'selectedFacet';
      } else {
        source.class = '';
      }
    })

    this.setState({sources:this.state.sources});

    this.props.callUpdateFeed(sourceObj.url);
  }

  componentDidMount(){
    fetch('/sources')
    .then(response => response.json())
    .then(data => {
      this.setState({sources:data.data});
      this.state.sources.forEach(function(source, index) {
        if (index === 0) {
          source.class = 'selectedFacet';
        } else {
          source.class = '';
        }
      })
      this.setState({sources:this.state.sources});
  })
  }

	render(){
		return (
      <div id="sidebar" className="col-lg-2 container">
        <div >
          <div id="feed-source"><strong>Feed Source</strong></div>
          <div>
            {this.state.sources.map((source, index) => (
            <div className={"source-container " + source.class} key={index}>
              <div><a onClick={() => {this.selectSource(source)}}>{source.label}</a></div>
            </div>
            ))}
          </div>
        </div>
      </div>
     )
	}
}

export default SideBar;
