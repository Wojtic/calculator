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
let lastSOUSTAVA = 0; // pro animace
let lastABECEDA = []; // pro přepisování příkladu při změně abecedy
const CISLOMAXHODNOTA = 10000;
const MAXLENGTH = 11; // maximální počet znaků na "obrazovce" normální kalkulačky, počítáno v šířkách znaku 2
let scroll = 0; // O kolik posunout příklad v normální klakulačce
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
      kalkulacka_obal.innerHTML = `<div class="nocalc">Vyberte si nějakou kalkulačku.</div>`;
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
        (nasobek42 < 0
          ? `(${deset_do_n(nasobek42, SOUSTAVA, ABECEDA)})`
          : deset_do_n(nasobek42, SOUSTAVA, ABECEDA)) +
        (vysledek % 42 >= 0 ? "+" : "") +
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
  // ---------------------------------------------------------------------------- html setup
  let cisla = "";
  for (let i = 0; i < Math.max(lastSOUSTAVA, SOUSTAVA); i++) {
    cisla += `<button class="cislo ${
      lastSOUSTAVA < SOUSTAVA
        ? i + 1 > lastSOUSTAVA
          ? "animate__animated animate__bounceInDown"
          : ""
        : i + 1 > SOUSTAVA
        ? "animate__animated animate__bounceOutDown"
        : ""
    }" id="cislo${i}">${ABECEDA[i]}</button>`;
  } // Dříve byl tento kód čitelný, teď má animace
  lastSOUSTAVA = SOUSTAVA;
  kalkulacka_obal.innerHTML = `<div class="calculator_normal"> <div class="screen_obal"><p class="screen"></p></div> <div class="znamenka_vodorovne"> <button class="znamenko_plus">+</button> <button class="znamenko_minus">-</button> <button class="znamenko_krat">*</button> <button class="znamenko_deleno">/</button> </div> <div class="znamenka_svisle"> <button class="znamenko_C">C</button><button class="znamenko_Del">Del</button><button class="znamenko_zavorka_leva">(</button> <button class="znamenko_zavorka_prava">)</button> <button class="znamenko_carka">,</button><button class="znamenko_rovnase">=</button> </div> <div class="cisla">${cisla}</div> </div>`;

  // ------------------------------------------------------------------------------- utils

  const priklad_screen = document.querySelector(".screen");

  const set_screen = (text) => {
    const kolik_uzkych_znaku = (text.match(/1|l|\+|\-|\*|\.|\,|\(|\)/g) || [])
      .length; // 1,l,(,),+,-,*,,,.
    if (text.length <= MAXLENGTH + kolik_uzkych_znaku / 2) {
      priklad_screen.innerHTML = text;
      scroll = 0;
      return;
    }
    if (scroll > 0) {
      priklad_screen.innerHTML =
        `<span class="scroll" href="">←</span>` +
        text.slice(scroll, MAXLENGTH + kolik_uzkych_znaku / 2 + scroll) +
        (text.length > MAXLENGTH + kolik_uzkych_znaku / 2 + scroll
          ? `<span class="scroll" href="">→</span>`
          : "");
    } else {
      priklad_screen.innerHTML =
        text.slice(0, MAXLENGTH + kolik_uzkych_znaku / 2) +
        `<span class="scroll" href="">→</span>`;
    }

    document.querySelectorAll(".scroll").forEach(
      (elem) =>
        (elem.onclick = (e) => {
          e.preventDefault(); // Aby odkaz nikam nešel
          scroll += e.target.innerHTML == "←" ? -1 : 1;
          renderCalc();
        })
    );
  };
  set_screen(priklad);

  const remove_equals = () => {
    if (priklad.includes("=")) priklad = priklad.slice(0, priklad.indexOf("="));
  };

  document.querySelectorAll(".cislo").forEach((el) => {
    el.addEventListener("click", (event) => {
      remove_equals();
      priklad += ABECEDA[event.target.id.slice(5)];
      set_screen(priklad);
    });
  });

  const change_equation_with_anim = (zmena) => {
    set_screen(zmena);
    priklad_screen.classList.add("animate__animated", "animate__tada");
    priklad_screen.addEventListener("animationend", () => {
      priklad_screen.classList.remove("animate__animated", "animate__tada");
    });
  };

  if (lastABECEDA.length == ABECEDA.length && lastABECEDA != ABECEDA) {
    // Přepsat příklad, pokud se změnila abeceda
    for (let i = 0; i < priklad.length; i++) {
      if ("+-*/.,()=".includes(priklad[i])) continue;
      if (lastABECEDA.indexOf(priklad[i]) != ABECEDA.indexOf(priklad[i])) {
        // Došlo ke změně
        priklad =
          priklad.substring(0, i) +
          ABECEDA[lastABECEDA.indexOf(priklad[i])] +
          priklad.substring(i + 1);
      }
    }
    set_screen(priklad);
  }
  lastABECEDA = ABECEDA.slice(0); // Nemůžu napsat pouze = protože se objekt nezkopíruje ale jenom se na něj uloží "reference"

  if (priklad.includes("=")) change_equation_with_anim(evaluateExpression()); // přepočítá při např. změně soustavy

  // -------------------------------------------------------------------------------- buttons
  const zmen_priklad = (znak) => {
    // logika pro nahrazování znamének (např. na začátku nesmí být +*/),.
    remove_equals();
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
    set_screen(priklad);
  };
  const zmackl_zavorka = (zavorka) => {
    remove_equals();
    priklad += zavorka;
    set_screen(priklad);
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
    change_equation_with_anim(evaluateExpression());
  document.querySelector(".znamenko_C").onclick = () => {
    priklad = "";
    set_screen(priklad);
  };
  document.querySelector(".znamenko_Del").onclick = () => {
    remove_equals();
    priklad = priklad.slice(0, -1);
    set_screen(priklad);
  };
  const zmackl_carka = () => {
    remove_equals();
    if (priklad.length > 0 && !"+-*/.,".includes(priklad[priklad.length - 1]))
      priklad += ",";
    else if (priklad.length > 0) priklad = priklad.slice(0, -1) + ",";
    set_screen(priklad);
  };
  document.querySelector(".znamenko_carka").onclick = zmackl_carka;

  // ------------------------------------------------------------------------ klávesnice
  document.addEventListener("keydown", (event) => {
    if (kalkulacka != "normal" || event.target.tagName.toLowerCase() == "input")
      return;

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
        change_equation_with_anim(evaluateExpression());
        break;
      case "Comma":
      case "Period":
      case "NumpadDecimal":
        zmackl_carka();
        break;
      case "Escape":
      case "Delete":
        priklad = "";
        set_screen(priklad);
      case "Backspace":
        remove_equals();
        priklad = priklad.slice(0, -1);
        set_screen(priklad);
      default:
        if ("0123456789".includes(event.code[6])) {
          if (event.code[6] > SOUSTAVA - 1) break;
          remove_equals();
          priklad += ABECEDA[event.code[6]];
          set_screen(priklad);
        }
        break;
    }
  });
}
