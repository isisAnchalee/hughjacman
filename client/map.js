'use strict';

// mapArray values:
const FOOD = 0;
const WALL = 1;
// Any other number means teleport to that number in a different location

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
        this.establishConnections();
    }

    establishConnections() {
        if(this.nodeType == WALL) // Don't connect if I'm a wall
            return;

        if(this.row > 0) { // Establish both connections to the node above
            var upNode = this.map.position(this.row - 1, this.col);
            if(upNode.nodeType != WALL) {
                this.up = upNode;
                upNode.down = this;
            }
        }
        if(this.col > 0) { // Establish both connections to the node to the left
            var leftNode = this.map.position(this.row, this.col - 1);
            if(leftNode.nodeType != WALL) {
                this.left = leftNode;
                leftNode.right = this;
            }
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
