document.addEventListener("DOMContentLoaded", function () {

/* =========================================================
기본 설정
========================================================= */

var MAX_POKEMON = 1025;

/* =========================================================
Supabase 설정
========================================================= */

var SUPABASE_URL =
"https://lsdqvbijhxnfrzprcaxr.supabase.co";

var SUPABASE_KEY =
"여기에_네_Supabase_publishable_key";

/* =========================================================
Supabase 연결
========================================================= */

if (
typeof window.supabase === "undefined"
) {

```
console.error(
  "Supabase 라이브러리를 찾을 수 없습니다."
);

alert(
  "Supabase 라이브러리를 불러오지 못했습니다.\n\n" +
  "index.html의 Supabase CDN 연결을 확인해주세요."
);

return;
```

}

var supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

/* =========================================================
전역 데이터
========================================================= */

var trades = [];

var pokemonList = [];

var lookingPokemonList = [];

var offeringPokemonList = [];

function $(id) {
return document.getElementById(id);
}

/* =========================================================
다이맥스 포켓몬
========================================================= */

var dynamaxIds = new Set([

```
263,
819,
1,
4,
7,
374,
810,
813,
816,
870,
92,
529,
559,
582,
532,
98,
615,
66,
25,

144,
145,
146,
519,
554,
243,
113,
664,
307,
759,
781,
447,
448,
479,
355,
356,
477,
129,
130,
133,
134,
135,
136,
196,
197,
470,
471,
700,
249,
245,
244,
250,
891,
892,

126,
374,
129,
237
```

]);

/* =========================================================
거다이맥스 포켓몬
========================================================= */

var gigantamaxIds = new Set([

```
3,
6,
9,
12,
25,
52,
68,
94,
99,
131,
143,
569,
812,
815,
818,
849,
861
```

]);

/* =========================================================
형태 이름
========================================================= */

var formDefinitions = {

```
normal: {
  name: "일반"
},

shiny: {
  name: "✨ 이로치"
},

dynamax: {
  name: "🔵 다이맥스"
},

"shiny-dynamax": {
  name: "✨🔵 이로치 다이맥스"
},

gigantamax: {
  name: "👑 거다이맥스"
},

"shiny-gigantamax": {
  name: "✨👑 이로치 거다이맥스"
}
```

};

/* =========================================================
포켓몬 데이터 로딩
========================================================= */

function loadPokemonList() {

```
if (
  typeof pokemonData === "undefined" ||
  !Array.isArray(pokemonData)
) {

  console.error(
    "포켓몬 전국도감.js를 찾을 수 없습니다."
  );

  alert(
    "포켓몬 전국도감.js를 불러오지 못했습니다.\n\n" +
    "index.html에서 다음 순서인지 확인해주세요.\n\n" +
    '<script src="포켓몬 전국도감.js"></script>\n' +
    '<script src="app.js"></script>'
  );

  pokemonList = [];

  return;

}


pokemonList =
  pokemonData
    .filter(function (pokemon) {

      return (
        pokemon &&
        Number(pokemon.id) >= 1 &&
        Number(pokemon.id) <= MAX_POKEMON
      );

    })
    .map(function (pokemon) {

      return {

        id:
          Number(pokemon.id),

        name:
          pokemon.name ||
          "포켓몬 " + pokemon.id,

        koreanName:
          pokemon.name ||
          "포켓몬 " + pokemon.id

      };

    });


console.log(
  "오프라인 포켓몬 데이터 " +
  pokemonList.length +
  "종 로딩 완료"
);
```

}

/* =========================================================
포켓몬 이미지
========================================================= */

function pokemonImage(
id,
shiny
) {

```
if (shiny === true) {

  return (
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/" +
    "sprites/pokemon/shiny/" +
    id +
    ".png"
  );

}


return (
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/" +
  "sprites/pokemon/" +
  id +
  ".png"
);
```

}

/* =========================================================
사용 가능한 형태
========================================================= */

function getAvailableForms(pokemon) {

```
var id =
  Number(pokemon.id);

var forms = [
  "normal",
  "shiny"
];


if (dynamaxIds.has(id)) {

  forms.push("dynamax");

  forms.push("shiny-dynamax");

}


if (gigantamaxIds.has(id)) {

  forms.push("gigantamax");

  forms.push("shiny-gigantamax");

}


return forms;
```

}

/* =========================================================
포켓몬 검색
========================================================= */

function searchPokemon(query) {

```
var q =
  String(query)
    .trim()
    .toLowerCase();


if (!q) {

  return [];

}


return pokemonList
  .filter(function (pokemon) {

    var name =
      String(pokemon.name)
        .toLowerCase();

    var id =
      String(pokemon.id);


    return (
      name.indexOf(q) !== -1 ||
      id === q
    );

  })
  .slice(0, 8);
```

}

/* =========================================================
HTML 문자 처리
========================================================= */

function escapeHtml(text) {

```
return String(text)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
```

}

/* =========================================================
포켓몬 검색 결과
========================================================= */

function showPokemonChoices(
inputId,
choicesId
) {

```
var input =
  $(inputId);

var choices =
  $(choicesId);


if (!input || !choices) {

  return;

}


var results =
  searchPokemon(input.value);


if (!results.length) {

  choices.innerHTML = "";

  return;

}


var html = "";


results.forEach(function (pokemon) {

  html +=
    '<div class="pokemonSearchResult" ' +
    'data-pokemon-id="' +
    pokemon.id +
    '">' +

    '<img src="' +
    pokemonImage(pokemon.id, false) +
    '" alt="' +
    escapeHtml(pokemon.name) +
    '">' +

    '<div>' +

    '<strong>' +
    escapeHtml(pokemon.name) +
    '</strong>' +

    '<small>' +
    "No." +
    String(pokemon.id).padStart(4, "0") +
    '</small>' +

    '</div>' +

    '</div>';

});


choices.innerHTML =
  html;


choices
  .querySelectorAll(
    ".pokemonSearchResult"
  )
  .forEach(function (result) {

    result.addEventListener(
      "click",
      function () {

        var id =
          Number(
            result.dataset.pokemonId
          );


        var pokemon =
          pokemonList.find(
            function (p) {
              return p.id === id;
            }
          );


        if (!pokemon) {

          return;

        }


        showFormChoices(
          pokemon,
          inputId,
          choicesId
        );

      }
    );

  });
```

}

/* =========================================================
형태 선택
========================================================= */

function showFormChoices(
pokemon,
inputId,
choicesId
) {

```
var choices =
  $(choicesId);


if (!choices) {

  return;

}


var forms =
  getAvailableForms(pokemon);


var html = "";


html +=
  '<div class="pokemonFormHeader">' +

  '<strong>' +
  escapeHtml(pokemon.name) +
  '</strong>' +

  '<span>' +
  "No." +
  String(pokemon.id).padStart(4, "0") +
  '</span>' +

  '</div>';


html +=
  '<div class="pokemonFormGrid">';


forms.forEach(function (form) {

  var definition =
    formDefinitions[form];


  var shiny =
    form === "shiny" ||
    form === "shiny-dynamax" ||
    form === "shiny-gigantamax";


  html +=
    '<div class="pokemonFormChoice" ' +
    'data-pokemon-id="' +
    pokemon.id +
    '" ' +
    'data-form="' +
    form +
    '">' +

    '<div class="pokemonFormImage">' +

    '<img src="' +
    pokemonImage(
      pokemon.id,
      shiny
    ) +
    '" alt="' +
    escapeHtml(pokemon.name) +
    '">' +

    '</div>' +

    '<div class="pokemonFormName">' +
    escapeHtml(definition.name) +
    '</div>' +

    '</div>';

});


html +=
  '</div>';


choices.innerHTML =
  html;


choices
  .querySelectorAll(
    ".pokemonFormChoice"
  )
  .forEach(function (card) {

    card.addEventListener(
      "click",
      function () {

        var id =
          Number(
            card.dataset.pokemonId
          );


        var form =
          card.dataset.form;


        var selected =
          pokemonList.find(
            function (p) {
              return p.id === id;
            }
          );


        if (!selected) {

          return;

        }


        var item = {

          id:
            selected.id,

          name:
            selected.name,

          condition:
            form

        };


        if (
          inputId ===
          "lookingSearch"
        ) {

          lookingPokemonList.push(
            item
          );


          renderSelectedPokemon(
            lookingPokemonList,
            "lookingList"
          );

        }


        if (
          inputId ===
          "offeringSearch"
        ) {

          offeringPokemonList.push(
            item
          );


          renderSelectedPokemon(
            offeringPokemonList,
            "offeringList"
          );

        }


        $(inputId).value =
          "";


        choices.innerHTML =
          "";

      }
    );

  });
```

}

/* =========================================================
선택한 포켓몬 표시
========================================================= */

function renderSelectedPokemon(
list,
containerId
) {

```
var container =
  $(containerId);


if (!container) {

  return;

}


var html = "";


list.forEach(function (pokemon, index) {

  var form =
    pokemon.condition ||
    "normal";


  var definition =
    formDefinitions[form] ||
    formDefinitions.normal;


  var shiny =
    form === "shiny" ||
    form === "shiny-dynamax" ||
    form === "shiny-gigantamax";


  html +=
    '<div class="selectedPokemon">' +

    '<img src="' +
    pokemonImage(
      pokemon.id,
      shiny
    ) +
    '" alt="' +
    escapeHtml(pokemon.name) +
    '">' +

    '<div class="selectedPokemonInfo">' +

    '<strong>' +
    escapeHtml(pokemon.name) +
    '</strong>' +

    '<span>' +
    escapeHtml(definition.name) +
    '</span>' +

    '</div>' +

    '<button type="button" ' +
    'class="removePokemon" ' +
    'data-index="' +
    index +
    '">' +
    "×" +
    '</button>' +

    '</div>';

});


container.innerHTML =
  html;


container
  .querySelectorAll(
    ".removePokemon"
  )
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        var index =
          Number(
            button.dataset.index
          );


        list.splice(
          index,
          1
        );


        renderSelectedPokemon(
          list,
          containerId
        );

      }
    );

  });
```

}

/* =========================================================
기존 포켓몬 데이터 호환
========================================================= */

function normalizePokemon(pokemon) {

```
if (
  typeof pokemon === "object" &&
  pokemon !== null
) {

  return {

    id:
      Number(pokemon.id) || 0,

    name:
      pokemon.name ||
      "알 수 없음",

    condition:
      pokemon.condition ||
      "normal"

  };

}


var found =
  pokemonList.find(
    function (p) {
      return p.name === pokemon;
    }
  );


return {

  id:
    found
      ? found.id
      : 0,

  name:
    pokemon,

  condition:
    "normal"

};
```

}

/* =========================================================
포켓몬 칩
========================================================= */

function pokemonChip(pokemon) {

```
var p =
  normalizePokemon(pokemon);


var definition =
  formDefinitions[p.condition] ||
  formDefinitions.normal;


var shiny =
  p.condition === "shiny" ||
  p.condition === "shiny-dynamax" ||
  p.condition === "shiny-gigantamax";


var html =
  '<span class="chip pokemonChip">';


if (p.id) {

  html +=
    '<img src="' +
    pokemonImage(
      p.id,
      shiny
    ) +
    '" alt="' +
    escapeHtml(p.name) +
    '">';

}


html +=
  '<span>' +
  escapeHtml(p.name) +
  '</span>';


html +=
  '<span class="conditionBadge">' +
  escapeHtml(definition.name) +
  '</span>';


html +=
  '</span>';


return html;
```

}

function chips(array) {

```
if (
  !array ||
  !array.length
) {

  return (
    '<span class="chip">' +
    "없음" +
    '</span>'
  );

}


var html = "";


array.forEach(function (pokemon) {

  html +=
    pokemonChip(pokemon);

});


return html;
```

}

/* =========================================================
Supabase 교환 목록 불러오기
========================================================= */

async function loadTrades() {

```
console.log(
  "Supabase에서 교환 목록을 불러오는 중..."
);


var result =
  await supabaseClient
    .from("trades")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false
      }
    );


var data =
  result.data;

var error =
  result.error;


if (error) {

  console.error(
    "교환 목록 불러오기 실패:",
    error
  );


  alert(
    "교환 목록을 불러오지 못했습니다.\n\n" +
    error.message
  );


  trades = [];

  render();

  return;

}


trades =
  Array.isArray(data)
    ? data
    : [];


console.log(
  "Supabase 교환 목록 " +
  trades.length +
  "개 로딩 완료"
);


render();
```

}

/* =========================================================
교환 목록 렌더링
========================================================= */

function render() {

```
var search =
  $("search");

var mode =
  $("mode");

var cards =
  $("cards");

var count =
  $("count");


if (
  !search ||
  !mode ||
  !cards
) {

  return;

}


var q =
  search.value
    .trim()
    .toLowerCase();


var selectedMode =
  mode.value;


var list =
  trades.filter(
    function (trade) {

      var looking =
        (
          trade.looking ||
          []
        ).map(
          normalizePokemon
        );


      var offering =
        (
          trade.offering ||
          []
        ).map(
          normalizePokemon
        );


      var lookingText =
        looking
          .map(function (p) {
            return p.name;
          })
          .join(" ")
          .toLowerCase();


      var offeringText =
        offering
          .map(function (p) {
            return p.name;
          })
          .join(" ")
          .toLowerCase();


      if (!q) {

        return true;

      }


      if (
        selectedMode ===
        "looking"
      ) {

        return (
          lookingText.indexOf(q) !== -1
        );

      }


      if (
        selectedMode ===
        "offering"
      ) {

        return (
          offeringText.indexOf(q) !== -1
        );

      }


      return (
        lookingText.indexOf(q) !== -1 ||
        offeringText.indexOf(q) !== -1
      );

    }
  );


if (count) {

  count.textContent =
    list.length
      ? list.length + "명"
      : "";

}


if (!list.length) {

  var emptyHtml = "";


  emptyHtml +=
    '<div class="empty">';


  emptyHtml +=
    '<strong>';


  emptyHtml +=
    trades.length
      ? "조건에 맞는 교환 목록이 없습니다."
      : "아직 등록된 교환 목록이 없습니다.";


  emptyHtml +=
    '</strong>';


  emptyHtml +=
    '<span>';


  emptyHtml +=
    trades.length
      ? "검색 조건을 바꿔보세요."
      : "첫 번째 교환 목록을 등록해 보세요.";


  emptyHtml +=
    '</span>';


  if (!trades.length) {

    emptyHtml +=
      '<br>' +
      '<button id="emptyRegister">' +
      "교환 목록 등록하기" +
      '</button>';

  }


  emptyHtml +=
    '</div>';


  cards.innerHTML =
    emptyHtml;


  var emptyButton =
    $("emptyRegister");


  if (emptyButton) {

    emptyButton.onclick =
      openModal;

  }


  return;

}


var html =
  '<div class="grid">';


list.forEach(function (trade) {

  var index =
    trades.indexOf(trade);


  var looking =
    (
      trade.looking ||
      []
    ).map(
      normalizePokemon
    );


  var offering =
    (
      trade.offering ||
      []
    ).map(
      normalizePokemon
    );


  html +=
    '<article class="card">';


  html +=
    '<div class="top">' +
    '<span class="name">' +
    escapeHtml(
      trade.username ||
      "이름 없음"
    ) +
    '</span>' +
    '</div>';


  html +=
    '<div class="label">' +
    "찾는 포켓몬 · " +
    looking.length +
    '</div>';


  html +=
    '<div class="chips">' +
    chips(looking) +
    '</div>';


  html +=
    '<div class="label">' +
    "제공 포켓몬 · " +
    offering.length +
    '</div>';


  html +=
    '<div class="chips">' +
    chips(offering) +
    '</div>';


  html +=
    '<div class="cardButtons">';


  html +=
    '<button class="request" ' +
    'data-index="' +
    index +
    '">' +
    "교환 신청" +
    '</button>';


  html +=
    '<button class="deleteTrade" ' +
    'data-index="' +
    index +
    '">' +
    "삭제" +
    '</button>';


  html +=
    '</div>';


  html +=
    '</article>';

});


html +=
  '</div>';


cards.innerHTML =
  html;


document
  .querySelectorAll(
    ".request"
  )
  .forEach(function (button) {

    button.onclick =
      function () {

        var index =
          Number(
            button.dataset.index
          );


        if (!trades[index]) {

          return;

        }


        requestTrade(
          trades[index].username
        );

      };

  });


document
  .querySelectorAll(
    ".deleteTrade"
  )
  .forEach(function (button) {

    button.onclick =
      function () {

        var index =
          Number(
            button.dataset.index
          );


        deleteTrade(
          index
        );

      };

  });
```

}

/* =========================================================
교환 신청
========================================================= */

function requestTrade(name) {

```
alert(
  String(name || "트레이너") +
  "님에게 교환 신청을 보내는 기능입니다.\n\n" +
  "현재는 테스트 버전이라 실제 전송은 아직 연결되지 않았습니다."
);
```

}

/* =========================================================
교환 목록 삭제
========================================================= */

async function deleteTrade(index) {

```
var trade =
  trades[index];


if (!trade) {

  return;

}


var confirmed =
  confirm(
    '"' +
    String(
      trade.username ||
      "이름 없음"
    ) +
    '"님의 교환 목록을 삭제하시겠습니까?\n\n' +
    "삭제하면 다시 복구할 수 없습니다."
  );


if (!confirmed) {

  return;

}


if (!trade.id) {

  alert(
    "이 교환 목록에는 삭제할 ID가 없습니다."
  );

  return;

}


var result =
  await supabaseClient
    .from("trades")
    .delete()
    .eq(
      "id",
      trade.id
    );


var error =
  result.error;


if (error) {

  console.error(
    "교환 목록 삭제 실패:",
    error
  );


  alert(
    "교환 목록을 삭제하지 못했습니다.\n\n" +
    error.message
  );

  return;

}


trades.splice(
  index,
  1
);


render();


alert(
  "교환 목록이 삭제되었습니다."
);
```

}

/* =========================================================
모달
========================================================= */

function openModal() {

```
var modal =
  $("modal");


if (modal) {

  modal.classList.remove(
    "hidden"
  );

}
```

}

function closeModal() {

```
var modal =
  $("modal");


if (modal) {

  modal.classList.add(
    "hidden"
  );

}
```

}

/* =========================================================
버튼 연결
========================================================= */

if ($("heroBtn")) {

```
$("heroBtn").onclick =
  openModal;
```

}

if ($("myListBtn")) {

```
$("myListBtn").onclick =
  openModal;
```

}

if ($("close")) {

```
$("close").onclick =
  closeModal;
```

}

if ($("modal")) {

```
$("modal").onclick =
  function (event) {

    if (
      event.target ===
      $("modal")
    ) {

      closeModal();

    }

  };
```

}

/* =========================================================
찾는 포켓몬 검색
========================================================= */

if ($("lookingSearch")) {

```
$("lookingSearch")
  .addEventListener(
    "input",
    function () {

      showPokemonChoices(
        "lookingSearch",
        "lookingChoices"
      );

    }
  );
```

}

/* =========================================================
제공 포켓몬 검색
========================================================= */

if ($("offeringSearch")) {

```
$("offeringSearch")
  .addEventListener(
    "input",
    function () {

      showPokemonChoices(
        "offeringSearch",
        "offeringChoices"
      );

    }
  );
```

}

/* =========================================================
등록
========================================================= */

if ($("save")) {

```
$("save").onclick =
  async function () {

    var nameInput =
      $("name");


    var name =
      nameInput
        ? nameInput.value.trim()
        : "";


    if (!name) {

      alert(
        "트레이너 이름을 입력해주세요."
      );

      return;

    }


    if (
      !lookingPokemonList.length &&
      !offeringPokemonList.length
    ) {

      alert(
        "찾는 포켓몬 또는 제공 포켓몬을 하나 이상 선택해주세요."
      );

      return;

    }


    /*
     * Supabase trades 테이블 구조:
     *
     * id
     * user_id
     * username
     * offering
     * looking
     * created_at
     *
     * user_id는 현재 로그인 기능이 없으므로
     * null로 저장합니다.
     */


    var newTrade = {

      user_id:
        null,

      username:
        name,

      offering:
        offeringPokemonList.slice(),

      looking:
        lookingPokemonList.slice()

    };


    console.log(
      "Supabase에 교환 목록 저장:",
      newTrade
    );


    var result =
      await supabaseClient
        .from("trades")
        .insert(
          newTrade
        )
        .select()
        .single();


    var data =
      result.data;

    var error =
      result.error;


    if (error) {

      console.error(
        "교환 목록 등록 실패:",
        error
      );


      alert(
        "교환 목록을 등록하지 못했습니다.\n\n" +
        error.message
      );

      return;

    }


    console.log(
      "교환 목록 등록 완료:",
      data
    );


    if (data) {

      trades.unshift(
        data
      );

    }


    if ($("name")) {

      $("name").value =
        "";

    }


    if ($("lookingSearch")) {

      $("lookingSearch").value =
        "";

    }


    if ($("offeringSearch")) {

      $("offeringSearch").value =
        "";

    }


    lookingPokemonList = [];

    offeringPokemonList = [];


    if ($("lookingChoices")) {

      $("lookingChoices").innerHTML =
        "";

    }


    if ($("offeringChoices")) {

      $("offeringChoices").innerHTML =
        "";

    }


    renderSelectedPokemon(
      lookingPokemonList,
      "lookingList"
    );


    renderSelectedPokemon(
      offeringPokemonList,
      "offeringList"
    );


    closeModal();

    render();


    alert(
      "교환 목록이 등록되었습니다."
    );

  };
```

}

/* =========================================================
메인 검색
========================================================= */

if ($("search")) {

```
$("search")
  .addEventListener(
    "input",
    render
  );
```

}

if ($("mode")) {

```
$("mode")
  .addEventListener(
    "change",
    render
  );
```

}

/* =========================================================
검색 초기화
========================================================= */

if ($("reset")) {

```
$("reset").onclick =
  function () {

    if ($("search")) {

      $("search").value =
        "";

    }


    if ($("mode")) {

      $("mode").value =
        "all";

    }


    render();

  };
```

}

/* =========================================================
시작
========================================================= */

loadPokemonList();

loadTrades();

console.log(
"===================================="
);

console.log(
"Pokémon GO 교환 목록 시작"
);

console.log(
"Supabase 모드"
);

console.log(
"===================================="
);

});
