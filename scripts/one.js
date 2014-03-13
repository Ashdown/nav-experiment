(function () {

    var w = 400,
        h = 400,
        data = {
            x: 150,
            y: 100,
            rx: 100,
            ry: 50,
            angle: 0
        };

// Returns radians
    function angleBetweenPoints(p1, p2) {
        if (p1[0] == p2[0] && p1[1] == p2[1])
            return Math.PI / 2;
        else
            return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    }

    function distanceBetweenPoints(p1, p2) {
        return Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2));
    }

    var svg = d3.select("body")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);

    var group = svg.append("svg:g");

    var handles = group.selectAll("circle")
        .data([
        {x: data.x, y: data.y + data.ry, name: "n"},
        {x: data.x + data.rx, y: data.y, name: "e"},
        {x: data.x, y: data.y - data.ry, name: "s"},
        {x: data.x - data.rx, y: data.y, name: "w"}
    ], function (d) {
            return d.name;
        })
        .enter()
        .append("svg:circle")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", 6.5)
        .call(d3.behavior.drag()
            .on("drag", function (d) {
                // Resizing
                var exy = [d3.event.x, d3.event.y],
                    dxy = [data.x, data.y],
                    dist = distanceBetweenPoints(exy, dxy),
                    angle = data.angle + angleBetweenPoints(dxy, exy);
                switch (d.name) {
                    case "e":
                    case "w":
                        data.rx = dist;
                        break;
                    case "s":
                    case "n":
                        data.ry = dist;
                        angle += Math.PI / 2;
                        break;
                }
                ;
                data.angle = angle;
                update();
            })
        );

    var ellipse = group.append("svg:ellipse");

    function toDegrees(rad) {
        return rad * (180 / Math.PI);
    }

    function update() {
        ellipse
            .attr("cx", data.x)
            .attr("cy", data.y)
            .attr("rx", data.rx)
            .attr("ry", data.ry);

        group.attr("transform", "rotate(" + toDegrees(data.angle) + "," + data.x + "," + data.y + ")");

        handles.data([
            {x: data.x, y: data.y + data.ry, name: "n"},
            {x: data.x + data.rx, y: data.y, name: "e"},
            {x: data.x, y: data.y - data.ry, name: "s"},
            {x: data.x - data.rx, y: data.y, name: "w"}
        ], function (d) {
            return d.name;
        }).attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }

    update();
})();
