const DESETINNAMISTA = 5;

function deset_do_n(cislo, soustava, abc) {
  if (cislo != 0) {
    var vysledek = "";
    var exp = Math.floor(Math.log(cislo) / Math.log(soustava));
    while (exp != -1) {
      var koliksevejde = Math.floor(cislo / soustava ** exp);
      cislo = cislo - koliksevejde * soustava ** exp;
      vysledek += abc[koliksevejde];
      exp--;
    }
    if (cislo != 0) {
      vysledek += ",";
      for (let i = 0; i < DESETINNAMISTA; i++) {
        exp = -(i + 1);
        var koliksevejde = Math.floor(cislo / soustava ** exp);
        cislo = cislo - koliksevejde * soustava ** exp;
        vysledek += abc[koliksevejde];
      }
    }
    return vysledek;
  } else {
    return abc[0];
  }
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
