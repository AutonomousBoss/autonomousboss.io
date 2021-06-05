var fuse; // holds our search engine
var searchVisible = false;
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('search'); // input box for search
var resultsAvailable = false; // Did we get any search results?

document.getElementById("search").onkeyup = function (e) {
  executeSearch(this.value);
}

function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState !== 4) {
      return;
    }
    if (httpRequest.status !== 200) {
      return;
    }
    callback(JSON.parse(httpRequest.responseText));
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() {
  fetchJSONFile('/index.json', function (data) {

    var options = { // fuse.js options; check fuse.js website for details
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: [
        'title',
        'permalink',
        'summary'
      ]
    };
    fuse = new Fuse(data, options); // build the index from the json file
  });
}

loadSearch();

function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    list.innerHTML = "";
    list.classList.add("empty");
    return
  }
  list.classList.remove("empty");
  // build our html
  for (let index in results.slice(0, 5)) { // only show first 5 results
    var item = results[index].item;

    if (item.type === "job") {
      searchitems += '<li><a href="' + item.source_url + '" tabindex="0">' + '<span class="title">' + item.title + '</span><br /> <span class="sc">' + item.organization + '</span>' + ' — <em>' + item.summary + '</em></a></li>';
    } else if (item.type === "org") {
      searchitems += '<li><a href="' + item.source_url + '" tabindex="0">' + '<span class="title">' + item.title + '</span><br /> <span class="sc">' + item.organization + '</span>' + ' — <em>' + item.summary + '</em></a></li>';
    } else if (item.type === "page") {
      searchitems += '<li><a href="' + item.permalink + '" tabindex="0">' + '<span class="title">' + item.title + '</span><br /> <span class="sc">By ' + item.author + '</span>' + ' on <em>' + item.date + '</em></a></li>';
    }
  }

  list.innerHTML = searchitems;

  // first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
  // last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
}
