'use strict';
class Map {
    constructor(mapArray) {
        // Example mapArray
        // "00000000000000000000",
        // "01000205000060100020",
        // "00000506000050600000",
        // "05070605000060507060",
        // "00000000000000000000",
        // "00000000000000000000",
        // "06030600000000504050",
        // "00000000000000000000",
        // "03700908700780900740",
        // "00000000000000000000",
        // "01820001800820001820",
        // "00000000000000000000",
        // "03080809000090808040",
        // "00000000000000000000"

        var numRows = mapArray.length;
        var numCols = mapArray[0].length;

        this.nodes = Array(numCols).fill().map(() => Array(numRows)); // Create 2D array of nodes



        for(var row = 0; row < numRows; ++row) {
            var currentRow = mapArray[row].split("");
            for(var col = 0; col < numCols; ++col) {
                this.nodes[row][col] =  new Node(this, row, col, currentRow[col]);
            }
        }
    }

    position(row, col) { // (0, 0) is the upper left corner
        return this.nodes[row][col];
    }
}
class Node {
    constructor(map, row, col, nodeType) {
        this.map = map;
        this.row = row;
        this.col = col;
        this.nodeType = nodeType;
        this.up = this.down = this.left = this.right = null;
        if(row > 0) { // Establish both connections to the node above
            this.up = this.map.position(row - 1, col);
            this.up.down = this;
        }
        if(col > 0) { // Establish both connections to the node to the left
            this.left = this.map.position(row, col - 1);
            this.left.right = this;
        }
    }
}

var arr = new Array(
    "00000000000000000000",
    "01000205000060100020",
    "00000506000050600000",
    "05070605000060507060",
    "00000000000000000000",
    "00000000000000000000",
    "06030600000000504050",
    "00000000000000000000",
    "03700908700780900740",
    "00000000000000000000",
    "01820001800820001820",
    "00000000000000000000",
    "03080809000090808040",
    "00000000000000000000");

var map = new Map(arr);
console.log(map.position(3, 1).down.down.down.nodeType);