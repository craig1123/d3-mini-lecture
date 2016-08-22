var dataset = [];  						 //Initialize empty array

function resetData(){
    dataset = [];
    for (var i = 0; i < 20; i++) {			 //Loop 25 times
      var newNumber = Math.floor(Math.random() * 30);  //New random number (0-30)
      dataset.push(newNumber);			 //Add new number to array
    }
}
resetData();

//sort the bars in order of height
var sortOrder = false;
var sortBars = function() {
sortOrder = !sortOrder;
  svg.selectAll("rect")
     .sort(function(a, b) { //sorts the bars in asc/desc order
       if (sortOrder) {
         return d3.ascending(a, b);
       } else {
         return d3.descending(a, b);
       }
    })
     .transition()
     .delay(function (d,i) {
       return i * 50;
     })
     .duration(1000)
     .attr("x", function(d, i) {
           return xScale(i);
     });
};


//add  and remove bars
d3.selectAll("input")
.on("click", function () {

  if (d3.select(this).attr("id") === "addData") {
    //Add one new value to dataset
          var maxValue = 25;
          var newNumber = Math.floor(Math.random() * maxValue);	//New random integer (0-24)
          dataset.push(newNumber); //Add new number to array
  } else if (d3.select(this).attr("id") === "removeData"){
    //Remove a value
          dataset.shift();	//Remove one value from dataset
  }
        //Update scale domains
        xScale.domain(d3.range(dataset.length));	//Recalibrate the x scale domain, given the new length of dataset
        yScale.domain([0, d3.max(dataset)]);	//Recalibrate the y scale domain, given the new max value in dataset

        //Select…
        var bars = svg.selectAll("rect")	//Select all bars
          .data(dataset);	//Re-bind data to existing bars, return the 'update' selection
                      //'bars' is now the update selection
        //Enter…
        bars.enter() //References the enter selection (a subset of the update selection)
          .append("rect")	//Creates a new rect
          .attr("x", function(d, i){
            return xScale(i);
          })	//Sets the initial x position of the rect beyond the far right edge of the SVG
          .attr("y", function(d) {	//Sets the y value, based on the updated yScale
            return h - yScale(d) - margin;
          })
          .attr("width", xScale.rangeBand()) //Sets the width value, based on the updated xScale
          .attr("height", function(d) {	//Sets the height value, based on the updated yScale
            return yScale(d);
          })
          .attr("fill", function(d) {	//Sets the fill value
            return "rgb(0, 0, " + (d * 10) + ")";
          });

        //Update…
        bars.transition()	//Initiate a transition on all elements in the update selection (all rects)
          .duration(500)
          .attr("x", function(d, i) {	//Set new x position, based on the updated xScale
            return xScale(i);
          })
          .attr("y", function(d) { //Set new y position, based on the updated yScale
            return h - yScale(d) - margin;
          })
          .attr("width", xScale.rangeBand()) //Set new width value, based on the updated xScale
          .attr("height", function(d) { //Set new height value, based on the updated yScale
            return yScale(d);
          })
          .attr("fill", function(d) {	//Sets the fill value
            return "rgb(0, 0, " + (d * 10) + ")";
          });
          //Exit…
      bars.exit()
        .transition()
        .duration(500)
        .attr("x", -xScale.rangeBand())
        .remove();

        //Update all label
        var labels = svg.selectAll("text")
           .data(dataset);

        labels.enter()
              .append("text")
              .text(function(d) {
                return d;
              })
              .attr({
                x: function (d,i) { return xScale(i) + xScale.rangeBand() / 2;},
                y: function (d) {return h - yScale(d) + 14;},
                "fill": 'white',
                "text-anchor": 'middle'
              });

       //Update…
        labels.transition()
          .duration(500)
          .attr("x", function(d, i) {
            return xScale(i) + xScale.rangeBand() / 2;
          });

           //Exit…
        labels.exit()
          .transition()
          .duration(500)
          .attr("x", -xScale.rangeBand())
          .remove();

          //Create Y axis
          svg.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(" + margin + ",0)")
              .call(yAxis);
              // create x-axis
              svg.enter()
              .append("g")
                  .attr('class', 'axis') //assigns 'x' and 'axis' class
                  .attr("transform", "translate(0," + (h - margin) + ")") //pushes line to bottom
                  .call(xAxis); //takes the incoming selection and hands it off to any function
});
