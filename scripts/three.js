(function (Raphael) {

    var paper = Raphael(8, 40, 400, 184);

    //TODO: draw circular path

    //TODO: draw one circle node

    //TODO: allow you to drag it around the page

    //TODO: snap to points

    //TODO: update something else on the page

    //TODO: add other circles

    //TODO: make them move around as well

    var circle = paper.circle(48, 48, 40);

    circle.attr("fill", "#f00");
    circle.attr("stroke", "#f00");

    var circlePath = paper.path("C ");

})(Raphael);