// Start loading the index immediately
var fuse;
var templates = {};

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

function loadIndex() {
  fetchJSONFile('/index.json', function (data) {
    templates = data.templates;

    fuse = new Fuse(data.search, {
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
    });
  });
}

// Now rig up the UI to use the search index
(function () {
  var resultsUL = document.getElementById('searchResults');
  var searchInput = document.getElementById('search');
  if (!resultsUL || !searchInput) {
    return;
  }

  loadIndex();

  var searchVisible = false;
  var resultsAvailable = false;

  function handleResults(results) {
    if (results.length === 0) {
      resultsUL.classList.add("hide");
      searchVisible = false;
      resultsAvailable = false;
      resultsUL.innerHTML = "";
      return
    }

    var resultsFragments = [];
    for (let index in results.slice(0, 5)) {
      var item = results[index].item;
      var html = (templates[item.type] || {})[item.slug];
      if (html) {
        resultsFragments.push("<li tabindex='" + resultsFragments.length + "'>" + html + "</li>");
      }
    }

    resultsUL.innerHTML = resultsFragments.join("");
    resultsAvailable = true;
    searchVisible = true;
    resultsUL.classList.remove("hide");
  }

  function executeSearch(term) {
    handleResults(fuse.search(term));
  }

  function stopPropagation(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }
  resultsUL.addEventListener('click', stopPropagation);
  searchInput.addEventListener('click', stopPropagation);
  document.addEventListener('click', function () {
    resultsUL.classList.add("hide");
  });

  document.addEventListener('keydown', function (event) {
    // Allow ESC (27) to close search box
    if (searchVisible && event.keyCode === keyESC) {
        searchVisible = false
        document.activeElement.blur();
        resultsUL.classList.add("hide");
    }
  });

  searchInput.addEventListener('keyup', function (e) {
    executeSearch(this.value);
  });

  searchInput.addEventListener('focus', function (e) {
    executeSearch(this.value);
  });
})();
