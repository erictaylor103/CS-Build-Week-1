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
      <div className="buttons-container">
				
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
      <div>
      

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
      <br />
      <br />
        <h1>The story</h1>      
        <p>
        The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.
        </p>
        <h1>Rules</h1>
        <p>The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. <br /> <br /> At each step in time, the following transitions occur:</p>
        <br />
        <br />
        <ol>
          <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ol>
        <p>The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.</p>
        <br />
        <br />
        <h1>Examples of patterns</h1>
        <hr />
        <hr />
        <hr />
        
        <div className="patterns">
          <img src={require('./images/patterns1.png')} alt="none"/>
          <img src={require('./images/GliderGun.png')} alt="none"/>
          <img src={require('./images/various.png')} alt="none"/>
        </div>

        <hr />
        <h1>Origins</h1>
        <p>In late 1940, John von Neumann defined life as a creation (as a being or organism) which can reproduce itself and simulate a Turing machine. Von Neumann was thinking about an engineering solution which would use electromagnetic components floating randomly in liquid or gas. This turned out not to be realistic with the technology available at the time. Stanislaw Ulam invented cellular automata, which were intended to simulate von Neumann's theoretical electromagnetic constructions. Ulam discussed using computers to simulate his cellular automata in a two-dimensional lattice in several papers. In parallel, von Neumann attempted to construct Ulam's cellular automaton. Although successful, he was busy with other projects and left some details unfinished. His construction was complicated because it tried to simulate his own engineering design. Over time, simpler life constructions were provided by other researchers, and published in papers and books.
           Motivated by questions in mathematical logic and in part by work on simulation games by Ulam, among others, John Conway began doing experiments in 1968 with a variety of different two-dimensional cellular automaton rules. <br /><br />  Conway's initial goal was to define an interesting and unpredictable cell automaton. For example, he wanted some configurations to last for a long time before dying and other configurations to go on forever without allowing cycles. It was a significant challenge and an open problem for years before experts on cellular automata managed to prove that, indeed, the Game of Life admitted of a configuration which was alive in the sense of satisfying Von Neumann's two general requirements. While the definitions before the Game of Life were proof-oriented, Conway's construction aimed at simplicity without a priori providing proof the automaton was alive.</p>
        
        <hr />
        <p>The game made its first public appearance in the October 1970 issue of Scientific American, in Martin Gardner's "Mathematical Games" column. Theoretically, the Game of Life has the power of a universal Turing machine: anything that can be computed algorithmically can be computed within the Game of Life. Gardner wrote, "Because of Life's analogies with the rise, fall and alterations of a society of living organisms, it belongs to a growing class of what are called 'simulation games' (games that resemble real life processes).
           Since its publication, the Game of Life has attracted much interest because of the surprising ways in which the patterns can evolve. It provides an example of emergence and self-organization. Scholars in various fields, such as computer science, physics, biology, biochemistry, economics, mathematics, philosophy, and generative sciences, have made use of the way that complex patterns can emerge from the implementation of the game's simple rules. <hr /> <hr />The game can also serve as a didactic analogy, used to convey the somewhat counter-intuitive notion that design and organization can spontaneously emerge in the absence of a designer. For example, cognitive scientist Daniel Dennett has used the analogy of the Game of Life "universe" extensively to illustrate the possible evolution of complex philosophical constructs, such as consciousness and free will, from the relatively simple set of deterministic physical laws which might govern our universe.
           The popularity of the Game of Life was helped by its coming into being at the same time as increasingly inexpensive computer access. <hr /><hr />The game could be run for hours on these machines, which would otherwise have remained unused at night. In this respect, it foreshadowed the later popularity of computer-generated fractals. For many, the Game of Life was simply a programming challenge: a fun way to use otherwise wasted CPU cycles. For some, however, the Game of Life had more philosophical connotations. It developed a cult following through the 1970s and beyond; current developments have gone so far as to create theoretic emulations of computer systems within the confines of a Game of Life board.</p>

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

