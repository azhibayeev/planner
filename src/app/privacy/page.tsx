export const metadata = { title: 'Политика конфиденциальности — MyPlaner' }

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors mb-8 inline-block">← На главную</a>
      <h1 className="text-3xl font-extrabold mb-8">Политика конфиденциальности</h1>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed flex flex-col gap-6 text-gray-700">

        <section>
          <h2 className="font-bold text-base text-black mb-2">1. Общие положения</h2>
          <p>Настоящая политика конфиденциальности описывает, как MyPlaner (далее — «Сайт», myplaner.asia) собирает, использует, хранит и защищает персональные данные пользователей в соответствии с Законом Республики Казахстан «О персональных данных и их защите» № 94-V от 21 мая 2013 года.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">2. Оператор персональных данных</h2>
          <p>Оператором персональных данных является владелец сайта myplaner.asia. Контактный email для вопросов по обработке данных: <a href="mailto:support@myplaner.asia" className="text-black underline">support@myplaner.asia</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">3. Какие данные мы собираем</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Имя и адрес электронной почты — при оформлении заказа</li>
            <li>Номер телефона — при необходимости связи по заказу</li>
            <li>Технические данные — IP-адрес, тип браузера, операционная система, для аналитики и безопасности</li>
            <li>Данные об использовании сайта — через Facebook Pixel и аналогичные сервисы (при наличии согласия через cookie-баннер)</li>
            <li>Файлы cookie — для корректной работы сайта и аналитики</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">4. Цели обработки данных</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Обработка и доставка заказа (отправка ссылки на таблицу на email)</li>
            <li>Связь с клиентом по вопросам заказа и поддержки</li>
            <li>Выполнение обязательств по договору оферты</li>
            <li>Улучшение качества сервиса и маркетинговая аналитика</li>
            <li>Выполнение требований законодательства</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">5. Правовые основания обработки</h2>
          <p>Обработка персональных данных осуществляется на основании согласия субъекта персональных данных, которое предоставляется при оформлении заказа и использовании сайта, а также для исполнения договора, стороной которого является пользователь.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">6. Хранение и защита данных</h2>
          <p>Данные хранятся на защищённых серверах Supabase с применением шифрования при передаче (TLS) и хранении. Срок хранения данных — не более 3 лет с момента последнего взаимодействия, либо до отзыва согласия. Мы принимаем организационные и технические меры для защиты данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">7. Передача третьим лицам</h2>
          <p>Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
            <li>Платёжного сервиса ApiPay.kz — для обработки оплаты</li>
            <li>Supabase — для хранения данных</li>
            <li>Meta (Facebook) — для маркетинговой аналитики при наличии вашего согласия</li>
            <li>Государственных органов — в случаях, предусмотренных законодательством</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">8. Cookie-файлы</h2>
          <p>Сайт использует cookie-файлы для обеспечения корректной работы, аналитики и маркетинга. Вы можете отключить cookie в настройках браузера, но это может повлиять на функциональность сайта.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">9. Ваши права</h2>
          <p>В соответствии с законодательством РК вы имеете право:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
            <li>Получить информацию о своих персональных данных и их обработке</li>
            <li>Запросить изменение или удаление данных</li>
            <li>Отозвать согласие на обработку данных</li>
            <li>Обжаловать действия оператора в уполномоченном органе</li>
          </ul>
          <p className="mt-2">Для реализации прав напишите на <a href="mailto:support@myplaner.asia" className="text-black underline">support@myplaner.asia</a>. Ответ предоставляется в течение 15 рабочих дней.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">10. Дети</h2>
          <p>Сайт не предназначен для лиц младше 16 лет. Мы не осуществляем осознанный сбор персональных данных несовершеннолетних без согласия родителей или законных представителей.</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-black mb-2">11. Изменения политики</h2>
          <p>Мы можем обновлять эту политику. О существенных изменениях мы уведомим пользователей по email или через уведомление на сайте. Актуальная версия всегда доступна на этой странице.</p>
        </section>

        <p className="text-gray-400 text-xs">Последнее обновление: апрель 2026</p>
      </div>
    </main>
  )
}
