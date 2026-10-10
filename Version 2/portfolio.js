/* Optional enhancements. Reading and navigation work without JavaScript. */
(function () {
  "use strict";
  /* Image filenames and project folders are preserved under Images/. Missing uploads get a labeled frame. */
  document.querySelectorAll(".media img").forEach(function (img) {
    function markMissing() {
      img.hidden = true;
      var link = img.closest(".image-link");
      if (link) {
        link.setAttribute("aria-disabled", "true");
        link.removeAttribute("href");
        link.removeAttribute("tabindex");
      }
      var fallback = img.parentElement.querySelector(".photo-fallback");
      if (fallback) { fallback.removeAttribute("aria-hidden"); }
    }
    img.addEventListener("error", markMissing);
    if (img.complete && img.naturalWidth === 0) { markMissing(); }
  });

  var filters = document.querySelector(".filters");
  if (filters) {
    filters.hidden = false;
    var status = document.querySelector("#filter-status");
    var cards = document.querySelectorAll(".project-card");
    filters.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () {
        var selected = button.dataset.filter;
        filters.querySelectorAll("button").forEach(function (other) {
          other.setAttribute("aria-pressed", other === button ? "true" : "false");
        });
        var visible = 0;
        cards.forEach(function (card) {
          var categories = card.dataset.categories.split(" ");
          var show = selected === "all" || categories.indexOf(selected) !== -1;
          card.hidden = !show;
          if (show) { visible += 1; }
        });
        if (status) { status.textContent = visible + " projects shown"; }
      });
    });
  }

  /* Native dialog supports Escape; links still open the photo without JS. */
  if (typeof HTMLDialogElement !== "undefined") {
    var dialog = document.createElement("dialog");
    dialog.className = "image-dialog";
    dialog.setAttribute("aria-label", "Project photo");
    var closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "dialog-close";
    closeButton.textContent = "Close";
    var largeImage = document.createElement("img");
    var caption = document.createElement("p");
    dialog.append(closeButton, largeImage, caption);
    document.body.appendChild(dialog);
    closeButton.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        var rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { dialog.close(); }
      }
    });
    document.querySelectorAll(".image-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var img = link.querySelector("img");
        if (!img || img.hidden || !img.complete || !img.naturalWidth) { return; }
        event.preventDefault();
        largeImage.src = img.src;
        largeImage.alt = img.alt;
        var figcaption = link.closest("figure").querySelector("figcaption");
        caption.textContent = figcaption ? figcaption.textContent : img.alt;
        dialog.showModal();
      });
    });
  }
})();
