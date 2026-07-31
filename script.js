const toolCards = document.querySelectorAll(".tool-card");

toolCards.forEach((card) => {
  card.addEventListener("click", () => {
    const toolName = card.querySelector("h2")?.textContent || "coping tool";
    console.log(`Opening ${toolName}`);
  });
});
