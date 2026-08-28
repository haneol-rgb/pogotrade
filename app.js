```javascript
document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 기본 설정
  // =========================================================

  const MAX_POKEMON = 1025;

  // =========================================================
  // Supabase 설정
  // =========================================================
  //
  // 네 Supabase 프로젝트 ID:
  // lsdqvbijhxnfrzprcaxr
  //
  // Supabase URL은 프로젝트 ID를 기준으로:
  // https://lsdqvbijhxnfrzprcaxr.supabase.co
  //
  // 아래 SUPABASE_KEY 부분에
  // 네가 Supabase에서 확인한 sb_publishable_... 키를 넣어줘.
  //
  // =========================================================

  const SUPABASE_URL =
    "https://lsdqvbijhxnfrzprcaxr.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_6V08H2LunPBhmIqQjCtHVg_RCqIkuHR";


  // =========================================================
  // Supabase 연결
  // =========================================================

  if (
    typeof window.supabase === "undefined"
  ) {

    console.error(
      "Supabase 라이브러리를 찾을 수 없습니다."
    );

    alert(
      "Supabase 라이브러리를 불러오지 못했습니다.\n\n" +
      "index.html에 Supabase CDN이 연결되어 있는지 확인해주세요."
    );

    return;

  }


  const supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );


  // =========================================================
  // 데이터
  // =========================================================

  let trades = [];

  let pokemonList = [];

  let lookingPokemonList = [];

  let offeringPokemonList = [];


  const $ = id =>
    document.getElementById(id);


  // =========================================================
  // Pokémon GO에서 다이맥스가 공개된 포켓몬
  // =========================================================

  const dynamaxIds = new Set([

    // 2024
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

    // 2025
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

    // 2026
    126,
    374,
    129,
    237

  ]);


  // =========================================================
  // Pokémon GO 거다이맥스
  // =========================================================

  const gigantamaxIds = new Set([

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


  // =========================================================
  // 포켓몬 데이터 불러오기
  // =========================================================

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
        '<script src="포켓몬 전국도감.js"></script>\n' +
        '<script src="app.js"></script>\n\n' +
        "순서로 연결되어 있는지 확인해주세요."
      );

      pokemonList = [];

      return;

    }


    pokemonList =
      pokemonData

        .filter(
          pokemon =>
            pokemon &&
            Number(pokemon.id) >= 1 &&
            Number(pokemon.id) <= MAX_POKEMON
        )

        .map(
          pokemon => ({

            id:
              Number(
                pokemon.id
              ),

            name:
              pokemon.name ||
              `포켓몬 ${pokemon.id}`,

            koreanName:
              pokemon.name ||
              `포켓몬 ${pokemon.id}`,

          })
        );


    console.log(
      `오프라인 포켓몬 데이터 ${pokemonList.length}종 로딩 완료`
    );

  }


  // =========================================================
  // 포켓몬 이미지
  // =========================================================

  function pokemonImage(
    id,
    shiny = false
  ) {

    if (shiny) {

      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

    }


    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  }


  // =========================================================
  // 형태 이름
  // =========================================================

  const formDefinitions = {

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


  // =========================================================
  // 포켓몬별 선택 가능한 형태
  // =========================================================

  function getAvailableForms(
    pokemon
  ) {

    const id =
      Number(
        pokemon.id
      );


    const forms = [
      "normal",
      "shiny"
    ];


    if (
      dynamaxIds.has(id)
    ) {

      forms.push(
        "dynamax"
      );

      forms.push(
        "shiny-dynamax"
      );

    }


    if (
      gigantamaxIds.has(id)
    ) {

      forms.push(
        "gigantamax"
      );

      forms.push(
        "shiny-gigantamax"
      );

    }


    return forms;

  }


  // =========================================================
  // 포켓몬 검색
  // =========================================================

  function searchPokemon(
    query
  ) {

    const q =
      query
        .trim()
        .toLowerCase();


    if (!q) {

      return [];

    }


    return pokemonList

      .filter(
        pokemon => {

          const name =
            String(
              pokemon.name
            )
              .toLowerCase();


          const id =
            String(
              pokemon.id
            );


          return (
            name.includes(q) ||
            id === q
          );

        }
      )

      .slice(
        0,
        8
      );

  }


  // =========================================================
  // HTML 문자 처리
  // =========================================================

  function escapeHtml(
    text
  ) {

    return String(text)

      .replace(
        /&/g,
        "&amp;"
      )

      .replace(
        /</g,
        "&lt;"
      )

      .replace(
        />/g,
        "&gt;"
      )

      .replace(
        /"/g,
        "&quot;"
      )

      .replace(
        /'/g,
        "&#039;"
      );

  }


  // =========================================================
  // 포켓몬 검색 결과 표시
  // =========================================================

  function showPokemonChoices(
    inputId,
    choicesId
  ) {

    const input =
      $(inputId);

    const choices =
      $(choicesId);


    if (
      !input ||
      !choices
    ) {

      return;

    }


    const results =
      searchPokemon(
        input.value
      );


    if (
      !results.length
    ) {

      choices.innerHTML = "";

      return;

    }


    choices.innerHTML =
      results

        .map(
          pokemon => {

            return `

              <div
                class="pokemonSearchResult"
                data-pokemon-id="${pokemon.id}"
              >

                <img
                  src="${pokemonImage(
                    pokemon.id
                  )}"
                  alt="${escapeHtml(
                    pokemon.name
                  )}"
                >

                <div>

                  <strong>
                    ${escapeHtml(
                      pokemon.name
                    )}
                  </strong>

                  <small>
                    No.${String(
                      pokemon.id
                    ).padStart(
                      4,
                      "0"
                    )}
                  </small>

                </div>

              </div>

            `;

          }
        )

        .join("");


    choices
      .querySelectorAll(
        ".pokemonSearchResult"
      )

      .forEach(
        result => {

          result.addEventListener(
            "click",
            () => {

              const id =
                Number(
                  result.dataset.pokemonId
                );


              const pokemon =
                pokemonList.find(
                  p =>
                    p.id === id
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

        }
      );

  }


  // =========================================================
  // 포켓몬 형태 선택
  // =========================================================

  function showFormChoices(
    pokemon,
    inputId,
    choicesId
  ) {

    const choices =
      $(choicesId);


    if (!choices) {

      return;

    }


    const forms =
      getAvailableForms(
        pokemon
      );


    choices.innerHTML = `

      <div
        class="pokemonFormHeader"
      >

        <strong>
          ${escapeHtml(
            pokemon.name
          )}
        </strong>

        <span>
          No.${String(
            pokemon.id
          ).padStart(
            4,
            "0"
          )}
        </span>

      </div>


      <div
        class="pokemonFormGrid"
      >

        ${forms
          .map(
            form => {

              const definition =
                formDefinitions[
                  form
                ];


              const shiny =
                form === "shiny" ||
                form === "shiny-dynamax" ||
                form === "shiny-gigantamax";


              return `

                <div
                  class="pokemonFormChoice"
                  data-pokemon-id="${pokemon.id}"
                  data-form="${form}"
                >

                  <div
                    class="pokemonFormImage"
                  >

                    <img
                      src="${pokemonImage(
                        pokemon.id,
                        shiny
                      )}"
                      alt="${escapeHtml(
                        pokemon.name
                      )}"
                    >

                  </div>


                  <div
                    class="pokemonFormName"
                  >

                    ${definition.name}

                  </div>

                </div>

              `;

            }
          )
          .join("")}

      </div>

    `;


    choices
      .querySelectorAll(
        ".pokemonFormChoice"
      )

      .forEach(
        card => {

          card.addEventListener(
            "click",
            () => {

              const id =
                Number(
                  card.dataset.pokemonId
                );


              const form =
                card.dataset.form;


              const selected =
                pokemonList.find(
                  p =>
                    p.id === id
                );


              if (!selected) {

                return;

              }


              const item = {

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

        }
      );

  }


  // =========================================================
  // 선택한 포켓몬 표시
  // =========================================================

  function renderSelectedPokemon(
    list,
    containerId
  ) {

    const container =
      $(containerId);


    if (!container) {

      return;

    }


    container.innerHTML =
      list

        .map(
          (pokemon, index) => {

            const form =
              pokemon.condition ||
              "normal";


            const definition =
              formDefinitions[
                form
              ] ||
              formDefinitions.normal;


            const shiny =
              form === "shiny" ||
              form === "shiny-dynamax" ||
              form === "shiny-gigantamax";


            return `

              <div
                class="selectedPokemon"
              >

                <img
                  src="${pokemonImage(
                    pokemon.id,
                    shiny
                  )}"
                  alt="${escapeHtml(
                    pokemon.name
                  )}"
                >


                <div
                  class="selectedPokemonInfo"
                >

                  <strong>
                    ${escapeHtml(
                      pokemon.name
                    )}
                  </strong>

                  <span>
                    ${definition.name}
                  </span>

                </div>


                <button
                  type="button"
                  class="removePokemon"
                  data-index="${index}"
                >
                  ×
                </button>

              </div>

            `;

          }
        )

        .join("");


    container
      .querySelectorAll(
        ".removePokemon"
      )

      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const index =
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

        }
      );

  }


  // =========================================================
  // 기존 데이터 호환
  // =========================================================

  function normalizePokemon(
    pokemon
  ) {

    if (
      typeof pokemon === "object" &&
      pokemon !== null
    ) {

      return {

        id:
          Number(
            pokemon.id
          ) || 0,

        name:
          pokemon.name ||
          "알 수 없음",

        condition:
          pokemon.condition ||
          "normal"

      };

    }


    const found =
      pokemonList.find(
        p =>
          p.name === pokemon
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

  }


  // =========================================================
  // 교환 목록 포켓몬 표시
  // =========================================================

  function pokemonChip(
    pokemon
  ) {

    const p =
      normalizePokemon(
        pokemon
      );


    const definition =
      formDefinitions[
        p.condition
      ] ||
      formDefinitions.normal;


    const shiny =
      p.condition === "shiny" ||
      p.condition === "shiny-dynamax" ||
      p.condition === "shiny-gigantamax";


    return `

      <span
        class="chip pokemonChip"
      >

        ${
          p.id
            ? `
              <img
                src="${pokemonImage(
                  p.id,
                  shiny
                )}"
                alt="${escapeHtml(
                  p.name
                )}"
              >
            `
            : ""
        }


        <span>
          ${escapeHtml(
            p.name
          )}
        </span>


        <span
          class="conditionBadge"
        >
          ${definition.name}
        </span>

      </span>

    `;

  }


  function chips(
    array
  ) {

    if (
      !array ||
      !array.length
    ) {

      return `
        <span class="chip">
          없음
        </span>
      `;

    }


    return array
      .map(
        pokemonChip
      )
      .join("");

  }


  // =========================================================
  // Supabase에서 교환 목록 불러오기
  // =========================================================

  async function loadTrades() {

    console.log(
      "Supabase에서 교환 목록을 불러오는 중..."
    );


    const {
      data,
      error
    } =
      await supabaseClient

        .from("trades")

        .select("*")

        .order(
          "created_at",
          {
            ascending: false
          }
        );


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
      `Supabase 교환 목록 ${trades.length}개 로딩 완료`
    );


    render();

  }


  // =========================================================
  // 교환 목록 렌더링
  // =========================================================

  function render() {

    const search =
      $("search");

    const mode =
      $("mode");

    const cards =
      $("cards");

    const count =
      $("count");


    if (
      !search ||
      !mode ||
      !cards
    ) {

      return;

    }


    const q =
      search.value
        .trim()
        .toLowerCase();


    const selectedMode =
      mode.value;


    const list =
      trades.filter(
        trade => {

          const looking =
            (
              trade.looking ||
              []
            )
              .map(
                normalizePokemon
              );


          const offering =
            (
              trade.offering ||
              []
            )
              .map(
                normalizePokemon
              );


          const lookingText =
            looking
              .map(
                p =>
                  p.name
              )
              .join(" ")
              .toLowerCase();


          const offeringText =
            offering
              .map(
                p =>
                  p.name
              )
              .join(" ")
              .toLowerCase();


          if (!q) {

            return true;

          }


          if (
            selectedMode ===
            "looking"
          ) {

            return lookingText
              .includes(q);

          }


          if (
            selectedMode ===
            "offering"
          ) {

            return offeringText
              .includes(q);

          }


          return (
            lookingText.includes(q) ||
            offeringText.includes(q)
          );

        }
      );


    if (count) {

      count.textContent =
        list.length
          ? `${list.length}명`
          : "";

    }


    if (!list.length) {

      cards.innerHTML = `

        <div
          class="empty"
        >

          <strong>

            ${
              trades.length
                ? "조건에 맞는 교환 목록이 없습니다."
                : "아직 등록된 교환 목록이 없습니다."
            }

          </strong>


          <span>

            ${
              trades.length
                ? "검색 조건을 바꿔보세요."
                : "첫 번째 교환 목록을 등록해 보세요."
            }

          </span>


          ${
            !trades.length
              ? `
                <br>

                <button
                  id="emptyRegister"
                >
                  교환 목록 등록하기
                </button>
              `
              : ""
          }

        </div>

      `;


      const emptyButton =
        $("emptyRegister");


      if (emptyButton) {

        emptyButton.onclick =
          openModal;

      }


      return;

    }


    cards.innerHTML = `

      <div
        class="grid"
      >

        ${list

          .map(
            trade => {

              const index =
                trades.indexOf(
                  trade
                );


              const looking =
                (
                  trade.looking ||
                  []
                )
                  .map(
                    normalizePokemon
                  );


              const offering =
                (
                  trade.offering ||
                  []
                )
                  .map(
                    normalizePokemon
                  );


              return `

                <article
                  class="card"
                >

                  <div
                    class="top"
                  >

                    <span
                      class="name"
                    >
                      ${escapeHtml(
                        trade.name ||
                        "이름 없음"
                      )}
                    </span>

                  </div>


                  <div
                    class="label"
                  >

                    찾는 포켓몬 ·
                    ${looking.length}

                  </div>


                  <div
                    class="chips"
                  >

                    ${chips(
                      looking
                    )}

                  </div>


                  <div
                    class="label"
                  >

                    제공 포켓몬 ·
                    ${offering.length}

                  </div>


                  <div
                    class="chips"
                  >

                    ${chips(
                      offering
                    )}

                  </div>


                  <div
                    class="cardButtons"
                  >

                    <button
                      class="request"
                      data-index="${index}"
                    >
                      교환 신청
                    </button>


                    <button
                      class="deleteTrade"
                      data-index="${index}"
                    >
                      삭제
                    </button>

                  </div>

                </article>

              `;

            }
          )

          .join("")}

      </div>

    `;


    // =======================================================
    // 교환 신청
    // =======================================================

    document
      .querySelectorAll(
        ".request"
      )

      .forEach(
        button => {

          button.onclick =
            () => {

              const index =
                Number(
                  button.dataset.index
                );


              if (
                !trades[index]
              ) {

                return;

              }


              requestTrade(
                trades[index].name
              );

            };

        }
      );


    // =======================================================
    // 삭제
    // =======================================================

    document
      .querySelectorAll(
        ".deleteTrade"
      )

      .forEach(
        button => {

          button.onclick =
            () => {

              const index =
                Number(
                  button.dataset.index
                );


              deleteTrade(
                index
              );

            };

        }
      );

  }


  // =========================================================
  // 교환 신청
  // =========================================================

  function requestTrade(
    name
  ) {

    alert(
      `${name}님에게 교환 신청을 보내는 기능입니다.\n\n` +
      `현재는 테스트 버전이라 실제 전송은 아직 연결되지 않았습니다.`
    );

  }


  // =========================================================
  // 교환 목록 삭제
  // =========================================================

  async function deleteTrade(
    index
  ) {

    const trade =
      trades[index];


    if (!trade) {

      return;

    }


    const confirmed =
      confirm(
        `"${trade.name}"님의 교환 목록을 삭제하시겠습니까?\n\n` +
        `삭제하면 다시 복구할 수 없습니다.`
      );


    if (!confirmed) {

      return;

    }


    // -------------------------------------------------------
    // 삭제할 데이터의 id 확인
    // -------------------------------------------------------

    if (!trade.id) {

      alert(
        "이 교환 목록에는 삭제할 ID가 없습니다."
      );

      return;

    }


    const {
      error
    } =
      await supabaseClient

        .from("trades")

        .delete()

        .eq(
          "id",
          trade.id
        );


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


    // 화면에서도 제거

    trades.splice(
      index,
      1
    );


    render();


    alert(
      "교환 목록이 삭제되었습니다."
    );

  }


  // =========================================================
  // 모달
  // =========================================================

  function openModal() {

    const modal =
      $("modal");


    if (modal) {

      modal.classList.remove(
        "hidden"
      );

    }

  }


  function closeModal() {

    const modal =
      $("modal");


    if (modal) {

      modal.classList.add(
        "hidden"
      );

    }

  }


  // =========================================================
  // 버튼 연결
  // =========================================================

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
      event => {

        if (
          event.target ===
          $("modal")
        ) {

          closeModal();

        }

      };

  }


  // =========================================================
  // 찾는 포켓몬 검색
  // =========================================================

  if ($("lookingSearch")) {

    $("lookingSearch")
      .addEventListener(
        "input",
        () => {

          showPokemonChoices(
            "lookingSearch",
            "lookingChoices"
          );

        }
      );

  }


  // =========================================================
  // 제공 포켓몬 검색
  // =========================================================

  if ($("offeringSearch")) {

    $("offeringSearch")
      .addEventListener(
        "input",
        () => {

          showPokemonChoices(
            "offeringSearch",
            "offeringChoices"
          );

        }
      );

  }


  // =========================================================
  // 등록 버튼
  // =========================================================

  if ($("save")) {

    $("save").onclick =
      async () => {

        const name =
          $("name")
            .value
            .trim();


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


        // ---------------------------------------------------
        // Supabase에 저장할 데이터
        // ---------------------------------------------------

        const newTrade = {

          name:

            name,

          looking:

            [...lookingPokemonList],

          offering:

            [...offeringPokemonList]

        };


        console.log(
          "Supabase에 교환 목록 저장:",
          newTrade
        );


        // ---------------------------------------------------
        // Supabase INSERT
        // ---------------------------------------------------

        const {
          data,
          error
        } =
          await supabaseClient

            .from("trades")

            .insert(
              newTrade
            )

            .select();


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


        // ---------------------------------------------------
        // 화면 데이터에도 추가
        // ---------------------------------------------------

        if (
          Array.isArray(data) &&
          data.length
        ) {

          trades.unshift(
            data[0]
          );

        }
        else {

          trades.unshift(
            newTrade
          );

        }


        // ---------------------------------------------------
        // 입력 초기화
        // ---------------------------------------------------

        $("name").value =
          "";


        if ($("lookingSearch")) {

          $("lookingSearch")
            .value = "";

        }


        if ($("offeringSearch")) {

          $("offeringSearch")
            .value = "";

        }


        lookingPokemonList = [];

        offeringPokemonList = [];


        if ($("lookingChoices")) {

          $("lookingChoices")
            .innerHTML = "";

        }


        if ($("offeringChoices")) {

          $("offeringChoices")
            .innerHTML = "";

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


  // =========================================================
  // 메인 검색
  // =========================================================

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


  // =========================================================
  // 초기화
  // =========================================================

  if ($("reset")) {

    $("reset").onclick =
      () => {

        $("search").value =
          "";

        $("mode").value =
          "all";

        render();

      };

  }


  // =========================================================
  // 시작
  // =========================================================

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
