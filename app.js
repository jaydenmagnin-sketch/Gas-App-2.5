const boyNames = ["Liam", "Noah", "Mason", "Elijah", "Lucas", "Ethan", "Theo", "Aiden"];
const girlNames = ["Olivia", "Emma", "Ava", "Sophia", "Mia", "Amelia", "Luna", "Isla"];

const boyBtn = document.getElementById("boy-btn");
const girlBtn = document.getElementById("girl-btn");
const renderBtn = document.getElementById("render-btn");
const resultEl = document.getElementById("result");

let selectedType = "";

function getRandomName(names) {
  return names[Math.floor(Math.random() * names.length)];
}

function setSelected(type) {
  selectedType = type;
  boyBtn.classList.toggle("selected", type === "boy");
  girlBtn.classList.toggle("selected", type === "girl");
}

boyBtn.addEventListener("click", () => setSelected("boy"));
girlBtn.addEventListener("click", () => setSelected("girl"));

renderBtn.addEventListener("click", () => {
  if (!selectedType) {
    resultEl.textContent = "Please pick Boy or Girl first.";
    return;
  }

  const pool = selectedType === "boy" ? boyNames : girlNames;
  const name = getRandomName(pool);
  resultEl.textContent = `Try this ${selectedType} name: ${name}`;
});
