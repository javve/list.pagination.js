var classes = require('classes'),
    events = require('event');

module.exports = function(options) {
    options = options || {};

    var pagingList,
        list;

    var refresh = function() {
        var item,
            l = list.matchingItems.length,
            index = list.i,
            page = list.page,
            pages = Math.ceil(l / page),
            currentPage = Math.ceil((index / page)),
            innerWindow = options.innerWindow || 2,
            left = options.left || options.outerWindow || 0,
            right = options.right || options.outerWindow || 0,
            activeClass = options.activeClass || "active";

        right = pages - right;

        pagingList.clear();
        for (var i = 1; i <= pages; i++) {
            var className = (currentPage === i) ? activeClass : "";

            //console.log(i, left, right, currentPage, (currentPage - innerWindow), (currentPage + innerWindow), className);

            if (is.number(i, left, right, currentPage, innerWindow)) {
                item = pagingList.add({
                    page: i,
                    dotted: false
                })[0];
                if (className) {
                    classes(item.elm).add(className);
                }
                addEvent(item.elm, i, page);
            } else if (is.dotted(i, left, right, currentPage, innerWindow, pagingList.size())) {
                item = pagingList.add({
                    page: "...",
                    dotted: true
                })[0];
                classes(item.elm).add("disabled");
            }
        }
    };

    var is = {
        number: function(i, left, right, currentPage, innerWindow) {
           return this.left(i, left) || this.right(i, right) || this.innerWindow(i, currentPage, innerWindow);
        },
        left: function(i, left) {
            return (i <= left);
        },
        right: function(i, right) {
            return (i > right);
        },
        innerWindow: function(i, currentPage, innerWindow) {
            return ( i >= (currentPage - innerWindow) && i <= (currentPage + innerWindow));
        },
        dotted: function(i, left, right, currentPage, innerWindow, currentPageItem) {
            return this.dottedLeft(i, left, right, currentPage, innerWindow) || (this.dottedRight(i, left, right, currentPage, innerWindow, currentPageItem));
        },
        dottedLeft: function(i, left, right, currentPage, innerWindow) {
            return ((i == (left + 1)) && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right));
        },
        dottedRight: function(i, left, right, currentPage, innerWindow, currentPageItem) {
            if (pagingList.items[currentPageItem-1].values().dotted) {
                return false;
            } else {
                return ((i == (right)) && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right));
            }
        }
    };

    var addEvent = function(elm, i, page) {
       events.bind(elm, 'click', function() {
           list.show((i-1)*page + 1, page);
       });
    };

    return {
        init: function(parentList) {
            list = parentList;
            pagingList = new List(list.listContainer.id, {
                listClass: options.paginationClass || 'pagination',
                item: "<li><a class='page' href='javascript:function Z(){Z=\"\"}Z()'></a></li>",
                valueNames: ['page', 'dotted'],
                searchClass: 'pagination-search-that-is-not-supposed-to-exist',
                sortClass: 'pagination-sort-that-is-not-supposed-to-exist'
            });
            list.on('updated', refresh);
            refresh();
        },
        name: options.name || "pagination"
    };
};
