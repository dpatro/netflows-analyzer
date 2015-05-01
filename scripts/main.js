/**
 *  Main js file : Contains Controller Mechanisms
 **/

// The global dictionary to maintain system wide settings.
globalDict ={
  links: [],
  nodes: {},
  flows: [],
  diameter: 960
};

function loadData(selector){
  if (selector.value.length){

    // Remove old drawings
    d3.select("#graph").select("svg").remove();
    d3.select("#flows").select("table").remove();

    drawGraph("data/"+selector.value);
  }

}