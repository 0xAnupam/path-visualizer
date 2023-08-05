$(window).on('load', function () 
{
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut();
    setTimeout(startAll, 100)
})


var rows = 25
var columns = 50

// console.log("" + w - 1 + "px")

// center is the div containing all the nodes which are given unique class 
// -> "node01,node02,...nodeij",here i,j are row and index
function startAll() 
{
    var vh = $(window).height()
    var vw = $(window).width()
    vh = Math.floor(vh * .85)

    var rows = 25
    var columns = 50
    s = ''

    var wi = Math.floor(vw / columns)
    var hi = Math.floor(vh / rows)

    var container = document.querySelector(".center")
    for (let i = 0; i < rows; i++) // 32 = vh/20 (85% of vh)
    {
        for (let j = 0; j < columns; j++) //76 = vw/20
        {
            container.innerHTML += "<div class='unit node" + i + "j" + j + "' ></div>" //giving the unique class to each node
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {

            //adding event listner to ever node 
            document.querySelector(".node" + i + "j" + j).addEventListener("mousemove", () => addWall(i, j))
            document.querySelector(".node" + i + "j" + j).addEventListener("click", () => toggleWall(i, j))
            s = wi - 1 + "px"
            // console.log(s)
            $(".node" + i + "j" + j).width(s)
            $(".node" + i + "j" + j).height(hi - 1 + 'px')

            if (i == 24) 
            {
                document.querySelector(".node" + i + "j" + j).classList.add("bottomBorder")
                s = wi - 1 + "px"
                $(".node" + i + "j" + j).width(s)
                $(".node" + i + "j" + j).height(hi - 2 + "px")

            }

            if (j == 49) 
            {
                document.querySelector(".node" + i + "j" + j).classList.add("rightBorder")
                s = wi - 2 + "px"
                $(".node" + i + "j" + j).width(s)
                $(".node" + i + "j" + j).height(hi - 1 + "px")
            }
            // hard coding the start and end point (to be deleted later on)
            if (i == 3 && j == 7) 
            {
                document.querySelector(".node" + i + "j" + j).classList.add("start")
            }
            if (i == 20 && j == 45) 
            {
                document.querySelector(".node" + i + "j" + j).classList.add("end")
            }
        }
    }

    // window.rows = 30
    // window.columns = 76
    window.grid = new Array(rows)
    for (var i = 0; i < columns; i++) 
        grid[i] = new Array(columns)

    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < columns; j++)
        {
            grid[i][j] = new spot(i, j)
            // for dijikstra
            Q.push(grid[i][j])
        }
    }
}


// universal variable for path (used in dfs)
pathFound = false
changeStart = false
changeEnd = false

// variables used for animating the path
var visited = []
var path = []
var a = 0
var b = 0
var w = 0

var si = 3//Manual Start X
var sj = 7//Manual Start Y
var fi = 20//Manual End X
var fj = 45//Manual End Y

// used for checking mouse down to create wall
isDown = false
document.addEventListener("mousedown", function () {
    isDown = true
})
document.addEventListener("mouseup", function () {
    isDown = false
})

// function to call be called after the button is pressed
function callAll(s) {
    if (s == "dfs") 
    {
        pathFound = false
        dfs(si, sj, fi, fj)
        d = setInterval(fillPath, 10);
    }
    if (s == "bfs") 
    {
        bfs(si, sj, fi, fj)
        d = setInterval(fillPath, 10);
    }
    if (s == "aStar") {
        aStar(si, sj, fi, fj)
        d = setInterval(fillPath_A, 10);
    }
    if (s == "dijkstra") 
    {
        dijkstra(si, sj, fi, fj)
        d = setInterval(fillPath_A, 10);
    }
}

// function to fill path with animation insted of filling in one instance
function fillPath() 
{
    if (a < visited.length) {
        document.querySelector(visited[a]).classList.add("visited")
        a++
        return
    }

    if (b >= path.length) {
        clearInterval(d)
        return
    }
    document.querySelector(path[b]).classList.add("path")
    b++
}

// function to add wall
function addWall(i, j) 
{
    if (isDown) {
        document.querySelector(".node" + i + "j" + j).classList.add("wall")
    }
}

// function to change the start and end counter so that it's position can be changed in toggle Wall
function toggleStart(s) 
{
    if (s == "start") {
        changeStart = true
    }

    if (s == "end") {
        changeEnd = true
    }
}

