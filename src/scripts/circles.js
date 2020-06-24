document.addEventListener('DOMContentLoaded', ()=> {

  const submitButton = document.getElementById('submit');
  const submitForm = document.getElementById('submit-form');
  const userInput = document.querySelector('.user-input');
  const clearButton = document.getElementById('clear');
  const mainContainer = document.querySelector('.main-container');

  clearButton.addEventListener("click", (e)=> {
    e.preventDefault();
    
     //clears all circles
     while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
     };
     
     userInput.value = "";
  })


  submitForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    //iterate through the string that user inputs
    let words = userInput.value.split(" ");

    //remove punctuation
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    function removePunctuation(word) {
      return word.replace(regex, '') 
    }  

    let frequencies = [];

    words.forEach(word => {
      word = removePunctuation(word);
      //API call
      fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/frequency`, {
				"method": "GET",
				"headers": {
					"x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
					"x-rapidapi-key": "6138fd298emsh11aab9ec9165981p19347fjsna835530440b1"
				}
      })
			.then(response => {
        return response.json();
      })
      .then(res => {
        let obj = {};
        obj["frequency"] = res.frequency.perMillion; 
        obj["word"] = word;
        
        frequencies.push(obj);
        // frequencies.push(res.frequency.perMillion);
        return frequencies; 
        // debugger
      })
      .then(frequencies => {
        // debugger
        //render circles here after gathering an array of radii lengths based on freq of word usage
        renderCircles(frequencies);
        // debugger
        //reset radii lengths to blank
        frequencies = [];
        // debugger
      })
			.catch(err => {
				console.log(`${word} is not a word!`);
			});
    });
  })



  // hover over circles and see what word it represents
  // const indivCircles = document.querySelector("circle");
  // document.addEventListener('mouseover', showInfo(e));

});

function renderCircles(frequencies) {
  // debugger
  const circlesContainer = d3.select("#circles-container");
  const radiusScale = d3.scaleSqrt().domain([1, 32000]).range([5,100]);

  // const xRange = d3.scale.linear().range([100,800]).domain([0,100])
  // const yRange = d3.scale.linear().range([100,800]).domain([0,100])
  
  //pastel
  // const colors = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFFFFC"];

  const colors = ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D", "#43AA8B", "#577590"];

  // debugger

  const elemEnter = elem.enter()
    .append("g")

  const circles = circlesContainer.selectAll('circle')
    .data(frequencies)
    .enter()
    .append('circle')
    .attr('cx', function(d,i){
      return 500+ i * 100  
    })
    .attr('cy', function(d,i){
      return 500 + i * 100
    })
    .attr("r", function(d,i){
      return radiusScale(d.frequency);
    })
    .attr('fill', function(d, i) {
      let index = Math.floor(Math.random() * colors.length);
      // debugger
      return colors[i % 7]; 
    })
    .attr('fill-opacity', .7)
    .on('click', function(d){
      console.log(d.word)
    })
    .on('mouseover', function(d) {
      return tooltip
        .text(d.word)
        .style('visibility', 'visible')
    })
    // .on("mouseout", function() {
    //   return tooltip.style('visibility', "hidden")
  // });

  const tooltip = d3.select('circle')
    .data(frequencies)
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("hello world");
  
}

