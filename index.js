// není třeba čekat, než se dokument načte, jelikož je <script> až na konci <body>
// -------------------------------------------------------------------- abeceda
let ABECEDA = [];

const abc_input = document.querySelector(".abc_nastaveni_vstup");
const abc_tlacitko = document.querySelector(".abc_generate");
const vstupy = document.querySelectorAll(".abc input");

const zakazaneRgx = /\.|\,|\-|\+|\-|\*|\/|\(|\)/;

abc_tlacitko.onclick = setup_abc;
setup_abc();
setupVstupyEventListenery();
// -------------------------------------------------------------------- kalkulačka obecné
const soustava_vyber = document.querySelector(".inpt_soustava");
const mode42_toggle = document.querySelector(".check_42");

let SOUSTAVA = soustava_vyber.value;
let MODE42 = mode42_toggle.value;
let kalkulacka = "nothing";

soustava_vyber.onchange = () => (SOUSTAVA = soustava_vyber.value);
mode42_toggle.onchange = () => (MODE42 = mode42_toggle.value);
const kalkulacka_obal = document.querySelector(".calculator_inside");
const kalkulacka_vyber = document.querySelector(".calc_mode_select");
kalkulacka_vyber.onchange = () => {
  kalkulacka = kalkulacka_vyber.value;
  renderCalc();
};

function renderCalc() {
  switch (kalkulacka) {
    case "nothing":
      kalkulacka_obal.innerHTML = "";
      break;
    case "random":
      renderRandomCalc();
      kalkulacka_obal.innerHTML = "náhodné";
      break;
    case "normal":
      renderNormalCalc();
      kalkulacka_obal.innerHTML = "normální";
      break;
    default:
      kalkulacka_obal.innerHTML = "";
      break;
  }
}
// --------------------------------------------------------------------- náhodná kalkulačka

function renderRandomCalc() {}

// --------------------------------------------------------------------- normální kalkulačka

function renderNormalCalc() {}
