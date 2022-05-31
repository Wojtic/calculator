const DESETINNAMISTA = 15;

function deset_do_n(cislo, soustava, abc) {
  const minus = cislo < 0;
  minus ? (cislo *= -1) : "";
  let vysledek = cislo == 0 ? abc[0] : "";
  let exp = Math.floor(Math.log(cislo) / Math.log(soustava));
  while (exp > -1 - (cislo % 1 != 0) * DESETINNAMISTA) {
    let koliksevejde = Math.floor(cislo / soustava ** exp);
    cislo = cislo - koliksevejde * soustava ** exp;
    vysledek += (exp == -1 ? "," : "") + abc[koliksevejde];
    exp--;
  }
  return (minus ? "-" : "") + (vysledek[0] == "," ? "0" : "") + vysledek;
}

function n_do_deset(cislo, soustava, abc) {
  const sign =
    cislo[0] == "-" ? (() => -1 * ((cislo = cislo.substring(1)) && 1))() : 1; // strašná hnusárna, ale jsem na to hrdý
  if (cislo.match(/\.|,/)) {
    var nejvetsiExponent = cislo.split(/,|\./)[0].length - 1; // Používám var místo let, abych proměnnou nemusel deklarovat na začátku
    cislo = cislo.replace(/\.|,/g, "");
  } else {
    var nejvetsiExponent = cislo.length - 1;
  }

  let vysledek = 0;
  for (let i = 0; i < cislo.length; i++) {
    vysledek += soustava ** (nejvetsiExponent - i) * abc.indexOf(cislo[i]);
  }
  return vysledek * sign;
}

function vyhodnot(vztah) {
  if (vztah.includes("(")) {
    const prvniZavorka = vztah.indexOf("(");
    let otevreneZavorky = 1;
    for (var i = prvniZavorka + 1; i < vztah.length; i++) {
      if (vztah[i] == "(") {
        otevreneZavorky++;
      } else if (vztah[i] == ")") {
        otevreneZavorky--;
      }
      if (otevreneZavorky == 0) {
        break;
      }
    }
    const zavorka = vyhodnot(vztah.slice(prvniZavorka + 1, i));
    vztah.splice(prvniZavorka, i - prvniZavorka + 1, zavorka);
    return vyhodnot(vztah);
  }
  while (vztah.includes("/")) {
    const deleno = vztah.indexOf("/");
    vztah[deleno] = "*";
    vztah[deleno + 1] = vztah[deleno + 1] ** -1;
  }
  while (vztah.includes("*")) {
    const krat = vztah.indexOf("*");
    vztah.splice(krat - 1, 3, vztah[krat - 1] * vztah[krat + 1]);
  }
  while (vztah.includes("-")) {
    const minus = vztah.indexOf("-");
    vztah[minus] = "+";
    vztah[minus + 1] *= -1;
  }
  return vztah.reduce((prev, curr) => (curr == "+" ? prev : prev + curr), 0);
}

function preved_priklad(priklad, abc, soustava) {
  let vysledek = [];
  let cislo = "";
  for (let i = 0; i < priklad.length; i++) {
    if (["+", "-", "*", "/", "(", ")"].includes(priklad[i])) {
      if (cislo) {
        vysledek.push(n_do_deset(cislo, soustava, abc));
        cislo = "";
      }
      vysledek.push(priklad[i]);
    } else {
      cislo += priklad[i];
    }
  }
  cislo ? vysledek.push(n_do_deset(cislo, soustava, abc)) : "";
  return vysledek;
}
