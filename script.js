const toolCards = document.querySelectorAll(".tool-card");

toolCards.forEach((card) => {
  card.addEventListener("click", () => {
    const toolName = card.querySelector("h2")?.textContent || "coping tool";
    console.log(`Opening ${toolName}`);
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("home-button-sw.js").catch((error) => {
    console.warn("Home button service worker could not be registered:", error);
  });
}
