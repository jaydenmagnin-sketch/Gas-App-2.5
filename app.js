const nationalBoyNames = [
  "Liam",
  "Noah",
  "Oliver",
  "Elijah",
  "James",
  "William",
  "Benjamin",
  "Lucas",
  "Henry",
  "Theodore",
  "Jack",
  "Levi",
  "Alexander",
  "Jackson",
  "Mateo",
  "Daniel",
  "Michael",
  "Mason",
  "Sebastian",
  "Ethan",
];

const nationalGirlNames = [
  "Olivia",
  "Emma",
  "Charlotte",
  "Amelia",
  "Sophia",
  "Mia",
  "Isabella",
  "Ava",
  "Evelyn",
  "Luna",
  "Harper",
  "Camila",
  "Sofia",
  "Scarlett",
  "Elizabeth",
  "Eleanor",
  "Emily",
  "Chloe",
  "Mila",
  "Violet",
];

const stateNameData = {
  california: {
    boy: ["Mateo", "Sebastian", "Santiago", "Elijah", "Julian", "Noah", "Ezra", "Leo"],
    girl: ["Camila", "Sofia", "Mia", "Luna", "Valentina", "Isabella", "Aria", "Nova"],
  },
  texas: {
    boy: ["Liam", "Noah", "Santiago", "Mateo", "Elijah", "Luca", "Hudson", "Maverick"],
    girl: ["Emma", "Olivia", "Camila", "Sofia", "Amelia", "Isla", "Avery", "Eliana"],
  },
  florida: {
    boy: ["Noah", "Liam", "Lucas", "Levi", "Ethan", "Logan", "Elijah", "Asher"],
    girl: ["Olivia", "Sophia", "Mia", "Isabella", "Emma", "Ava", "Gianna", "Luna"],
  },
  newyork: {
    boy: ["Liam", "Noah", "Ethan", "David", "Joseph", "Jacob", "Ezra", "Isaac"],
    girl: ["Emma", "Olivia", "Leah", "Chloe", "Sarah", "Sophia", "Ava", "Mila"],
  },
  illinois: {
    boy: ["Noah", "Liam", "Henry", "Jack", "Theodore", "Benjamin", "Owen", "Leo"],
    girl: ["Olivia", "Charlotte", "Amelia", "Evelyn", "Harper", "Nora", "Mila", "Violet"],
  },
  georgia: {
    boy: ["William", "Noah", "James", "Jackson", "Levi", "Hudson", "Asher", "Mason"],
    girl: ["Charlotte", "Amelia", "Harper", "Evelyn", "Ella", "Avery", "Grace", "Hazel"],
  },
  ohio: {
    boy: ["Liam", "Noah", "Oliver", "Henry", "Jack", "Levi", "Wyatt", "Elias"],
    girl: ["Olivia", "Emma", "Charlotte", "Amelia", "Ava", "Mia", "Lily", "Aria"],
  },
  pennsylvania: {
    boy: ["Noah", "Liam", "Lucas", "Benjamin", "Elijah", "Logan", "Julian", "Daniel"],
    girl: ["Charlotte", "Olivia", "Emma", "Sophia", "Mila", "Isla", "Avery", "Lucy"],
  },
  northcarolina: {
    boy: ["Liam", "Noah", "James", "Mason", "Ethan", "Carter", "Levi", "Josiah"],
    girl: ["Olivia", "Amelia", "Emma", "Ava", "Charlotte", "Harper", "Ellie", "Ivy"],
  },
  michigan: {
    boy: ["Oliver", "Liam", "Noah", "Henry", "Theo", "Levi", "Ethan", "Isaac"],
    girl: ["Charlotte", "Olivia", "Amelia", "Isla", "Eleanor", "Mia", "Violet", "Nora"],
  },
};

const stateAliases = {
  california: "california",
  ca: "california",
  texas: "texas",
  tx: "texas",
  florida: "florida",
  fl: "florida",
  ny: "newyork",
  "new york": "newyork",
  illinois: "illinois",
  il: "illinois",
  georgia: "georgia",
  ga: "georgia",
  ohio: "ohio",
  oh: "ohio",
  pennsylvania: "pennsylvania",
  pa: "pennsylvania",
  "north carolina": "northcarolina",
  nc: "northcarolina",
  michigan: "michigan",
  mi: "michigan",
};

const boyBtn = document.getElementById("boy-btn");
const girlBtn = document.getElementById("girl-btn");
const renderBtn = document.getElementById("render-btn");
const resultEl = document.getElementById("result");
const stateInput = document.getElementById("state");

let selectedType = "";

function getRandomName(names) {
  return names[Math.floor(Math.random() * names.length)];
}

function normalizeState(value) {
  const cleaned = value.trim().toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ");
  return stateAliases[cleaned] || cleaned.replace(/\s/g, "");
}

function getNamePool(type, stateInputValue) {
  const stateKey = normalizeState(stateInputValue);
  const stateData = stateNameData[stateKey];

  if (stateData && stateData[type]) {
    return {
      names: stateData[type],
      source: `popular in ${stateInputValue.trim()}`,
    };
  }

  return {
    names: type === "boy" ? nationalBoyNames : nationalGirlNames,
    source: "nationally popular",
  };
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

  if (!stateInput.value.trim()) {
    resultEl.textContent = "Please enter your state first (like California or TX).";
    return;
  }

  const { names, source } = getNamePool(selectedType, stateInput.value);
  const name = getRandomName(names);
  resultEl.textContent = `Try this ${selectedType} name: ${name} (${source})`;
});