// function to remove walls by clicking and change the position of start and end node
function toggleWall(i, j) {

    el = document.querySelector(".node" + i + "j" + j)
    if (changeStart) {
        tr = document.querySelector(".node" + si + "j" + sj)
        tr.classList.remove("start")
        el.classList.add("start")
        si = i
        sj = j
        changeStart = false
        return
    }

    if (changeEnd) {
        tr = document.querySelector(".node" + fi + "j" + fj)
        tr.classList.remove("end")
        el.classList.add("end")
        fi = i
        fj = j
        changeEnd = false
        return
    }

    if (el.classList.contains("wall")) {
        el.classList.remove("wall")
    } else el.classList.add("wall")
}



// DFS starts here ============================================================================
// FUNCTION TO CHECK IF THE NODE IN WHICH WE ARE GOING IS IN BOUNDS AND NOT VISITED
function isValid(i, j)
{
    if (i >= 0 && i < rows && j >= 0 && j < columns) 
    {
        if (visited.indexOf(".node" + i + "j" + j) == -1 && !document.querySelector(".node" + i + "j" + j).classList.contains("wall"))
            return true
        else 
            return false
    } 
    else 
        return false
}

function dfs(i, j, fi, fj) {
    if (isValid(i, j)) 
    {
        if (!pathFound) 
        {
            if (i == fi && j == fj) 
            {
                pathFound = true
                return
            }
            if (!document.querySelector(".node" + i + "j" + j).classList.contains("start")) visited.push(".node" + i + "j" + j)

            dfs(i - 1, j, fi, fj) //up
            if (pathFound) {
                if (!document.querySelector(".node" + i + "j" + j).classList.contains("start")) path.push(".node" + i + "j" + j)
                return
            }

            dfs(i, j + 1, fi, fj) //right
            if (pathFound) {
                if (!document.querySelector(".node" + i + "j" + j).classList.contains("start")) path.push(".node" + i + "j" + j)
                return
            }

            dfs(i + 1, j, fi, fj) //down
            if (pathFound) {
                if (!document.querySelector(".node" + i + "j" + j).classList.contains("start")) path.push(".node" + i + "j" + j)
                return
            }

            dfs(i, j - 1, fi, fj) //left  
            if (pathFound) {
                if (!document.querySelector(".node" + i + "j" + j).classList.contains("start")) path.push(".node" + i + "j" + j)
                return
            }
        } 
        else return
    } 
    else return
}

// dfs(7,10,27,70)  first two arguments are the starting indices and the next two are the final indices
// DFS ends here ============================================================================



// BFS starts here ============================================================================

// Queue class
class Queue {
    constructor() {
        this.items = []
    }

    // enqueue function 
    enqueue(element) {
        // adding element to the queue 
        this.items.push(element);
    }

    dequeue() {
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        var toReturn = this.items[0]
        this.items.shift()
        return toReturn
    }

    size() {
        // returns the size of queue
        return this.items.length
    }

    // how to use this class
    // var queue = new Queue(); 
    // queue.enqueue(10); 
    // queue.dequeue();
}

function bfs(i, j, fi, fj) {
    var queue = new Queue()
    var moves = ["U", "R", "D", "L"]
    queue.enqueue("")
    p = ""
    while (!foundEnd(i, j, fi, fj, p)) {
        if (queue.size() == 0) break
        p = queue.dequeue()
        for (var a = 0; a < moves.length; a++) {
            check = p + moves[a]
            if (isValid_bfs(i, j, check)) {
                queue.enqueue(check)
            }
        }
    }
    if (foundEnd(i, j, fi, fj, p)) fillPathArr(i, j, p)
    // else alert("Path Not Found")
}

// function to fill the final path array
function fillPathArr(i, j, p) {
    path.push(".node" + i + "j" + j)
    for (var a = 0; a < p.length; a++) {
        if (p[a] == "U") i = i - 1
        if (p[a] == "D") i = i + 1
        if (p[a] == "R") j = j + 1
        if (p[a] == "L") j = j - 1
        path.push(".node" + i + "j" + j)
    }
}

// this function checks if the path leads to end
function foundEnd(i, j, fi, fj, p) {
    for (var a = 0; a < p.length; a++) {
        if (p[a] == "U") i = i - 1
        if (p[a] == "D") i = i + 1
        if (p[a] == "R") j = j + 1
        if (p[a] == "L") j = j - 1
    }
    if (i == fi && j == fj) {
        return true
    } else return false
}

// this function checks if the path is valid and if valid it adds that path to "visited" array
function isValid_bfs(i, j, check) {
    for (var a = 0; a < check.length; a++) {
        if (check[a] == "U") i = i - 1
        if (check[a] == "D") i = i + 1
        if (check[a] == "R") j = j + 1
        if (check[a] == "L") j = j - 1
    }
    if (i >= 0 && i < 25 && j >= 0 && j < 50) {
        if (visited.indexOf(".node" + i + "j" + j) == -1 && !document.querySelector(".node" + i + "j" + j).classList.contains("wall")) {
            visited.push(".node" + i + "j" + j)
            return true
        }
    } else return false
}
// BFS ends here ============================================================================

