(function ($, Raphael) {

    var paper = Raphael(0, 0, 320, 480);
    var distance = 0;

    var circlePath = paper.path(Raphael._getPath.circle({ attrs: { cx: 160, cy: 160, r: 160 } }))
    var point = circlePath.getPointAtLength(distance);
//    var menuItem = paper.circle(160, 0, 40);

//    menuItem.attr("fill", "#f00");
//    menuItem.attr("stroke", "#f00");

    var totalPathLength = circlePath.getTotalLength();

    var searchDl = 1;

//    var itemAnimation;

    var menuItems = new Array();
    var itemAnimations = new Array();
//
    var nextItemPoint = circlePath.getPointAtLength(distance);

    var totalNumberOfMenuItems = 5;

    var stickyThreshold = totalPathLength / totalNumberOfMenuItems;//220;

    for (var i = 1; i <= totalNumberOfMenuItems; i++) {
        var newMenuItem = paper.circle(nextItemPoint.x, nextItemPoint.y, 40);
        newMenuItem.attr("fill", "#f00");
        newMenuItem.attr("stroke", "#f00");
        menuItems.push(newMenuItem);
        nextItemPoint = circlePath.getPointAtLength(stickyThreshold * i);
    }

    menuItems[0].attr("fill", "#ff0").attr("stroke", "#ff0");
    menuItems[1].attr("fill", "#000").attr("stroke", "#000");
    menuItems[2].attr("fill", "#0ff").attr("stroke", "#0ff");
    menuItems[3].attr("fill", "#00f").attr("stroke", "#00f");


    var moveItem = function (destinationx, destinationy) {
            //point we should move toward
            var destinationPoint = {
                x: this.originalx + destinationx,
                y: this.originaly + destinationy
            };
            // move will be called with dx and dy
            distance = gradSearch(distance, destinationPoint);
            //move to to the point indicated by l

            point = circlePath.getPointAtLength(distance);
            this.attr({cx: point.x, cy: point.y});

            var thisMenuItemIndexNumber = 0;

            for (var i = 0; i < menuItems.length; i++) {
                if (menuItems[i] === this) {
                    thisMenuItemIndexNumber = i;
                    break;
                }
            }
            for (var i = 0; i < menuItems.length; i++) {
                if (i !== thisMenuItemIndexNumber) {
                    var newDistance = (distance + ((i - thisMenuItemIndexNumber) * stickyThreshold));
//                    var newDistance = (distance + stickyThreshold);

                    console.log(newDistance);
                    console.log()
                    if (newDistance > totalPathLength) {
                        newDistance = newDistance - totalPathLength;
                    }
                    console.log(newDistance);
                    var newPoint = circlePath.getPointAtLength(newDistance);
                    console.log('newPoint.x: ' + newPoint.x);
                    console.log('newPoint.y: ' + newPoint.y);
                    menuItems[i].attr({cx: newPoint.x, cy: newPoint.y})

                }
            }

            //TODO: make them move around as well

        },
        startItem = function () {
            // storing original coordinates
            this.originalx = this.attr("cx");
            this.originaly = this.attr("cy");
            this.attr({opacity: 1});


        },
        upItem = function () {
            for (var i = 0; i < itemAnimations.length; i++) {
                this.stop(itemAnimations[i]);
            }

            this.attr({opacity: 1});

            var stickyThresholdRemainder = distance % stickyThreshold;


            if (stickyThresholdRemainder != 0) {

                if (stickyThresholdRemainder >= (stickyThreshold / 2)) {
                    distance = distance + (stickyThreshold - stickyThresholdRemainder);
                } else {
                    //jump back
                    distance = distance - stickyThresholdRemainder;
                }


                point = circlePath.getPointAtLength(distance);

                itemAnimations.push(this.animate({cx: point.x, cy: point.y}, 200, 'backOut'));

                var thisMenuItemIndexNumber = 0;

                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i] === this) {
                        thisMenuItemIndexNumber = i;
                        break;
                    }
                }
                for (var i = 0; i < menuItems.length; i++) {
                    if (i !== thisMenuItemIndexNumber) {
                        var newDistance = (distance + ((i - thisMenuItemIndexNumber) * stickyThreshold));
                        if (newDistance > totalPathLength) {
                            newDistance = newDistance - totalPathLength;
                        }
                        var newPoint = circlePath.getPointAtLength(newDistance);
                        itemAnimations.push(menuItems[i].animate({cx: newPoint.x, cy: newPoint.y}, 200, 'backOut'));
                    }
                }

            }

            var itemNumber = distance / stickyThreshold;

            $('#item-number').text(itemNumber + 1);


        },

        gradSearch = function (l0, pt) {
            l0 = l0 + totalPathLength;
            var l1 = l0,
                dist0 = dist(circlePath.getPointAtLength(l0 % totalPathLength), pt),
                dist1,
                searchDir;
            //work out search direction
            if (dist(circlePath.getPointAtLength((l0 - searchDl) % totalPathLength), pt) >
                dist(circlePath.getPointAtLength((l0 + searchDl) % totalPathLength), pt)) {
                searchDir = searchDl;
            } else {
                searchDir = -searchDl;
            }

            l1 += searchDir;
            dist1 = dist(circlePath.getPointAtLength(l1 % totalPathLength), pt);
            while (dist1 < dist0) {
                dist0 = dist1;
                l1 += searchDir;
                dist1 = dist(circlePath.getPointAtLength(l1 % totalPathLength), pt);
            }
            l1 -= searchDir;

            return (l1 % totalPathLength);
        },

    //get the distance between two points
        dist = function (pt1, pt2) {
            var dx = pt1.x - pt2.x;
            var dy = pt1.y - pt2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].drag(moveItem, startItem, upItem);
    }


})(jQuery, Raphael);