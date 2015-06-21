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
	$("#grid-system").append(generateDivs(numCols, "grid-col-holder", ""));
	
	// Specify width of each column
	$(".grid-col-holder").css({
		"width": this.noteWidth
	});
	
	// Generate rows per column (Note: columns have class "grid-col-holder")
	$(".grid-col-holder").append(generateDivs(numRows, "grid-square", ""));
	
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
	this.timelinePosTop = $("#timeline").position().top;
	//console.log("timeline top: " + this.timelinePosTop);
	
	this.timelinePosLeft = $("#timeline").position().left;
	//console.log("timeline left: " + this.timelinePosLeft);
	
	this.timelineHeight = $("#timeline").height() + 
					 	  parseInt($("#timeline").css("border-top-width")) + 
					 	  parseInt($("#timeline").css("border-bottom-width"));
	//console.log("timeline height: " + this.timelineHeight);
	
	this.timelineWidth = $("#timeline").width() - this.scrollbarWidth;
	//console.log("timeline width: " + this.timelineWidth);
	
	this.noteWidth = (this.timelineWidth/this.numOfDivisions);
	//console.log("note width: " + this.noteWidth);
	
	this.noteHeight = $("#timeline").height() / 3;
	//console.log("note height: " + this.noteHeight);
	
	// Ensures the grid-system is not updated by this statement because we
	// don't want the entire grid-system to have noteHeight & noteWidth dimensions
	$("#notes-system div").not(document.getElementById("grid-system")).css({
		"height": this.noteHeight,
		"width": this.noteWidth,
	});
	
	//console.log("--End resize--");
}
