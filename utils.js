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
  return (minus ? "-" : "") + vysledek;
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
