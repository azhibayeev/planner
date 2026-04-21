const steps = [
  {
    number: '01',
    title: 'Выбери таблицу и оплати',
    desc: 'Нажми «Купить», введи email и номер телефона. Мы выставим счёт в Kaspi — подтверди оплату в приложении.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Получи ссылку на почту',
    desc: 'Сразу после оплаты на твой email автоматически придёт письмо со ссылкой на таблицу.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Скопируй и начни пользоваться',
    desc: 'Перейди по ссылке, нажми «Создать копию» — таблица навсегда сохранится в твоём Google Drive.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-3">Как это работает?</h2>
          <p className="text-gray-500">Три простых шага — и таблица у тебя навсегда</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gray-200 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-black flex flex-col items-center justify-center mb-4 shadow-lg">
                <span className="text-white">{step.icon}</span>
                <span className="text-gray-500 text-[10px] font-bold mt-0.5">{step.number}</span>
              </div>
              <h3 className="font-bold text-base mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
