function deset_do_n(cislo, soustava, abc) {}

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

console.log(n_do_deset("101.5", 2, ABECEDA));
