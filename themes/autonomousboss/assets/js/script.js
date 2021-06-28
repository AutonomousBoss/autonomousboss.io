const keyESC = 27;

function stopPropagation(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}

// Nav
const btnNav = document.querySelector(".btn-nav");
const navTarget = document.querySelector(".nav .wrap-list");
const navSocial = document.querySelector(".nav .wrap-social > ul");

btnNav.addEventListener("click", () => {
  navTarget.classList.toggle("show");
  btnNav.classList.toggle("open")
  navSocial.classList.toggle("show");
})


// Submission modal
const btnPopup = document.querySelector(".submit-job");
const popupTarget = document.querySelector(".postPopup");
const popupBody = document.querySelector(".postPopup-wrap");
const closePopup = document.querySelector(".popup-cross");
btnPopup.addEventListener("click", (e) => {
  popupTarget.classList.toggle("show");
  stopPropagation(e);
});
closePopup.addEventListener("click", () => {
  popupTarget.classList.remove("show");
  stopPropagation(e);
});

popupBody.addEventListener('click', stopPropagation);
popupTarget.addEventListener('click', function () {
  popupTarget.classList.remove("show");
  stopPropagation(e);
});

// Close all overlays on ESC
document.addEventListener('keydown', function (event) {
  if (event.keyCode === keyESC) {
    popupTarget.classList.remove("show");
    navTarget.classList.remove("show");
    navSocial.classList.remove("show");
    btnNav.classList.remove("open");
  }
});

// Datatables
const btnGrid = document.querySelector('.btn-grid');
const btnList = document.querySelector('.btn-list');
const btnLayout = document.querySelectorAll('.btn-layout');
const btnTarget = document.querySelector(".datatable-body");

if (btnList) {
  btnList.addEventListener("click", () => {
    removeGridClasses();
    btnTarget.classList.add("col");
  });
}

if (btnGrid) {
  btnGrid.addEventListener("click", () => {
    removeGridClasses();
    btnTarget.classList.add("col-2");
  });
}

function removeGridClasses() {
  if (btnTarget.classList.contains('col') || btnTarget.classList.contains('col-2')) {
    btnTarget.classList.remove("col-2");
    btnTarget.classList.remove("col");
  }
};

if (btnLayout) {
  btnLayout.forEach(el => {
    el.addEventListener("click", () => {
      removeActive();
      el.classList.add("active");
    })
  });
}

function removeActive() {
  btnLayout.forEach(el => {
    el.classList.remove("active");
  })
};

// FAQ
const faqs = document.querySelectorAll(".about-faq-box");

faqs.forEach(el => {
  el.addEventListener("click", () => {
    faqs.forEach((otherEl) => {
      if (el !== otherEl) {
        otherEl.classList.remove("active");
      }
    });

    el.classList.toggle("active");
  });
});

// Filters
var jobs = document.querySelectorAll('*[data-placard="job"]');
var orgs = document.querySelectorAll('*[data-placard="org"]');
var shownJobs = jobs.length;
var shownOrgs = orgs.length;

// var filterTriggers = document.querySelectorAll("[data-filter-org-platform]");



function handleFilters(placards, triggerSelectors) {
  triggerSelectors.forEach((triggerSelector) => {
    triggerSelector.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        var filterKeys = Object.keys(e.target.dataset);
        console.log(filterKeys);

        if (filterKeys.length === 0) {
          return;
        }
        stopPropagation(e);
        e.preventDefault();

        var newCount = 0;
        var filterKey = filterKeys[0];
        var placardKey = filterKey[6].toLowerCase() + filterKey.slice(7, filterKey.length)
        placards.forEach((org) => {
          console.log(placardKey, filterKey);
          console.log(org.dataset[placardKey],   e.target.dataset);
          if (org.dataset[placardKey] === e.target.dataset[filterKey]) {
            org.classList.remove("hide");
            newCount++;
          } else {
            org.classList.add("hide");
          }
        });

        shownOrgs = newCount;
      });
    });
  });
}

handleFilters(jobs, [
  document.querySelectorAll("[data-filter-job-field]"),
  document.querySelectorAll("[data-filter-job-networks]"),
  document.querySelectorAll("[data-filter-job-platform]"),
]);

handleFilters(orgs, [
  // document.querySelectorAll("[data-filter-org-networks]"),
  document.querySelectorAll("[data-filter-org-platform]"),
]);

