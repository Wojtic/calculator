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
let soustava = 2;

// --------------------------------------------------------------------- náhodná kalkulačka
