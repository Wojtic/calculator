function setup_abc() {
  ABECEDA = [];
  switch (abc_input.value) {
    case "inverted":
      for (let i = 0; i < 10; i++) {
        ABECEDA.push(i.toString());
      }
      for (let i = 65; i < 91; i++) {
        ABECEDA.push(String.fromCharCode(i));
      }
      for (let i = 97; i < 123; i++) {
        ABECEDA.push(String.fromCharCode(i));
      }
      ABECEDA = ABECEDA.slice(0, 60);
      break;
    case "random":
      znaky = "";
      for (let i = 33; i < 127; i++) {
        znaky += String.fromCharCode(i);
      }
      let zamichane = znaky
        .split("")
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join(""); // https://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
      ABECEDA = zamichane
        .split("")
        .filter((e) => !e.match(zakazaneRgx))
        .slice(0, 60);
      break;
    default:
      for (let i = 0; i < 10; i++) {
        ABECEDA.push(i.toString());
      }
      for (let i = 97; i < 123; i++) {
        ABECEDA.push(String.fromCharCode(i));
      }
      for (let i = 65; i < 91; i++) {
        ABECEDA.push(String.fromCharCode(i));
      }
      ABECEDA = ABECEDA.slice(0, 60);
  }
  vypln_abc(ABECEDA);
}

function vypln_abc(abc) {
  for (let i = 0; i < vstupy.length; i++) {
    vstupy[i].value = abc[i];
  }
}

function setupVstupyEventListenery() {
  vstupy.forEach((el) =>
    el.addEventListener("input", (event) => {
      let cislo = event.target.getAttribute("id").split("_")[1];
      if (event.target.value != "") {
        if (
          !ABECEDA.includes(event.target.value) &&
          !event.target.value.match(zakazaneRgx)
        ) {
          ABECEDA[cislo] = event.target.value;
        } else {
          event.target.value = "";
        }
      }
    })
  );
}