// Dijkstra starts here ============================================================================

class spot {
    constructor(i, j) {
        this.i = i
        this.j = j
        this.f = 0
        this.g = 0
        this.h = 0
        this.previous = undefined
        this.dis = Number.MAX_VALUE
    }
}
// this list is used in dijikstra
var Q = []
var fills = []


// var rows = 32
// var columns = 76
// var grid = new Array(rows)
// for (var i = 0; i < columns; i++) grid[i] = new Array(columns)

// for (var i = 0; i < rows; i++) {
//     for (var j = 0; j < columns; j++) {
//         grid[i][j] = new spot(i, j)
//         // for dijikstra
//         Q.push(grid[i][j])
//     }
// }
// remove element elt from array arr
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

// checks the validity of a node
function isValid_a(i, j) {
    if (i >= 0 && i < rows && j >= 0 && j < columns) {
        if (!document.querySelector(".node" + i + "j" + j).classList.contains("wall")) {
            return true
        } else return false
    } else return false
}

// function used to animate the path
function fillPath_A() {
    if (a < fills.length) {
        document.querySelector(fills[a]).classList.add("visited")
        a++
        return
    }

    if (b >= path.length) {
        clearInterval(d)
        return
    }

    document.querySelector(".node" + path[b].i + "j" + path[b].j).classList.add("path")
    b++
}

// main function for Dijkstra
function dijkstra(i, j, fi, fj) {

    start = grid[i][j]
    end = grid[fi][fj]
    start.dis = 0

    while (Q.length > 0) {
        // find the minimum
        var winner = 0
        for (var i = 0; i < Q.length; i++) {
            if (Q[i].dis < Q[winner].dis) winner = i
        }
        current = Q[winner]

        // check if no path is possible
        if (current.dis == Number.MAX_VALUE) {
            // console.log("this happans")
            break
        }


        removeFromArray(Q, current)
        fills.push(".node" + current.i + "j" + current.j)

        // check if end is reached
        if (current.i == end.i && current.j == end.j) {
            var temp = current
            path.push(temp.previous)
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
            // console.log(path)
            break;
        }

        // checking for valid neighbors and giving them the distance from starting
        var neighbors = []
        var i = current.i
        var j = current.j
        if (isValid_a(i + 1, j)) neighbors.push(grid[i + 1][j])
        if (isValid_a(i - 1, j)) neighbors.push(grid[i - 1][j])
        if (isValid_a(i, j + 1)) neighbors.push(grid[i][j + 1])
        if (isValid_a(i, j - 1)) neighbors.push(grid[i][j - 1])

        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i]

            var tempDis = current.dis + 1

            if (tempDis < neighbor.dis) {
                neighbor.dis = tempDis
                neighbor.previous = current
            }
        }
    }

}

// Dijkstra ends here ============================================================================

// function to clear everything including the walls
function clearAll() {
    pathFound = false
    visited = []
    path = []
    walls = []
    fills = []
    Q = []

    a = 0
    b = 0
    w = 0
    for (let i = 0; i < rows; i++) // 32 = vh/20 (90% of vh)
    {
        for (let j = 0; j < columns; j++) //76 = vw/20
        {
            el = document.querySelector(".node" + i + "j" + j)
            if (el.classList.contains("wall")) {
                el.classList.remove("wall")
            }
            if (el.classList.contains("visited")) {
                el.classList.remove("visited")
            }
            if (el.classList.contains("path")) {
                el.classList.remove("path")
            }

        }
    }

    grid = new Array(rows)
    for (var i = 0; i < columns; i++) grid[i] = new Array(columns)

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            grid[i][j] = new spot(i, j)
            // for dijikstra
            Q.push(grid[i][j])
        }
    }
}

// function to remove everything except the walls
function clearPath() {
    pathFound = false
    visited = []
    path = []
    fills = []
    Q = []

    a = 0
    b = 0

    for (let i = 0; i < rows; i++) // 32 = vh/20 (90% of vh)
    {
        for (let j = 0; j < columns; j++) //76 = vw/20
        {
            el = document.querySelector(".node" + i + "j" + j)
            if (el.classList.contains("visited")) {
                el.classList.remove("visited")
            }
            if (el.classList.contains("path")) {
                el.classList.remove("path")
            }

        }
    }

    grid = new Array(rows)
    for (var i = 0; i < columns; i++) grid[i] = new Array(columns)

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            grid[i][j] = new spot(i, j)
            // for dijikstra
            Q.push(grid[i][j])
        }
    }
}
