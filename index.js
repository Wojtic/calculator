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
const zakazaneRgx = /\.|\,|\-|\+|\-|\*|\/|\(|\)/;

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
// --------------------------------------------------------------------- náhodná kalkulačka
function renderRandomCalc() {
  kalkulacka_obal.innerHTML =
    '<div class="calculator_random"><p class="random_nadpis">Je to váš příklad?</p> <p class="random_priklad"></p> <button class="random_wrong">To je špatně. :(</button> <button class="random_right">To je on! :)</button> </div>';
  const p_priklad = document.querySelector(".random_priklad");

  function changeExpression() {
    let cislo1 = Math.floor(Math.random() * CISLOMAXHODNOTA);
    let cislo2 = Math.floor(Math.random() * CISLOMAXHODNOTA);

    evaluated = false;

    priklad =
      deset_do_n(cislo1, SOUSTAVA, ABECEDA) +
      ["+", "-", "*", "/"][Math.floor(Math.random() * 4)] +
      deset_do_n(cislo2, SOUSTAVA, ABECEDA);

    p_priklad.innerHTML = priklad;
  }

  function evaluateExpression() {
    priklad = priklad.slice(0, priklad.indexOf("="));
    const vysledek = vyhodnot(preved_priklad(priklad, ABECEDA, SOUSTAVA));
    priklad +=
      "=" +
      (MODE42
        ? deset_do_n(42, SOUSTAVA, ABECEDA) +
          "*" +
          deset_do_n(Math.floor(vysledek / 42), SOUSTAVA, ABECEDA) +
          "+" +
          deset_do_n(vysledek % 42, SOUSTAVA, ABECEDA)
        : deset_do_n(vysledek, SOUSTAVA, ABECEDA)); // U záproných čísel a násobků 42 se chová zvláštně
    p_priklad.innerHTML = priklad;
  }

  priklad != "" ? (p_priklad.innerHTML = priklad) : changeExpression();
  priklad.includes("=") ? evaluateExpression() : "";

  document.querySelector(".random_wrong").onclick = changeExpression;
  document.querySelector(".random_right").onclick = evaluateExpression;
}
// --------------------------------------------------------------------- normální kalkulačka
function renderNormalCalc() {
  let cisla = "";
  for (let i = 0; i < SOUSTAVA; i++) {
    cisla += `<button class="cislo" id="cislo${i}">${ABECEDA[i]}</button>`;
  }
  kalkulacka_obal.innerHTML = `<div class="calculator_normal"> <div class="screen"></div> <div class="znamenka_vodorovne"> <button class="znamenko_plus">+</button> <button class="znamenko_minus">-</button> <button class="znamenko_krat">*</button> <button class="znamenko_deleno">/</button> </div> <div class="znamenka_svisle"> <button class="znamenko_zavorka_leva">(</button> <button class="znamenko_zavorka_prava">)</button> <button class="znamenko_rovnase">=</button> </div> <div class="cisla">${cisla}</div> </div>`;
}
