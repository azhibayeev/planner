import PurchaseTracker from '@/components/PurchaseTracker'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <PurchaseTracker />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8 text-center">

        {/* Иконка */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold mb-2">Оплата прошла! 🎉</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Спасибо за покупку. Письмо со ссылкой уже летит на ваш email — обычно приходит в течение 1–2 минут.
        </p>

        {/* Шаги */}
        <div className="bg-gray-50 rounded-xl p-5 text-left mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Что делать дальше</p>
          <ol className="flex flex-col gap-3">
            {[
              'Откройте письмо от MyPlaner на вашем email',
              'Нажмите на ссылку в письме',
              'Google спросит «Создать копию?» — нажмите ОК',
              'Таблица появится в вашем Google Drive — можно начинать!',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Предупреждение про спам */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-left">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Письмо не пришло?</span> Проверьте папку <strong>«Спам»</strong> или <strong>«Промоакции»</strong> (Gmail). Если и там нет — напишите нам.
          </p>
        </div>

        <a
          href="/"
          className="block w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm mb-3"
        >
          Вернуться на главную
        </a>

        <a
          href="https://t.me/myplaner_support"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Написать в поддержку Telegram
        </a>

      </div>
    </main>
  )
}
