document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cards.forEach((card) => {
    const summary = card.querySelector(":scope > summary");
    const panel = card.querySelector(":scope > .panel");

    if (!summary || !panel) {
      return;
    }

    if (!card.open) {
      panel.style.height = "0px";
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (card.dataset.animating === "true") {
        return;
      }

      if (card.open) {
        closeCard(card);
        return;
      }

      cards.forEach((otherCard) => {
        if (otherCard !== card && otherCard.open) {
          closeCard(otherCard);
        }
      });

      openCard(card);
    });
  });

  function openCard(card) {
    const panel = card.querySelector(":scope > .panel");

    if (!panel) {
      return;
    }

    if (reduceMotion) {
      card.open = true;
      panel.style.height = "";
      return;
    }

    card.dataset.animating = "true";
    card.open = true;
    panel.style.height = "0px";
    panel.offsetHeight;

    const targetHeight = panel.scrollHeight;
    panel.style.height = `${targetHeight}px`;

    const onEnd = (event) => {
      if (event.propertyName !== "height") {
        return;
      }

      panel.style.height = "auto";
      card.dataset.animating = "false";
      panel.removeEventListener("transitionend", onEnd);
    };

    panel.addEventListener("transitionend", onEnd);
  }

  function closeCard(card) {
    const panel = card.querySelector(":scope > .panel");

    if (!panel) {
      return;
    }

    if (reduceMotion) {
      card.open = false;
      panel.style.height = "0px";
      return;
    }

    card.dataset.animating = "true";
    panel.style.height = `${panel.scrollHeight}px`;
    panel.offsetHeight;
    panel.style.height = "0px";

    const onEnd = (event) => {
      if (event.propertyName !== "height") {
        return;
      }

      card.open = false;
      card.dataset.animating = "false";
      panel.style.height = "0px";
      panel.removeEventListener("transitionend", onEnd);
    };

    panel.addEventListener("transitionend", onEnd);
  }
});
