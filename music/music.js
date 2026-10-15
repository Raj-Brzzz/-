document.addEventListener("DOMContentLoaded", () => {
  alert("music.js loaded successfully!");

  const button = document.createElement("button");
  button.textContent = "♫ MUSIC TEST";

  button.style.cssText =
    "position:fixed;bottom:20px;right:20px;z-index:999999;background:#fff0f6;color:#98536f;padding:15px;border:2px solid pink;border-radius:30px;cursor:pointer;";

  document.body.appendChild(button);
});