
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
const closePopup = document.querySelector(".popup-cross");
btnPopup.addEventListener("click", () => {
  popupTarget.classList.add("show");
})

closePopup.addEventListener("click", () => {
  popupTarget.classList.remove("show");
})


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

function removeGridClasses(){
  if(btnTarget.classList.contains('col') || btnTarget.classList.contains('col-2')){
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

function removeActive(){
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
