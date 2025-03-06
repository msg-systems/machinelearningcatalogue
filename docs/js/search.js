jQuery(function () {
    window.data = $.getJSON('/search_data.json');
    window.data.then(function (searchData) {
        window.idx = lunr(function () {
            this.ref('id');
            this.field('title');
            this.field('content', {
                boost: 10
            });
            this.field('url');
            this.metadataWhitelist = ['position'];

            searchData.forEach(function (value) {
                this.add(value);
            }, this);
        }, searchData);
    });

    $("#search-box").keyup(function (event) {
        $('#site-search').addClass('show');
        $('#search-results-dropdown').addClass('show');
        $('#search-box').attr('aria-expanded', true);

        var query = $("#search-box").val();
        if (query.length >= 3) {
            var results = window.idx.search(query);
            displaySearchResults(results);
        }
    });

    function displaySearchResults(results) {
        var $searchResults = $("#search-results");

        window.data.then(function (searchData) {
            if (results.length) {
                $searchResults.empty();
                results.forEach(function (result) {
                    var item = {};
                    for (var i = 0; i < searchData.length; i++) {
                        if (searchData[i].id == result.ref)
                            item = searchData[i];
                    }
                    var appendString = '<a class="list-group-item" href="' + item.url + '?s=' + encodeURI($("#search-box").val()) + '">' + item.title + '</a>';
                    $searchResults.append(appendString);
                });
            } else {
                $searchResults.html('<p class="list-group-item">No results found.</p><p class="list-group-item text-muted contextual-help">Please check spelling, spacing and parameters. Use *, + and - to modify the search parameters.</p>');
            }
        });
    }
});