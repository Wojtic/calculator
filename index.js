// není třeba čekat, než se dokument načte, jelikož je <script> až na konci <body>
// ---------------------------------------------------------------- objekty
const soustava_vyber = document.querySelector(".inpt_soustava");
const mode42_toggle = document.querySelector(".check_42");
const kalkulacka_vyber = document.querySelector(".calc_mode_select");
const abc_input = document.querySelector(".abc_nastaveni_vstup");
const abc_tlacitko = document.querySelector(".abc_generate");
const vstupy = document.querySelectorAll(".abc input");
const kalkulacka_obal = document.querySelector(".calculator_inside");
// ---------------------------------------------------------------- obecné
const CISLOMAXHODNOTA = 10000;
let ABECEDA = [];
let priklad = "";

let SOUSTAVA = soustava_vyber.value;
let MODE42 = mode42_toggle.checked;
let kalkulacka = kalkulacka_vyber.value;

soustava_vyber.onchange = () => {
  SOUSTAVA = soustava_vyber.value;
  renderCalc();
};
mode42_toggle.onclick = () => {
  MODE42 = mode42_toggle.checked;
  renderCalc();
};
kalkulacka_vyber.onchange = () => {
  kalkulacka = kalkulacka_vyber.value;
  renderCalc();
};
// -------------------------------------------------------------------- abeceda
const zakazaneRgx = /\.|\,|\-|\+|\-|\*|\/|\(|\)|\=/;

abc_tlacitko.onclick = setup_abc;
setup_abc();
setupVstupyEventListenery();
// -------------------------------------------------------------------- kalkulačka obecné
function renderCalc() {
  switch (kalkulacka) {
    case "random":
      renderRandomCalc();
      break;
    case "normal":
      renderNormalCalc();
      break;
    default:
      kalkulacka_obal.innerHTML = "";
      break;
  }
}

