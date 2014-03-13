var searchDl = 1;
var l = 0;

// Creates canvas 320 × 200 at 10, 50
var r = Raphael(10, 50, 320, 200);

var p = r.path("M100,100c0,50 100-50 100,0c0,50 -100-50 -100,0z").attr({stroke: "#ddf"}),
    //point object representing the distance to length l from the start of the path
    pt = p.getPointAtLength(l);
e = r.ellipse(pt.x, pt.y, 4, 4).attr({stroke: "none", fill: "#f00"}),
    totLen = p.getTotalLength(),


    //initialisation
    start = function () {
        // storing original coordinates
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        this.attr({opacity: 1});
    },
    //move circle to given point
    move = function (dx, dy) {
        //point we should move toward
        var tmpPt = {
            x : this.ox + dx,
            y : this.oy + dy
        };
        // move will be called with dx and dy
        l = gradSearch(l, tmpPt);
        //move to to the point indicated by l
        pt = p.getPointAtLength(l);
        this.attr({cx: pt.x, cy: pt.y});
    },
    //???
    up = function () {
        // restoring state
        this.attr({opacity: 1});
    },
    gradSearch = function (l0, pt) {
        l0 = l0 + totLen;
        var l1 = l0,
            dist0 = dist(p.getPointAtLength(l0 % totLen), pt),
            dist1,
            searchDir;
        //work out search direction
        if (dist(p.getPointAtLength((l0 - searchDl) % totLen), pt) >
            dist(p.getPointAtLength((l0 + searchDl) % totLen), pt)) {
            searchDir = searchDl;
        } else {
            searchDir = -searchDl;
        }

        l1 += searchDir;
        dist1 = dist(p.getPointAtLength(l1 % totLen), pt);
        while (dist1 < dist0) {
            dist0 = dist1;
            l1 += searchDir;
            dist1 = dist(p.getPointAtLength(l1 % totLen), pt);
        }
        l1 -= searchDir;

        return (l1 % totLen);
    },
    //get the distance between two points
    dist = function (pt1, pt2) {
        var dx = pt1.x - pt2.x;
        var dy = pt1.y - pt2.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
//onmove, onstart, onend
e.drag(move, start, up);