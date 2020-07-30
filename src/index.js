import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, DropdownButton, Dropdown } from 'react-bootstrap';


class Box extends React.Component{
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col)
  }

  render(){

    return(
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />

    );
  }
}

class Grid extends React.Component{
  render(){

    const width = (this.props.cols * 15);
    var rowsArr = []

    var boxClass = "";
    for(var i=0; i < this.props.rows; i++){
      for(var j=0; j < this.props.cols; j++){
        let boxId = i + "_" + j;
        //add a new box when the user clicks on the grid by pushing to the rowArr variable
        boxClass = this.props.gridFull[i][j] ? "box on" : "box off"
        rowsArr.push(
          <Box 
            boxClass = {boxClass}
            key = {boxId}
            boxId = {boxId}
            row = {i}
            col = {j}
            selectBox={this.props.selectBox}
          />
        )

      }
    }

    return(
      <div className="grid" style={{width: width}} >
        {rowsArr}
      </div>
    )
  }
}


class Buttons extends React.Component{

  handleSelect = (evt) => {
    this.props.gridSize(evt);
  }

  render(){
    return(
      <div className="button_flex">
				
					<button className="button button1"  onClick={this.props.playButton}>
						Play
					</button>
					<button className="button button1"  onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="button button1"  onClick={this.props.clear}>
					  Clear
					</button>
					<button className="button button1"  onClick={this.props.slow}>
					  Slow
					</button>
					<button className="button button1"  onClick={this.props.fast}>
					  Fast
					</button>
					<button className="button button1"  onClick={this.props.seed}>
					  Generate Random
					</button>
          <div className="">
					<DropdownButton  title="Grid Size" onSelect={this.handleSelect}>
						<Dropdown.Item as="button" eventKey="1">40x40</Dropdown.Item>
						<Dropdown.Item as="button" eventKey="2">50x50</Dropdown.Item>
						<Dropdown.Item as="button" eventKey="3">60x60</Dropdown.Item>
					</DropdownButton>
          </div>
			</div>
    )
  }
}


class Main extends React.Component{
  constructor(){
    super();

    this.speed  = 100;
    this.rows   = 40;
    this.cols   = 40;
     
    
    this.state  = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)) //Every grid cell is turned off initially
    }
  }

  //method to make a copy of "gridFull" and set the state to true if it was false and vice versa
  //this way we toggle the box on and box off css class
  //now when we click on the squares, the squares clicked will turn green and stay green
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy //set the gridFull; state to the gridCopy state
    })
  }

  //seed the board method so it will automatically start with a bunch of random squares selected
  seed = () => {

    //console.log("Seed method is running"); //check to see if the seed method runs as soon as everything loads (the page)
    let gridCopy = arrayClone(this.state.gridFull);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        if(Math.floor(Math.random() * 4) === 1){ //randomly choose whether the square gets turned on or not - between 0 and any number we want (the lower the number the more close the boxes will be) //if the random number equals 1 we set the Gridgull to true
          //console.log("random method is creating a random number");
          gridCopy[i][j] = true; //now we have a 25% chance of turning on
           
        }
      }
    }
    
    this.setState({      
      gridFull: gridCopy //set the gridFull to the gridCopy state
    })
  }

  //handle the playButton click / this is associated to the PLAY BUTTON on the page
  playButton = () => {
    clearInterval(this.intervalId);
    //setInterval is going to call "this.play" at an interval speed of "this.props.speed"
    //this.props.speed will be called every 100 mili seconds (after we hit the play button)
    //the speed of "this.props.speed" is set at 100 mili seconds, but we can change it by changing the "this.speed" variable
    //we stop the interval by setting the "this.intervalId"
    this.intervalId = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId)
  }

  slow = () => {
    this.speed = 800;
    this.playButton();
  }

  fast = () => {
    this.speed = 100;
    this.playButton();
  }

  clear = () => {
    var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0
    });
    this.pauseButton(); //by calling the this.pauseButton game will stop generation (pause from generating)
  }

  gridSize = (size) => {
    
    switch (size){
      case "1":
        this.cols = 40;
        this.rows = 40;
      break;
      case "2":
        this.cols = 50;
        this.rows = 50;
      break;
      default:
        this.cols = 60;
        this.rows = 60;
    }
    this.clear();

  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        let count = 0;
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j])count ++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
        
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1
    });
  }

  componentDidMount(){
    this.seed(); //make my seed method run as soon as the page is loaded (when everything loads)
    //this.playButton();
  }

  render(){
    return(
      <div className="container">
        
        
        
        <h1>Conway's Game of Life</h1>
        
        
      <div>
      <h2>Generations: {this.state.generation}</h2>
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
      </div>
      
      <div>
        <Buttons 
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
      </div>
      <h3>Rules</h3>
      </div>
    )
  }
}

function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

