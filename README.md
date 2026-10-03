# 🎓 Навчальний проєкт: Робота з Формами в React + TypeScript (Vite)

Цей проєкт створений як детальний практичний та теоретичний посібник для студентів, які вивчають веб-розробку на **React + TypeScript**.

У проєкті наочно розібрані всі ключові підходи до обробки користувацького вводу, валідації та типових сценаріїв з реальної розробки.

---

## 🚀 Швидкий старт

1. Встановіть залежності:
   ```bash
   npm install
   ```
2. Запустіть dev-сервер:
   ```bash
   npm run dev
   ```
3. Відкрийте браузер за адресою, вказаною в терміналі (зазвичай `http://localhost:5173`).

---

## 🎨 Підтримка Темної Теми (Dark Mode)
- У правому верхньому кутку додано кнопку перемикання теми (**🌙 Темна тема / ☀️ Світла тема**).
- Налаштування автоматично зберігаються в `localStorage` та зчитують системну тему ОС користувача (`prefers-color-scheme`).
- Використано нативні CSS-змінні (`[data-theme='dark']`) з адаптацією карток, інпутів, кнопок, таблиць та бейджів.

---

## 📚 Структура модулів та навчальний план

### 1. Контрольований підхід (Controlled Components)
- **Файл:** [`ControlledBasicInputs.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/controlled/ControlledBasicInputs.tsx)
  - Текстове поле (`text`)
  - Числове поле (`number` + приведення типів `Number(e.target.value)`)
  - Багаторядковий текст (`textarea`)
  - Випадаючий список (`select`)
  - Одиночний чекбокс (атрибут `checked`, а не `value`)
  - Радіо-кнопки (`radio` buttons)
- **Файл:** [`SingleStateObjectForm.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/controlled/SingleStateObjectForm.tsx)
  - Паттерн єдиного об'єкта стану для всієї форми: `formData = { name, email, ... }`
  - Універсальний обробник `handleChange` з обчислюваними ключами `[e.target.name]: value`
  - Робота з групою чекбоксів (масив рядків `skills: string[]`)
  - Динамічне блокування кнопки submit (`disabled={!formData.acceptTerms}`)

### 2. Неконтрольований підхід (Uncontrolled Components)
- **Файл:** [`UncontrolledWithRefs.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/uncontrolled/UncontrolledWithRefs.tsx)
  - Збереження значень безпосередньо в DOM
  - Використання хука `useRef`
  - Різниця між `value` та `defaultValue`, `checked` та `defaultChecked`
  - Відсутність ре-рендерів під час набору тексту
- **Файл:** [`UncontrolledWithFormData.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/uncontrolled/UncontrolledWithFormData.tsx)
  - Сучасна робота з нативним `new FormData(e.currentTarget)`
  - Отримання значень через `formData.get()`, `formData.getAll()` для чекбоксів
  - Перетворення форми в об'єкт через `Object.fromEntries(formData.entries())`

### 3. Валідація форм (Validation)
- **Файл:** [`NativeHtmlValidation.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/validation/NativeHtmlValidation.tsx)
  - Вбудована валідація HTML5: `required`, `minLength`, `pattern`, `min`, `max`, `type="email"`, `type="url"`
  - Використання валідації браузера без додаткового коду
- **Файл:** [`CustomInteractiveValidation.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/validation/CustomInteractiveValidation.tsx)
  - Професійний підхід: стани `values`, `errors`, `touched`
  - Валідація при втраті фокусу (`onBlur`) — помилки не дратують користувача завчасно
  - Залежна валідація полів (пароль та підтвердження пароля)
  - Повна перевірка всієї форми при натисканні Submit

