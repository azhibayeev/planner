import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '../public/previews')

// Для каждого продукта: sheetId + какие вкладки снять (по тексту таба)
const SHEETS = [
  {
    id: 'planer-week',
    sheetId: '1T3oXdlk-A5Ku2Gsm5Ix80fnUMla8UZgLy9tkfLpJMTY',
    tabs: ['Задачи на неделю', 'Обзор задач'],
  },
  {
    id: 'budget-personal',
    sheetId: '1dMrQHluKWOXG1LShT2prdXBzYlBNcpybSBH2zJuisfY',
    tabs: [null, null], // брать первые 2 вкладки подряд
  },
  {
    id: 'habit-tracker',
    sheetId: '1_CGkd5MjE654wLTzYjXfjVaoDsVGvSw3HzxqlvpszXI',
    tabs: [null, null],
  },
  {
    id: 'fitness-tracker',
    sheetId: '16V-BmFDy04NmwkZ1AR0-IRnFzEiuO-77Us3zyp_gz3Q',
    tabs: [null, null],
  },
  {
    id: 'planer-year',
    sheetId: '1km2Qi_578NjdkdTRcKrNKBiJEi0BLvpWKVvNV0kyhow',
    tabs: [null, null],
  },
]

async function screenshotSheet(browser, sheetId, tabName, tabIndex, outputPath) {
  const page = await browser.newPage()
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/preview`

  try {
    console.log(`     Открываю ${url}`)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 })

    // Проверка на логин-редирект
    if (page.url().includes('accounts.google.com')) {
      console.log(`     ⚠️  Требует авторизацию`)
      await page.close()
      return false
    }

    // Долгое ожидание для рендеринга таблицы
    await new Promise(r => setTimeout(r, 6000))

    // Получить список вкладок
    const tabs = await page.$$('.docs-sheet-tab')
    console.log(`     Найдено вкладок: ${tabs.length}`)

    if (tabs.length === 0) {
      console.log(`     ⚠️  Вкладки не найдены — таблица не загрузилась`)
      await page.close()
      return false
    }

    // Найти нужную вкладку
    let targetTab = null
    if (tabName) {
      for (const tab of tabs) {
        const text = await page.evaluate(el => el.textContent?.trim(), tab)
        if (text && text.toLowerCase().includes(tabName.toLowerCase())) {
          targetTab = tab
          console.log(`     Найдена вкладка: "${text}"`)
          break
        }
      }
      if (!targetTab) {
        console.log(`     ⚠️  Вкладка "${tabName}" не найдена, беру первую`)
        targetTab = tabs[0]
      }
    } else {
      // null = брать по индексу
      targetTab = tabs[Math.min(tabIndex, tabs.length - 1)]
      const text = await page.evaluate(el => el.textContent?.trim(), targetTab)
      console.log(`     Вкладка [${tabIndex}]: "${text}"`)
    }

    // Кликаем по вкладке
    await targetTab.click()
    await new Promise(r => setTimeout(r, 5000))

    // Скрываем шапку Google
    await page.evaluate(() => {
      ['.docs-titlebar', '.docs-toolbar-container', '#docs-chrome',
       '#t-toolbar', '.docs-presence-plus-container', '.goog-toolbar',
       '[id^="docs-toolbar"]',
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => { el.style.display = 'none' })
      })
    })

    await page.screenshot({ path: outputPath, fullPage: false })
    console.log(`     ✅ Сохранён: ${path.basename(outputPath)}`)
    await page.close()
    return true
  } catch (err) {
    console.log(`     ❌ Ошибка: ${err.message}`)
    await page.close()
    return false
  }
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 },
  })

  for (const sheet of SHEETS) {
    console.log(`\n📸 ${sheet.id}`)
    for (let i = 0; i < sheet.tabs.length; i++) {
      const tabName = sheet.tabs[i]
      const outputPath = path.join(OUTPUT_DIR, `${sheet.id}-${i + 1}.png`)
      await screenshotSheet(browser, sheet.sheetId, tabName, i, outputPath)
    }
  }

  await browser.close()
  console.log('\n✅ Всё готово!')
}

main().catch(console.error)
