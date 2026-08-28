document.addEventListener("DOMContentLoaded", function () {

  var MAX_POKEMON = 1025;

  var SUPABASE_URL =
    "https://lsdqvbijhxnfrzprcaxr.supabase.co";

  var SUPABASE_KEY =
    "sb_publishable_6V08H2LunPBhmIqQjCtHVg_RCqIkuHR";

  var trades = [];
  var pokemonList = [];
  var lookingPokemonList = [];
  var offeringPokemonList = [];

  function $(id) {
    return document.getElementById(id);
  }


  /* =========================================================
     Supabase 연결
  ========================================================= */

  if (
    typeof window.supabase === "undefined" ||
    typeof window.supabase.createClient !== "function"
  ) {
    console.error("Supabase 라이브러리를 찾을 수 없습니다.");

    alert(
      "Supabase 라이브러리를 불러오지 못했습니다.\n\n" +
      "index.html의 Supabase CDN 연결을 확인해주세요."
    );

    return;
  }

  var supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );


  /* =========================================================
     다이맥스
  ========================================================= */

  var dynamaxIds = new Set([
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
  ]);


  /* =========================================================
     거다이맥스
  ========================================================= */

  var gigantamaxIds = new Set([
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
  ]);


  /* =========================================================
     형태 이름
  ========================================================= */

  var formDefinitions = {

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

  };


  /* =========================================================
     포켓몬 데이터
  ========================================================= */

  function loadPokemonList() {

    if (
      typeof pokemonData === "undefined" ||
      !Array.isArray(pokemonData)
    ) {

      console.error(
        "포켓몬 전국도감.js를 찾을 수 없습니다."
      );

      alert(
        "포켓몬 전국도감.js를 불러오지 못했습니다.\n\n" +
        "index.html에서\n\n" +
        "<script src=\"포켓몬 전국도감.js\"></script>\n" +
        "<script src=\"app.js\"></script>\n\n" +
        "순서로 연결되어 있는지 확인해주세요."
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

            id: Number(pokemon.id),

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
  }


  /* =========================================================
     포켓몬 이미지
  ========================================================= */

  function pokemonImage(id, shiny) {

    if (shiny) {

      return (
        "https://raw.githubusercontent.com/" +
        "PokeAPI/sprites/master/sprites/pokemon/" +
        "shiny/" +
        id +
        ".png"
      );

    }

    return (
      "https://raw.githubusercontent.com/" +
      "PokeAPI/sprites/master/sprites/pokemon/" +
      id +
      ".png"
    );
  }


  /* =========================================================
     HTML 문자 처리
  ========================================================= */

  function escapeHtml(text) {

    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================================================
     사용 가능한 형태
  ========================================================= */

  function getAvailableForms(pokemon) {

    var id = Number(pokemon.id);

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
  }


  /* =========================================================
     포켓몬 검색
  ========================================================= */

  function searchPokemon(query) {

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
          String(pokemon.name).toLowerCase();

        var id =
          String(pokemon.id);

        return (
          name.indexOf(q) !== -1 ||
          id === q
        );

      })
      .slice(0, 8);
  }


  /* =========================================================
     포켓몬 검색 결과
  ========================================================= */

  function showPokemonChoices(inputId, choicesId) {

    var input = $(inputId);
    var choices = $(choicesId);

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

    choices.innerHTML = html;


    choices
      .querySelectorAll(".pokemonSearchResult")
      .forEach(function (result) {

        result.addEventListener(
          "click",
          function () {

            var id =
              Number(
                result.dataset.pokemonId
              );

            var pokemon =
              pokemonList.find(function (p) {
                return p.id === id;
              });

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

  }


  /* =========================================================
     형태 선택
  ========================================================= */

  function showFormChoices(
    pokemon,
    inputId,
    choicesId
  ) {

    var choices = $(choicesId);

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
        definition.name +
        '</div>' +

        '</div>';

    });


    html += "</div>";

    choices.innerHTML = html;


    choices
      .querySelectorAll(".pokemonFormChoice")
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
              pokemonList.find(function (p) {
                return p.id === id;
              });

            if (!selected) {
              return;
            }

            var item = {

              id: selected.id,

              name: selected.name,

              condition: form

            };


            if (
              inputId ===
              "lookingSearch"
            ) {

              lookingPokemonList.push(item);

              renderSelectedPokemon(
                lookingPokemonList,
                "lookingList"
              );

            }


            if (
              inputId ===
              "offeringSearch"
            ) {

              offeringPokemonList.push(item);

              renderSelectedPokemon(
                offeringPokemonList,
                "offeringList"
              );

            }


            $(inputId).value = "";

            choices.innerHTML = "";

          }
        );

      });

  }


  /* =========================================================
     선택된 포켓몬
  ========================================================= */

  function renderSelectedPokemon(
    list,
    containerId
  ) {

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
        definition.name +
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

    container.innerHTML = html;


    container
      .querySelectorAll(".removePokemon")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            var index =
              Number(
                button.dataset.index
              );

            list.splice(index, 1);

            renderSelectedPokemon(
              list,
              containerId
            );

          }
        );

      });

  }


  /* =========================================================
     포켓몬 데이터 정리
  ========================================================= */

  function normalizePokemon(pokemon) {

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
      pokemonList.find(function (p) {

        return p.name === pokemon;

      });


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

  }


  /* =========================================================
     JSON 배열 처리
  ========================================================= */

  function normalizePokemonArray(value) {

    if (Array.isArray(value)) {
      return value.map(normalizePokemon);
    }

    if (typeof value === "string") {

      try {

        var parsed =
          JSON.parse(value);

        if (Array.isArray(parsed)) {

          return parsed.map(
            normalizePokemon
          );

        }

      } catch (error) {

        console.warn(
          "포켓몬 JSON 변환 실패:",
          error
        );

      }

    }

    return [];

  }


  /* =========================================================
     포켓몬 칩
  ========================================================= */

  function pokemonChip(pokemon) {

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
      '</span>' +

      '<span class="conditionBadge">' +
      definition.name +
      '</span>' +

      '</span>';


    return html;

  }


  function chips(array) {

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

      html += pokemonChip(pokemon);

    });

    return html;
  }


  /* =========================================================
     Supabase 교환 목록 불러오기
  ========================================================= */

  async function loadTrades() {

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


    if (result.error) {

      console.error(
        "교환 목록 불러오기 실패:",
        result.error
      );

      alert(
        "교환 목록을 불러오지 못했습니다.\n\n" +
        result.error.message
      );

      trades = [];

      render();

      return;
    }


    trades =
      Array.isArray(result.data)
        ? result.data
        : [];


    console.log(
      "Supabase 교환 목록 " +
      trades.length +
      "개 로딩 완료"
    );


    render();

  }


  /* =========================================================
     교환 목록 렌더링
  ========================================================= */

  function render() {

    var search = $("search");
    var mode = $("mode");
    var cards = $("cards");
    var count = $("count");


    if (!search || !mode || !cards) {
      return;
    }


    var q =
      search.value
        .trim()
        .toLowerCase();

    var selectedMode =
      mode.value;


    var list =
      trades.filter(function (trade) {

        var looking =
          normalizePokemonArray(
            trade.looking
          );

        var offering =
          normalizePokemonArray(
            trade.offering
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

          return lookingText.indexOf(q) !== -1;

        }


        if (
          selectedMode ===
          "offering"
        ) {

          return offeringText.indexOf(q) !== -1;

        }


        return (
          lookingText.indexOf(q) !== -1 ||
          offeringText.indexOf(q) !== -1
        );

      });


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


    var gridHtml =
      '<div class="grid">';


    list.forEach(function (trade) {

      var index =
        trades.indexOf(trade);

      var looking =
        normalizePokemonArray(
          trade.looking
        );

      var offering =
        normalizePokemonArray(
          trade.offering
        );


      var trainerName =
        trade.username ||
        trade.name ||
        "이름 없음";


      gridHtml +=
        '<article class="card">' +

        '<div class="top">' +

        '<span class="name">' +
        escapeHtml(trainerName) +
        '</span>' +

        '</div>' +

        '<div class="label">' +
        "찾는 포켓몬 · " +
        looking.length +
        '</div>' +

        '<div class="chips">' +
        chips(looking) +
        '</div>' +

        '<div class="label">' +
        "제공 포켓몬 · " +
        offering.length +
        '</div>' +

        '<div class="chips">' +
        chips(offering) +
        '</div>' +

        '<div class="cardButtons">' +

        '<button class="request" ' +
        'data-index="' +
        index +
        '">' +
        "교환 신청" +
        '</button>' +

        '<button class="deleteTrade" ' +
        'data-index="' +
        index +
        '">' +
        "삭제" +
        '</button>' +

        '</div>' +

        '</article>';

    });


    gridHtml +=
      '</div>';


    cards.innerHTML =
      gridHtml;


    document
      .querySelectorAll(".request")
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
              trades[index]
            );

          };

      });


    document
      .querySelectorAll(".deleteTrade")
      .forEach(function (button) {

        button.onclick =
          function () {

            var index =
              Number(
                button.dataset.index
              );

            deleteTrade(index);

          };

      });

  }


  /* =========================================================
     교환 신청
  ========================================================= */

