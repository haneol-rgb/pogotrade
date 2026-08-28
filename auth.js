document.addEventListener("DOMContentLoaded", async function () {

  const supabaseUrl =
    "https://lsdqvbijhxnfrzprcaxr.supabase.co";

  const supabaseKey =
    "sb_publishable_6V08H2LunPBhmIqQjCtHVg_RCqIkuHR";

  if (!window.supabase) {
    console.error(
      "Supabase 라이브러리를 찾을 수 없습니다."
    );
    return;
  }

  const client =
    window.supabase.createClient(
      supabaseUrl,
      supabaseKey
    );

  let sessionResult =
    await client.auth.getSession();

  let session =
    sessionResult.data.session;

  if (!session) {

    const signInResult =
      await client.auth.signInAnonymously();

    if (signInResult.error) {

      console.error(
        "익명 로그인 실패:",
        signInResult.error
      );

      return;

    }

    session =
      signInResult.data.session;

    console.log(
      "익명 사용자 로그인 성공"
    );

  } else {

    console.log(
      "기존 익명 사용자 세션 확인"
    );

  }

  if (
    session &&
    session.user
  ) {

    const userId =
      session.user.id;

    localStorage.setItem(
      "pogo_user_id",
      userId
    );

    console.log(
      "현재 사용자 ID:",
      userId
    );

  }

});
