function deset_do_n(cislo, soustava, abc) {}

function n_do_deset(cislo, soustava, abc) {
  const sign =
    cislo[0] == "-" ? (() => -1 * ((cislo = cislo.substring(1)) && 1))() : 1; // strašná hnusárna, ale jsem na to hrdý
  if (cislo.includes(".") || cislo.includes(",")) {
    if (cislo.includes(".")) {
      var cisloSplit = cislo.split("."); // používám var místo let, abych nemusel proměnnou deklarovat na začátku funkce
    } else {
      var cisloSplit = cislo.split(",");
    }
    var nejvetsiExponent = cisloSplit[0].length - 1;
    cislo = cisloSplit[0] + cisloSplit[1];
  } else {
    var nejvetsiExponent = cislo.length - 1;
  }

  let vysledek = 0;
  for (let i = 0; i < cislo.length; i++) {
    vysledek += soustava ** (nejvetsiExponent - i) * abc.indexOf(cislo[i]);
  }
  return vysledek * sign;
}