async function requestTrade(trade) {

  var name =
    trade.username ||
    trade.name ||
    "트레이너";

  var buyerId =
    localStorage.getItem("pogo_user_id");

  var sellerId =
    trade.user_id;

  if (!buyerId) {

    alert(
      "사용자 인증 정보를 찾을 수 없습니다."
    );

    return;
  }

  if (!sellerId) {

    alert(
      "이 교환 목록에는 게시자 정보가 없습니다."
    );

    return;
  }

  if (buyerId === sellerId) {

    alert(
      "자신의 교환 목록에는 교환 신청을 할 수 없습니다."
    );

    return;
  }

  if (!trade.id) {

    alert(
      "이 교환 목록의 ID를 찾을 수 없습니다."
    );

    return;
  }

  var result =
    await supabaseClient
      .from("chat_rooms")
      .insert({
        trade_id: trade.id,
        seller_id: sellerId,
        buyer_id: buyerId
      })
      .select()
      .single();

  if (result.error) {

    console.error(
      "채팅방 생성 실패:",
      result.error
    );

    alert(
      "채팅방을 만들지 못했습니다.\n\n" +
      result.error.message
    );

    return;
  }

  alert(
    name +
    "님에게 교환 신청을 보냈습니다.\n\n" +
    "채팅방이 생성되었습니다."
  );
  openChat(
  result.data.id,
  name
);

  console.log(
    "채팅방 생성 성공:",
    result.data
  );

}


  /* =========================================================
     삭제
  ========================================================= */

  async function deleteTrade(index) {

    var trade =
      trades[index];


    if (!trade) {
      return;
    }


    var name =
      trade.username ||
      trade.name ||
      "이름 없음";


    var confirmed =
      confirm(
        '"' +
        name +
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
        .eq("id", trade.id)
        .select();


    if (result.error) {

      console.error(
        "교환 목록 삭제 실패:",
        result.error
      );

      alert(
        "교환 목록을 삭제하지 못했습니다.\n\n" +
        result.error.message
      );

      return;
    }

    if (
  !result.data ||
  result.data.length === 0
) {

  alert(
    "이 교환 목록을 삭제할 권한이 없습니다."
  );

  return;
}

    trades.splice(index, 1);

    render();


    alert(
      "교환 목록이 삭제되었습니다."
    );

  }


  /* =========================================================
     모달
  ========================================================= */

  function openModal() {

    var modal =
      $("modal");

    if (modal) {

      modal.classList.remove(
        "hidden"
      );

    }

  }


  function closeModal() {

    var modal =
      $("modal");

    if (modal) {

      modal.classList.add(
        "hidden"
      );

    }

  }


  /* =========================================================
     버튼 연결
  ========================================================= */

  if ($("heroBtn")) {

    $("heroBtn").onclick =
      openModal;

  }


  if ($("myListBtn")) {

    $("myListBtn").onclick =
      openModal;

  }


  if ($("close")) {

    $("close").onclick =
      closeModal;

  }


  if ($("modal")) {

    $("modal").onclick =
      function (event) {

        if (
          event.target ===
          $("modal")
        ) {

          closeModal();

        }

      };

  }


  /* =========================================================
     찾는 포켓몬 검색
  ========================================================= */

  if ($("lookingSearch")) {

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

  }


  /* =========================================================
     제공 포켓몬 검색
  ========================================================= */

  if ($("offeringSearch")) {

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

  }


  /* =========================================================
     등록
  ========================================================= */

  if ($("save")) {

    $("save").onclick =
      async function () {

        var nameInput =
          $("name");


        if (!nameInput) {

          alert(
            "이름 입력창을 찾을 수 없습니다."
          );

          return;
        }


        var name =
          nameInput.value.trim();


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
          현재 Supabase 구조:

          id
          user_id
          username
          name
          offering
          looking
          created_at

          user_id는 NULL 허용.
          offering / looking은 jsonb.
        */


        var newTrade = {

          name:
            name,

          username:
            name,

          user_id:
            localStorage.getItem("pogo_user_id"),
          
          offering:
            offeringPokemonList,

          looking:
            lookingPokemonList

        };


        console.log(
          "Supabase에 교환 목록 저장:",
          newTrade
        );


        var result =
          await supabaseClient
            .from("trades")
            .insert(newTrade)
            .select();


        if (result.error) {

          console.error(
            "교환 목록 등록 실패:",
            result.error
          );

          console.error(
            "error code:",
            result.error.code
          );

          console.error(
            "error message:",
            result.error.message
          );

          console.error(
            "error details:",
            result.error.details
          );

          console.error(
            "error hint:",
            result.error.hint
          );


          alert(
            "교환 목록을 등록하지 못했습니다.\n\n" +
            result.error.message
          );

          return;
        }


        console.log(
          "교환 목록 등록 완료:",
          result.data
        );


        if (
          Array.isArray(result.data) &&
          result.data.length
        ) {

          trades.unshift(
            result.data[0]
          );

        }
        else {

          trades.unshift(
            newTrade
          );

        }


        nameInput.value =
          "";


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

  }


  /* =========================================================
     메인 검색
  ========================================================= */

  if ($("search")) {

    $("search")
      .addEventListener(
        "input",
        render
      );

  }


  if ($("mode")) {

    $("mode")
      .addEventListener(
        "change",
        render
      );

  }


  /* =========================================================
     검색 초기화
  ========================================================= */

  if ($("reset")) {

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
var currentChatRoomId = null;

function openChat(roomId, trainerName) {
  console.log(
  "채팅창 열기:",
  roomId,
  trainerName
);

  currentChatRoomId =
    roomId;

  var modal =
    document.getElementById("chatModal");

  var title =
    document.getElementById("chatTitle");

  if (!modal) {
    return;
  }

  if (title) {
    title.textContent =
      trainerName || "교환 채팅";
  }

  modal.style.display =
    "block";

}
document
  .getElementById("closeChat")
  .addEventListener("click", function () {

    var modal =
      document.getElementById("chatModal");

    if (modal) {
      modal.style.display = "none";
    }

    currentChatRoomId = null;

  });
