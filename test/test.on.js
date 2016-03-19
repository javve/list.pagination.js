describe('On', function() {

    var list,
        itemHTML,
        pagination;

    before(function() {
        itemHTML = fixture.list(['name'])
        list = new List('list', {
            valueNames: ['name'],
            item: itemHTML,
            page: 2,
            plugins: [
                ListPagination({})
            ]
        }, fixture.all);

        pagination = $('.pagination');
        page1 = pagination.find('.page')[0]
    });

    after(function() {
        fixture.removeList();
    });

    describe('changePage', function() {
        it('should be triggered before and after page change', function(done) {
            var done1 = false;
            list.on('pageChangeStart', function(list) {
                done1 = true;
            });
            list.on('pageChangeComplete', function(list) {
                if (done1) {
                    done();
                }
            });
            page1.click();
        });
    });
});
