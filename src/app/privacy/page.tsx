export const metadata = { title: 'Политика конфиденциальности — MyPlaner' }

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors mb-8 inline-block">← На главную</a>
      <h1 className="text-3xl font-extrabold mb-8">Политика конфиденциальности</h1>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed flex flex-col gap-6 text-gray-700">

        <section>
          <h2 className="font-bold text-base text-black mb-2">1. Общие положения</h2>
          <p>Настоящая политика конфиденциальности описывает, как MyPlaner (далее — «Сайт», myplaner.asia) собирает, использует и защищает персональные данные пользователей.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">2. Какие данные мы собираем</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Имя и адрес электронной почты — при оформлении заказа</li>
            <li>Технические данные — IP-адрес, тип браузера, для аналитики и безопасности</li>
            <li>Данные об использовании сайта — через Facebook Pixel (при наличии согласия)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">3. Как мы используем данные</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Для обработки и доставки заказа (отправка ссылки на таблицу)</li>
            <li>Для связи по вопросам заказа</li>
            <li>Для улучшения качества сервиса</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">4. Хранение данных</h2>
          <p>Данные хранятся на защищённых серверах Supabase. Мы не передаём ваши персональные данные третьим лицам, кроме платёжного сервиса ApiPay.kz для обработки оплаты.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">5. Ваши права</h2>
          <p>Вы вправе запросить удаление своих данных, написав на <a href="mailto:support@myplaner.asia" className="text-black underline">support@myplaner.asia</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">6. Изменения политики</h2>
          <p>Мы можем обновлять эту политику. Актуальная версия всегда доступна на этой странице.</p>
        </section>

        <p className="text-gray-400 text-xs">Последнее обновление: апрель 2025</p>
      </div>
    </main>
  )
}
