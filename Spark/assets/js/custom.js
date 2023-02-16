if (document.getElementById("searchBox") != null) {
    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: 5
        }),
        instantsearch.widgets.searchBox({
            container: '#searchBox',
            placeholder: 'Search...',
            showSubmit: false,
            magnifier: false,
            showReset: false,
            cssClasses: {
                input: ['uk-search-input'],
                loadingIndicator: ['uk-form-icon', 'uk-form-icon-flip', 'uk-preserve'],
            },
            showLoadingIndicator: true,
            searchAsYouType: true
        })
    ]);
}

if (document.getElementById("hits") != null) {
    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: 5
        }),
        instantsearch.widgets.hits({
            container: '#hits',
            templates: {
                empty: 'No results',
                item: '<a class="gol-links" href="{{{uri}}}">{{{title}}}</a>'
            }
        })
    ]);
}

if (document.getElementById("searchBox-sideNav") != null) {
    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: 5
        }),
        instantsearch.widgets.searchBox({
            container: '#searchBox-sideNav',
            placeholder: 'Search...',
            autofocus: true,
            magnifier: false,
            showSubmit: false,
            showReset: false,
            cssClasses: {
                input: ['uk-search-input', 'uk-text-center'],
                loadingIndicator: ['uk-form-icon', 'uk-form-icon-flip'],
            },
            showLoadingIndicator: true,
            searchAsYouType: true
        })
    ]);
}

if (document.getElementById("hits-sidenav") != null) {
    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: 5
        }),
        instantsearch.widgets.hits({
            container: '#hits-sidenav',
            templates: {
                empty: 'No results',
                item: '<a class="gol-links" href="{{{uri}}}">{{{title}}}</a>'
            }
        })
    ]);
}


search.start();


var getOutboundLink = function(category, url) {
    gtag('event', 'click', {
        'event_category': category,
        'event_label': url,
        'transport_type': 'beacon',
        'event_callback': function(){document.location = url;}
    });
}
