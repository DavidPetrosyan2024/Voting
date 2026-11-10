/* ================== ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ (միայն այս ֆայլը խմբագրեք) ================== */

const FIREBASE_URL = "https://voting-e1501-default-rtdb.firebaseio.com";   // Firebase տվյալների բազայի հղումը
const API_KEY      = "AIzaSyD590wU93QCM8mPePMHsnyGLmPm5hShk54";   // Firebase Web API Key (պետք է միայն admin էջին)
const TITLE        = "Քվեարկություն";
const SUBTITLE     = "Ընտրիր մեկ տարբերակ";

// Լոգոները դրեք `logos/` թղթապանակում (PNG/SVG/JPG, ցանկալի է քառակուսի)։
// Եթե ֆայլը չկա՝ կերևա գունավոր շրջան առաջին տառով։
const PARTIES = [
  { id: "party1", name: "Հայաստանի լիբերալ-ազատական կուսակցություն", color: "#e5484d", logo: "logos/party1.png" },
  { id: "party2", name: "Հայաստանի էքվալ-ֆեմինիստական կուսակցություն", color: "#f5a524", logo: "logos/party2.png" },
  { id: "party3", name: "Հայաստանի կանաչների կուսակցություն", color: "#f2ff00", logo: "logos/party3.png" },
  { id: "party4", name: "Ազգային պահպանողական կուսակցություն", color: "#1aff00", logo: "logos/party4.png" },
  { id: "party5", name: "<<Արդարություն և աշխատանք>> սոցիալիստական կուսակցություն", color: "#00e1ff", logo: "logos/party5.png" },
  { id: "party6", name: "Հայաստանի քրիստոնեա-դեմոկրատական կուսակցություն", color: "#242bf5", logo: "logos/party6.png" },
];

/* ================== ԸՆԴՀԱՆՈՒՐ ՖՈՒՆԿՑԻԱՆԵՐ ================== */

const LS_VOTED = "voted_timestamp_v1";
const LS_DEMO  = "demo_counts_v1";
const DB = () => FIREBASE_URL.replace(/\/$/, "");

function logoEl(p, size) {
  const wrap = document.createElement("div");
  wrap.className = "logo";
  wrap.style.width = wrap.style.height = size + "px";
  const fallback = () => {
    wrap.innerHTML = "";
    wrap.style.background = p.color;
    wrap.classList.add("fallback");
    wrap.textContent = p.name.trim().charAt(0).toUpperCase();
  };
  const img = new Image();
  img.alt = "";
  img.onerror = fallback;
  img.src = p.logo;
  wrap.appendChild(img);
  return wrap;
}

async function sendVote(id) {
  if (!FIREBASE_URL) {
    const c = JSON.parse(localStorage.getItem(LS_DEMO) || "{}");
    c[id] = (c[id] || 0) + 1;
    localStorage.setItem(LS_DEMO, JSON.stringify(c));
    return;
  }
  const r = await fetch(DB() + "/counts.json", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [id]: { ".sv": { "increment": 1 } } }),
  });
  if (!r.ok) throw new Error("send");
}