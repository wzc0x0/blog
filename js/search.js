var summaryInclude = 60;
var fuseOptions = {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.0,
    tokenize: true,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        { name: "title", weight: 0.8 },
        { name: "contents", weight: 0.5 },
        { name: "tags", weight: 0.3 },
        { name: "categories", weight: 0.3 }
    ]
};
var searchQuery;
var startTime;
window.addEventListener("popstate", init);
window.addEventListener("load", init);

function init() {
    searchQuery = param("s");
    if (searchQuery) {
        $("#search-query").val(searchQuery);
        executeSearch(searchQuery);
    }
}

var executeInlineSearch = debounce(
    function() {
        $(".my-auto .loading-skeleton").show();
        $(".search-results-empty").remove();
        $(".search-results-summary").remove();
        $("#search-results .left").text("");
        var query = document.getElementById("search-query").value.trim();
        // write current query to address bar!
        window.history.pushState(null, null, "?s=" + query);
        if (query !== "") {
            searchQuery = query;
            executeSearch(query);
        } else {
            $(".my-auto .loading-skeleton").hide();
            $("#search-results").append(
                '<p class="search-results-empty">输入为空哦( ˘•ω•˘ )</p>'
            );
        }
    },
    300,
    false
);

function executeSearch(searchQuery) {
    startTime = window.performance.now();
    $.getJSON("/index.json", function(data) {
        var pages = data;
        var fuse = new Fuse(pages, fuseOptions);
        var result = fuse.search(searchQuery);
        if (result.length > 0) {
            populateResults(result);
        } else {
            var duration = parseInt(window.performance.now() - startTime);
            $("#search-results .left").text(
                "用时：" + duration + "ms  共找到" + result.length + "条结果"
            );
            $("#search-results").append(
                '<p class="search-results-empty">抱歉没找到X﹏X</p>'
            );
            $(".my-auto .loading-skeleton").hide();
        }
    });
}

function populateResults(result) {
    $.each(result, function(key, value) {
        var contents = value.item.contents;
        var snippet = "";
        var snippetHighlights = [];
        var tags = [];
        if (fuseOptions.tokenize) {
            snippetHighlights.push(searchQuery);
        } else {
            $.each(value.matches, function(matchKey, mvalue) {
                if (mvalue.key == "tags" || mvalue.key == "categories") {
                    snippetHighlights.push(mvalue.value);
                } else if (mvalue.key == "contents") {
                    start =
                        mvalue.indices[0][0] - summaryInclude > 0 ?
                        mvalue.indices[0][0] - summaryInclude :
                        0;
                    end =
                        mvalue.indices[0][1] + summaryInclude < contents.length ?
                        mvalue.indices[0][1] + summaryInclude :
                        contents.length;
                    snippet += contents.substring(start, end);
                    snippetHighlights.push(
                        mvalue.value.substring(
                            mvalue.indices[0][0],
                            mvalue.indices[0][1] - mvalue.indices[0][0] + 1
                        )
                    );
                }
            });
        }

        if (snippet.length < 1) {
            snippet += contents.substring(0, summaryInclude * 2);
        }
        //pull template from hugo templarte definition
        var templateDefinition = $("#search-result-template").html();
        //replace values
        var output = render(templateDefinition, {
            key: key,
            title: value.item.title,
            link: value.item.permalink,
            tags: value.item.tags,
            categories: value.item.categories,
            date: dateFormat(value.item.date),
            snippet: snippet
        });
        $("#search-results").append(output);

        $.each(snippetHighlights, function(snipkey, snipvalue) {
            $("#summary-" + key).mark(snipvalue);
        });
    });

    var duration = parseInt(window.performance.now() - startTime);
    $("#search-results .left").text(
        "用时：" + duration + "ms  共找到" + result.length + "条结果"
    );
    $(".my-auto .loading-skeleton").hide();
}

function param(name) {
    return decodeURIComponent(
        (location.search.split(name + "=")[1] || "").split("&")[0]
    ).replace(/\+/g, " ");
}

function dateFormat(time) {
    let date = new Date(time * 1000),
        y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        p = function(m) {
            return m <= 9 ? "0" + m : m;
        };

    return y + "-" + p(m) + "-" + p(d);
}

function render(templateString, data) {
    var conditionalMatches, conditionalPattern, copy;
    conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
    //since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
    copy = templateString;
    while (
        (conditionalMatches = conditionalPattern.exec(templateString)) !== null
    ) {
        if (data[conditionalMatches[1]]) {
            //valid key, remove conditionals, leave contents.
            copy = copy.replace(conditionalMatches[0], conditionalMatches[2]);
        } else {
            //not valid, remove entire section
            copy = copy.replace(conditionalMatches[0], "");
        }
    }
    templateString = copy;
    //now any conditionals removed we can do simple substitution
    var key, find, re;
    for (key in data) {
        find = "\\$\\{\\s*" + key + "\\s*\\}";
        re = new RegExp(find, "g");
        templateString = templateString.replace(re, data[key]);
    }
    return templateString;
}

// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;

    // This is the function that is actually executed when
    // the DOM event is triggered.
    return function executedFunction() {
        // Store the context of this and any
        // parameters passed to executedFunction
        var context = this;
        var args = arguments;

        // The function to be called after
        // the debounce time has elapsed
        var later = function() {
            // null timeout to indicate the debounce ended
            timeout = null;

            // Call function now if you did not on the leading end
            if (!immediate) func.apply(context, args);
        };

        // Determine if you should call the function
        // on the leading or trail end
        var callNow = immediate && !timeout;

        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the
        // inside of the previous setTimeout
        clearTimeout(timeout);

        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs node)
        timeout = setTimeout(later, wait);

        // Call immediately if you're dong a leading
        // end execution
        if (callNow) func.apply(context, args);
    };
}