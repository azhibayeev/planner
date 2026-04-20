export const metadata = { title: 'Публичная оферта — MyPlaner' }

export default function OfferPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors mb-8 inline-block">← На главную</a>
      <h1 className="text-3xl font-extrabold mb-8">Публичная оферта</h1>

      <div className="text-sm leading-relaxed flex flex-col gap-6 text-gray-700">

        <section>
          <h2 className="font-bold text-base text-black mb-2">1. Предмет оферты</h2>
          <p>Настоящая публичная оферта является официальным предложением MyPlaner (далее — «Продавец», сайт myplaner.asia) заключить договор купли-продажи цифровых товаров (Google Таблицы) на условиях, изложенных ниже.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">2. Акцепт оферты</h2>
          <p>Акцептом оферты является совершение оплаты заказа на сайте. С момента оплаты договор считается заключённым.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">3. Товар и доставка</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Товар — цифровой продукт в виде Google Таблицы</li>
            <li>Доставка осуществляется автоматически на email, указанный при заказе, в течение 15 минут после подтверждения оплаты</li>
            <li>Покупатель получает неисключительное право использования таблицы для личных целей</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">4. Цена и оплата</h2>
          <p>Цены указаны в тенге (₸) и включают все налоги. Оплата производится через платёжный сервис ApiPay.kz. Продавец не хранит данные банковских карт.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">5. Возврат</h2>
          <p>В связи с цифровым характером товара возврат денежных средств после получения ссылки на таблицу не производится. При технических проблемах с получением товара — обратитесь на <a href="mailto:support@myplaner.asia" className="text-black underline">support@myplaner.asia</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">6. Ответственность</h2>
          <p>Продавец не несёт ответственности за сбои в работе Google Сервисов. Таблицы предоставляются «как есть» и могут изменяться без предварительного уведомления.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">7. Контакты</h2>
          <p>По всем вопросам: <a href="mailto:support@myplaner.asia" className="text-black underline">support@myplaner.asia</a></p>
        </section>

        <p className="text-gray-400 text-xs">Последнее обновление: апрель 2025</p>
      </div>
    </main>
  )
}
