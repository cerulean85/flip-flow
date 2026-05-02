import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "모바일 사용 도움말 | Flip & Flow",
  description: "Flip & Flow 모바일 앱 로그인 및 주요 기능 사용 안내",
}

const sections = [
  {
    title: "로그인하기",
    items: [
      "앱을 실행한 뒤 로그인 화면에서 Flip & Flow 로고를 다섯 번 누릅니다.",
      "로그인 버튼이 나타나면 리뷰용 또는 본인 계정의 이메일과 비밀번호를 입력합니다.",
      "로그인 후 하단 탭에서 덱, 전체 학습, 북마크, 에세이, 설정 화면으로 이동할 수 있습니다.",
    ],
  },
  {
    title: "덱으로 학습하기",
    items: [
      "덱 탭에서 학습할 덱을 선택합니다.",
      "카드를 눌러 앞면과 뒷면을 전환하며 문장과 뜻을 확인합니다.",
      "필요한 카드는 북마크해서 나중에 다시 볼 수 있습니다.",
    ],
  },
  {
    title: "전체 학습과 북마크",
    items: [
      "전체 학습 탭에서는 모든 카드가 덱 구분 없이 표시됩니다.",
      "북마크 탭에서는 저장한 카드만 모아서 복습할 수 있습니다.",
      "카드 목록에서 원하는 항목을 선택하면 자세한 학습 화면으로 이동합니다.",
    ],
  },
  {
    title: "에세이 연습",
    items: [
      "에세이 탭에서 새 글을 작성하거나 기존 글을 열 수 있습니다.",
      "작성한 내용은 계정에 저장되어 다시 이어서 수정할 수 있습니다.",
      "영어 문장 연습, 짧은 글쓰기, 표현 정리에 활용할 수 있습니다.",
    ],
  },
]

export default function MobileHelpPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Flip & Flow</p>
          <h1 className="text-3xl font-bold">모바일 사용 도움말</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Flip & Flow 모바일 앱에서 로그인하고 주요 학습 기능을 사용하는 방법입니다.
          </p>
        </header>

        <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
          <h2 className="text-xl font-semibold">빠른 시작</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-700 dark:text-zinc-300">
            <li>모바일 앱을 실행합니다.</li>
            <li>로그인 화면에서 로고를 다섯 번 누릅니다.</li>
            <li>나타난 로그인 버튼을 누릅니다.</li>
            <li>이메일과 비밀번호를 입력한 뒤 로그인합니다.</li>
            <li>하단 탭을 이용해 원하는 학습 화면으로 이동합니다.</li>
          </ol>
        </section>

        <div className="space-y-8">
          {sections.map((section) => (
            <section className="space-y-3" key={section.title}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <ul className="list-disc space-y-2 pl-5 text-zinc-700 dark:text-zinc-300">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="text-xl font-semibold">문의</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            앱 사용 중 문제가 있으면{" "}
            <a className="font-semibold text-blue-600 dark:text-blue-400" href="mailto:zhwan85@dycdyp.com">
              zhwan85@dycdyp.com
            </a>
            으로 문의해주세요.
          </p>
        </section>
      </article>
    </main>
  )
}
