/* ------ Grid System Constructor --------*/

// GridSystem with specified parameters
function GridSystem(numOfNotes,
					scrollbarWidth,
					numOfDivisions,
					timelinePosTop,
					timelinePosLeft,
					timelineHeight,
					timelineWidth,
					noteWidth,
					noteHeight) {
	
	this.numOfNotes = numOfNotes;
	this.scrollbarWidth = scrollbarWidth;
	this.numOfDivisions = numOfDivisions;
	this.timelinePosTop = timelinePosTop;
	this.timelinePosLeft = timelinePosLeft;
	this.timelineHeight = timelineHeight;
	this.timelineWidth = timelineWidth;
	this.noteWidth = noteWidth;
	this.noteHeight = noteHeight;
	
}

// Generates the grid with numCols number of columns and 
// numRows number of rows.
GridSystem.prototype.generateGrid = function(numRows, numCols) {
	// Generate columns
	$(".grid-system").append(generateDivs(numCols, "grid-col-holder", ""));
	
	// Specify width of each column
	$(".grid-col-holder").css({
		"width": this.noteWidth
	});
	
	// Generate rows per column (Note: columns have class "grid-col-holder")
	$(".grid-col-holder").append(generateDivs(numRows, "grid-square", ""));
	
	$(".sortable-system").css({
		"width": this.timelineWidth
	});
	
	// Specify height of each row
	$(".grid-square").css({
		"height": this.noteHeight // height of each grid square
	});
	
};

// Resizes the grid system by updating the attributes of the 
// grid with respect to the window size.
// Note: Used for window resize, to accommodate different screen
// resolutions
GridSystem.prototype.resizeGrid = function() {
	this.timelinePosTop = $(".timeline").position().top;
	
	this.timelinePosLeft = $(".timeline").position().left;
	
	this.timelineHeight = $(".timeline").height() + 
					 	  parseInt($(".timeline").css("border-top-width")) + 
					 	  parseInt($(".timeline").css("border-bottom-width"));
	
	this.timelineWidth = $(".timeline").width();
	
	this.noteWidth = (this.timelineWidth/this.numOfDivisions);
	
	this.noteHeight = this.timelineHeight - 17; //17 is scrollbarWidth(20) - timeline border widths(3)
	
	$(".sortable-system").css({
		"height": this.timelineHeight,
		"width": this.timelineWidth
	});
	
	// Updates every division and note's height and width in timeline
	$(".sortable-system div").css({
		"height": this.noteHeight,
		"width": this.noteWidth,
	});
	
	$(".grid-system div").css({
		"height": this.noteHeight,
		"width": this.noteWidth,
	});
	
}


