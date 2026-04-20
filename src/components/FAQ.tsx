'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Как долго у меня будет доступ к таблице?',
    a: 'Навсегда. После покупки вы получаете ссылку на копирование таблицы в свой Google Диск. Таблица полностью ваша — без подписок и ограничений.',
  },
  {
    q: 'Нужно что-то устанавливать?',
    a: 'Нет. Всё работает через браузер в Google Таблицах (sheets.google.com). Достаточно аккаунта Google.',
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Да, Google Таблицы работают на iOS и Android через официальное приложение или браузер.',
  },
  {
    q: 'Не пришло письмо с таблицей. Что делать?',
    a: 'Проверьте папку «Спам». Если письма нет — напишите на поддержку с указанием email, который вы вводили при заказе.',
  },
  {
    q: 'Можно ли редактировать таблицу под себя?',
    a: 'Да, абсолютно всё. Вы получаете полную копию — меняйте формулы, добавляйте листы, адаптируйте под свои задачи.',
  },
  {
    q: 'Как оплатить?',
    a: 'Принимаем оплату картой (Visa, Mastercard, Мир) через защищённую форму. Квитанция придёт на email.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-10">Частые вопросы</h2>
        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                <span>{item.q}</span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