function evaluateExpression() {
  priklad = priklad.slice(
    0,
    priklad.indexOf("=") == -1 ? priklad.length : priklad.indexOf("=")
  );
  const vysledek = vyhodnot(preved_priklad(priklad, ABECEDA, SOUSTAVA));
  const nasobek42 =
    vysledek < 0 ? Math.ceil(vysledek / 42) : Math.floor(vysledek / 42);
  priklad +=
    "=" +
    (MODE42
      ? deset_do_n(42, SOUSTAVA, ABECEDA) +
        "*" +
        deset_do_n(nasobek42, SOUSTAVA, ABECEDA) +
        "+" +
        deset_do_n(vysledek % 42, SOUSTAVA, ABECEDA)
      : deset_do_n(vysledek, SOUSTAVA, ABECEDA)); // U záproných čísel se chová zvláštně
  return priklad;
}
// --------------------------------------------------------------------- náhodná kalkulačka
function renderRandomCalc() {
  kalkulacka_obal.innerHTML =
    '<div class="calculator_random"><p class="random_nadpis">Je to váš příklad?</p> <p class="random_priklad"></p> <button class="random_wrong">To je špatně. :(</button> <button class="random_right">To je on! :)</button> </div>';
  const p_priklad = document.querySelector(".random_priklad");

  function changeExpression() {
    let cislo1 = Math.floor(Math.random() * CISLOMAXHODNOTA);
    let cislo2 = Math.floor(Math.random() * CISLOMAXHODNOTA);

    priklad =
      deset_do_n(cislo1, SOUSTAVA, ABECEDA) +
      ["+", "-", "*", "/"][Math.floor(Math.random() * 4)] +
      deset_do_n(cislo2, SOUSTAVA, ABECEDA);

    p_priklad.innerHTML = priklad;
  }

  priklad != "" ? (p_priklad.innerHTML = priklad) : changeExpression();
  priklad.includes("=") ? (p_priklad.innerHTML = evaluateExpression()) : ""; // Přepočítá po např. změně soustavy

  document.querySelector(".random_wrong").onclick = changeExpression;
  document.querySelector(".random_right").onclick = () =>
    (p_priklad.innerHTML = evaluateExpression());
}
// --------------------------------------------------------------------- normální kalkulačka
function renderNormalCalc() {
  let cisla = "";
  for (let i = 0; i < SOUSTAVA; i++) {
    cisla += `<button class="cislo" id="cislo${i}">${ABECEDA[i]}</button>`;
  }
  kalkulacka_obal.innerHTML = `<div class="calculator_normal"> <div class="screen"></div> <div class="znamenka_vodorovne"> <button class="znamenko_plus">+</button> <button class="znamenko_minus">-</button> <button class="znamenko_krat">*</button> <button class="znamenko_deleno">/</button> </div> <div class="znamenka_svisle"> <button class="znamenko_C">C</button><button class="znamenko_zavorka_leva">(</button> <button class="znamenko_zavorka_prava">)</button> <button class="znamenko_carka">,</button><button class="znamenko_rovnase">=</button> </div> <div class="cisla">${cisla}</div> </div>`;

  const priklad_screen = document.querySelector(".screen");
  priklad_screen.innerHTML = priklad;

  const cisla_divy = document.querySelectorAll(".cislo");
  cisla_divy.forEach((el) => {
    el.addEventListener("click", (event) => {
      priklad.includes("=")
        ? (priklad = priklad.slice(0, priklad.indexOf("=")))
        : "";
      priklad += ABECEDA[event.target.id.slice(5)];
      priklad_screen.innerHTML = priklad;
    });
  });

  priklad.includes("=")
    ? (priklad_screen.innerHTML = evaluateExpression())
    : ""; // Přepočítá po např. změně soustavy

  const zmen_priklad = (znak) => {
    // logika pro nahrazování znamének (např. na začátku nesmí být +*/)
    priklad.includes("=")
      ? (priklad = priklad.slice(0, priklad.indexOf("=")))
      : "";
    if (priklad.length == 0 && znak == "-") {
      priklad = "-";
    } else if (
      priklad.length > 1 ||
      (!"+-*/,.".includes(priklad[0]) && priklad.length != 0)
    ) {
      "+-*/,.".includes(priklad[priklad.length - 1])
        ? (priklad = priklad.slice(0, -1) + znak)
        : (priklad += znak);
    }
    priklad_screen.innerHTML = priklad;
  };
  const zmackl_zavorka = (zavorka) => {
    priklad.includes("=")
      ? (priklad = priklad.slice(0, priklad.indexOf("=")))
      : "";
    priklad += zavorka;
    priklad_screen.innerHTML = priklad;
  };
  document.querySelector(".znamenko_minus").onclick = () => zmen_priklad("-");
  document.querySelector(".znamenko_plus").onclick = () => zmen_priklad("+");
  document.querySelector(".znamenko_krat").onclick = () => zmen_priklad("*");
  document.querySelector(".znamenko_deleno").onclick = () => zmen_priklad("/");
  document.querySelector(".znamenko_zavorka_leva").onclick = () =>
    zmackl_zavorka("(");
  document.querySelector(".znamenko_zavorka_prava").onclick = () =>
    zmackl_zavorka(")");
  document.querySelector(".znamenko_rovnase").onclick = () =>
    (priklad_screen.innerHTML = evaluateExpression());
  document.querySelector(".znamenko_C").onclick = () => {
    priklad = "";
    priklad_screen.innerHTML = priklad;
  };
  const zmackl_carka = () => {
    priklad.includes("=")
      ? (priklad = priklad.slice(0, priklad.indexOf("=")))
      : "";
    if (priklad.length > 0 && !"+-*/.,".includes(priklad[priklad.length - 1])) {
      priklad += ",";
    } else if (priklad.length > 0) {
      priklad = priklad.slice(0, -1) + ",";
    }
    priklad_screen.innerHTML = priklad;
  };
  document.querySelector(".znamenko_carka").onclick = zmackl_carka;

  document.addEventListener("keydown", (event) => {
    if (kalkulacka != "normal") {
      return;
    }
    switch (event.code) {
      case "NumpadAdd":
        zmen_priklad("+");
        break;
      case "NumpadSubtract":
        zmen_priklad("-");
        break;
      case "NumpadMultiply":
        zmen_priklad("*");
        break;
      case "NumpadDivide":
        zmen_priklad("/");
        break;
      case "Enter":
      case "NumpadEnter":
        priklad_screen.innerHTML = evaluateExpression();
        break;
      case "Comma":
      case "Period":
      case "NumpadDecimal":
        zmackl_carka();
        break;
      default:
        if ("0123456789".includes(event.code[6])) {
          priklad.includes("=")
            ? (priklad = priklad.slice(0, priklad.indexOf("=")))
            : "";
          priklad += ABECEDA[event.code[6]];
          priklad_screen.innerHTML = priklad;
        }
        break;
    }
  });
}
