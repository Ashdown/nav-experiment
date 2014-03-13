(function ($, Raphael) {

    var paper = Raphael(0, 240, 320, 240);
    var distance = 0;

    var circlePath = paper.path(Raphael._getPath.circle({ attrs: { cx: 160, cy: 200, r: 160 } }))
    var point = circlePath.getPointAtLength(distance);

    var totalPathLength = circlePath.getTotalLength();

    var searchDl = 1;

    var nextPageIndexValue = 0;

    var menuItems = new Array();
    var itemAnimations = new Array();
    var nextItemPoint = circlePath.getPointAtLength(distance);

    var menuItemHomeX = nextItemPoint.x;
    var menuItemHomeY = nextItemPoint.y;

    var totalNumberOfMenuItems = 8;

    var stickyThreshold = totalPathLength / totalNumberOfMenuItems;//220;

    for (var i = 1; i <= totalNumberOfMenuItems; i++) {
        var newMenuItem = paper.circle(nextItemPoint.x, nextItemPoint.y, 40);
        newMenuItem.attr("fill", "#f00");
        newMenuItem.attr("stroke", "#f00");
        menuItems.push(newMenuItem);
        nextItemPoint = circlePath.getPointAtLength(stickyThreshold * i);
    }

    //give them better colours

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

                    if (newDistance < 0) {
                        newDistance = totalPathLength + newDistance;
                    }
                    if (newDistance > totalPathLength) {
                        newDistance = newDistance - totalPathLength;
                    }
                    var newPoint = circlePath.getPointAtLength(newDistance);
                    menuItems[i].attr({cx: newPoint.x, cy: newPoint.y})

                }
            }

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

                function isThisTheCurrentSlide(point) {
                if ((point.y >= (menuItemHomeY - 10)) &&
                    (point.y <= (menuItemHomeY + 10)) &&
                    (point.x >= (menuItemHomeX -10)) &&
                    (point.x <= (menuItemHomeX + 10))){
                        return true;
                    }
                }


                if (isThisTheCurrentSlide(point)) {
                    nextPageIndexValue = i;
                }

                for (var i = 0; i < menuItems.length; i++) {
                    if (i !== thisMenuItemIndexNumber) {
                        var newDistance = (distance + ((i - thisMenuItemIndexNumber) * stickyThreshold));
                        if (newDistance < 0) {
                            newDistance = totalPathLength + newDistance;
                        }
                        if (newDistance > totalPathLength) {
                            newDistance = newDistance - totalPathLength;
                        }
                        var newPoint = circlePath.getPointAtLength(newDistance);
                        itemAnimations.push(menuItems[i].animate({cx: newPoint.x, cy: newPoint.y}, 200, 'backOut'));
                        if (isThisTheCurrentSlide(newPoint)) {
                            nextPageIndexValue = i;
                        }
                    }
                }

            }

            var itemNumber = 0;

            if (distance != 0) {
                itemNumber = distance / stickyThreshold;
            }

            if (itemNumber === totalNumberOfMenuItems) {
                itemNumber = 0;
            }

            $('#item-number').text(nextPageIndexValue + 1);


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