### 4. Складні сценарії (Complex Scenarios)
- **Файл:** [`FileUploadDemo.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/complex/FileUploadDemo.tsx)
  - Робота з `<input type="file">` (чому він завжди неконтрольований по `value`)
  - Валідація розміру (Byte -> MB) та MIME-типу файлу
  - Попередній перегляд (Preview) зображення через `URL.createObjectURL(file)` та очищення пам'яті через `URL.revokeObjectURL`
- **Файл:** [`DynamicFieldsForm.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/complex/DynamicFieldsForm.tsx)
  - Динамічне додавання та видалення полів зі стану форми
  - Робота з масивом об'єктів у React State
  - Важливість унікальних `key` (id замість індексу масиву)

### 5. Проєктування структури стану (Choosing the State Structure)
- **Файли:** [`RedundantStateDemo.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/complex/RedundantStateDemo.tsx)
  - **Антипатерн «Зайвий стан» (Redundant / Derived state)**: чому не варто зберігати в `useState` значення, які можна обчислити під час рендеру (`fullName`, `totalPrice`, `isFormValid`).
  - Перемикач **«Bad vs Good»**: показує небезпеку розсинхронізації та як замінити зайві `useState`/`useEffect` на чисті обчислювані константи під час рендерингу.
- **Файли:** [`ContradictoryStatusDemo.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/complex/ContradictoryStatusDemo.tsx)
  - **Антипатерн «Суперечливі булеві прапорці» (Contradictory State)**: як 4 незалежні `useState` (`isSubmitting`, `isSuccess`, `isError`) створюють $2^4 = 16$ станів, включно з абсурдними багами (одночасний `success` і `error`).
  - Рішення: типізована стейт-машина з єдиним статусом `status: 'typing' | 'submitting' | 'success' | 'error'`.
- **Файли:** [`NormalizedTravelPlan.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/complex/NormalizedTravelPlan.tsx), [`travelPlanData.ts`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/complex/travelPlanData.ts)
  - **«Уникайте глибоко вкладеного стану» (Avoid deeply nested state)**:
  - Порівняння: чому глибоке дерево вимагає рекурсії та заплутаного spread-копіювання при оновленні полів.
  - Як **нормалізований плоский стан** (`Record<number, Place>` + `childIds`) дозволяє змінювати будь-яке поле чи назву за $O(1)$:
    ```tsx
    setPlan(prev => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle }
    }));
    ```
  - Інтерактивні операції: інлайн-редагування назви, видалення вузла та додавання нової під-локації прямо у формі дерева.

### 6. Підняття стану вгору (Lifting State Up)
- **Файл:** [`SimpleTemperatureSync.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/lifting-state/SimpleTemperatureSync.tsx)
  - Класичний базовий приклад: два незалежні дочірні інпути (Цельсій та Фаренгейт) синхронізуються між собою.
  - Дочірній компонент `TemperatureInput` не має власного стану — він отримує `temperature` та колбек `onTemperatureChange` через `props`.
  - Спільний предок `SimpleTemperatureSync` тримає єдине джерело правди та обчислює конвертацію.
- **Файл:** [`FormAndPreviewSync.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/lifting-state/FormAndPreviewSync.tsx)
  - Реальний сценарій із продакшну: розділення компонентів на **форму редагування** (`ProfileEditor`) та **віджет живого прев'ю візитки** (`ProfileCardPreview`).
  - Компоненти повністю слабозв'язані (loose coupling). Стан піднято у спільний батьківський контейнер.

---

## 🔍 Лічильник рендерів (Render Counter)
У кожній картці прикладу додано віджет [`useRenderCount.tsx`](file:///Users/arakviel/Downloads/untitled%20folder%204/src/components/common/useRenderCount.tsx).
Він дозволяє студентам наочно побачити:
- **Контрольована форма**: кількість рендерів зростає на кожне введення літери.
- **Неконтрольована форма**: лічильник залишається на 1 рендері, поки користувач не натисне Submit.

---

## 🛠 Технологічний стек
- **Vite** — надшвидкий збирач проєкту
- **React 19**
- **TypeScript** — сувора типізація подій `React.ChangeEvent`, `React.FormEvent`, типів форм
