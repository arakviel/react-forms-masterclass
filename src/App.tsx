import React, { useState, useEffect } from 'react';
import { UncontrolledWithRefs } from './components/uncontrolled/UncontrolledWithRefs';
import { UncontrolledWithFormData } from './components/uncontrolled/UncontrolledWithFormData';
import { ControlledBasicInputs } from './components/controlled/ControlledBasicInputs';
import { SingleStateObjectForm } from './components/controlled/SingleStateObjectForm';
import { NativeHtmlValidation } from './components/validation/NativeHtmlValidation';
import { CustomInteractiveValidation } from './components/validation/CustomInteractiveValidation';
import { FileUploadDemo } from './components/complex/FileUploadDemo';
import { DynamicFieldsForm } from './components/complex/DynamicFieldsForm';
import { NormalizedTravelPlan } from './components/complex/NormalizedTravelPlan';
import { RedundantStateDemo } from './components/complex/RedundantStateDemo';
import { ContradictoryStatusDemo } from './components/complex/ContradictoryStatusDemo';
import { SimpleTemperatureSync } from './components/lifting-state/SimpleTemperatureSync';
import { FormAndPreviewSync } from './components/lifting-state/FormAndPreviewSync';

type Tab =
  | 'uncontrolled'
  | 'controlled'
  | 'validation'
  | 'complex'
  | 'state-structure'
  | 'lifting-state'
  | 'comparison';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('controlled');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Синхронізуємо атрибут data-theme на <html> або <body>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title-group">
          <h1>🎓 Робота з Формами у React + TypeScript</h1>
          <p>
            Інтерактивний посібник для студентів: контрольовані та неконтрольовані форми, валідація,
            динамічні поля, оптимізація стану та Lifting State Up.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Перемкнути на ${theme === 'light' ? 'темну' : 'світлу'} тему`}
        >
          {theme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
        </button>
      </header>

      {/* Навігація по темах */}
      <nav className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === 'controlled' ? 'active' : ''}`}
          onClick={() => setActiveTab('controlled')}
        >
          1. Контрольовані форми (Controlled)
        </button>
        <button
          className={`tab-btn ${activeTab === 'uncontrolled' ? 'active' : ''}`}
          onClick={() => setActiveTab('uncontrolled')}
        >
          2. Неконтрольовані форми (Uncontrolled)
        </button>
        <button
          className={`tab-btn ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          3. Валідація форм (Validation)
        </button>
        <button
          className={`tab-btn ${activeTab === 'complex' ? 'active' : ''}`}
          onClick={() => setActiveTab('complex')}
        >
          4. Складні сценарії (Files & Dynamic)
        </button>
        <button
          className={`tab-btn ${activeTab === 'state-structure' ? 'active' : ''}`}
          onClick={() => setActiveTab('state-structure')}
        >
          5. Структура стану (State Structure)
        </button>
        <button
          className={`tab-btn ${activeTab === 'lifting-state' ? 'active' : ''}`}
          onClick={() => setActiveTab('lifting-state')}
        >
          6. Підняття стану (Lifting State Up)
        </button>
        <button
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          7. Шпаргалка: Порівняння підходів
        </button>
      </nav>

      {/* Вкладка 1: Контрольований підхід */}
      {activeTab === 'controlled' && (
        <section>
          <div className="module-intro">
            <h2>Контрольовані компоненти (Controlled Components)</h2>
            <p>
              У цьому підході стан форми зберігається в пам'яті React (через <code>useState</code>). React повністю
              контролює значення інпутів. Кожна зміна (введення тексту, вибір галочки) оновлює стан компонента,
              що спричиняє повторний рендеринг. Це дає 100% контроль над інтерфейсом, дозволяє робити моментальну
              валідацію та динамічне блокування кнопок.
            </p>
          </div>

          <div className="examples-grid two-cols">
            <ControlledBasicInputs />
            <SingleStateObjectForm />
          </div>
        </section>
      )}

      {/* Вкладка 2: Неконтрольований підхід */}
      {activeTab === 'uncontrolled' && (
        <section>
          <div className="module-intro">
            <h2>Неконтрольовані компоненти (Uncontrolled Components)</h2>
            <p>
              Тут значення форми зберігаються безпосередньо в DOM (в браузері), так само як у класичному HTML.
              React не відслідковує кожен натиск клавіші, тому компоненти <b>не роблять зайвих ре-рендерів</b>.
              Значення зчитуються лише в момент відправки форми (через <code>useRef</code> або нативний <code>new FormData(e.currentTarget)</code>).
            </p>
          </div>

          <div className="examples-grid two-cols">
            <UncontrolledWithRefs />
            <UncontrolledWithFormData />
          </div>
        </section>
      )}

      {/* Вкладка 3: Валідація */}
      {activeTab === 'validation' && (
        <section>
          <div className="module-intro">
            <h2>Валідація даних у формах</h2>
            <p>
              Валідація буває двох типів: вбудована браузерна (нативні HTML5-атрибути типу <code>required</code>, <code>pattern</code>)
              та кастомна валідація на рівні React з відстеженням станів <b>touched</b> (чи торкався користувач поля)
              та <b>onBlur</b> (вихід з фокусу), щоб не показувати червоні помилки занадто рано.
            </p>
          </div>

          <div className="examples-grid two-cols">
            <NativeHtmlValidation />
            <CustomInteractiveValidation />
          </div>
        </section>
      )}

      {/* Вкладка 4: Складні сценарії */}
      {activeTab === 'complex' && (
        <section>
          <div className="module-intro">
            <h2>Складні та життєві сценарії</h2>
            <p>
              Практичні ситуації: завантаження файлів (валідація розміру, типу, попередній перегляд через <code>URL.createObjectURL</code>)
              та робота з динамічними списками полів (додавання, зміна та видалення елементів масиву).
            </p>
          </div>

          <div className="examples-grid two-cols">
            <FileUploadDemo />
            <DynamicFieldsForm />
          </div>
        </section>
      )}

      {/* Вкладка 5: Структура стану (React Docs Best Practices & Anti-patterns) */}
      {activeTab === 'state-structure' && (
        <section>
          <div className="module-intro">
            <h2>Проєктування структури стану (Choosing the State Structure)</h2>
            <p>
              Матеріали за мотивами офіційної документації React. Розглядаємо три найважливіші правила:
              <b> «Уникайте зайвого стану»</b> (обчислюйте значення на льоту),
              <b> «Уникайте суперечливих статусів»</b> (замість 4 прапорців — одна стейт-машина)
              та <b> «Уникайте глибоко вкладеного стану»</b> (нормалізація складних дерев до пласких об'єктів).
            </p>
          </div>

          <div className="examples-grid two-cols" style={{ marginBottom: '1.5rem' }}>
            <RedundantStateDemo />
            <ContradictoryStatusDemo />
          </div>

          <div className="examples-grid">
            <NormalizedTravelPlan />
          </div>
        </section>
      )}

      {/* Вкладка 6: Підняття стану (Lifting State Up) */}
      {activeTab === 'lifting-state' && (
        <section>
          <div className="module-intro">
            <h2>Підняття стану вгору (Lifting State Up)</h2>
            <p>
              Коли кільком дочірнім компонентам потрібен доступ до одних і тих самих даних або вони повинні бути синхронізовані,
              стан видаляють із дочірніх компонентів і <b>піднімають до їхнього найближчого спільного предка (Parent)</b>.
              Батьківський компонент стає єдиним джерелом правди, передаючи дані вниз через <code>props</code>,
              а оновлення отримує через callback-функції.
            </p>
          </div>

          <div className="examples-grid" style={{ gap: '2rem' }}>
            <SimpleTemperatureSync />
            <FormAndPreviewSync />
          </div>
        </section>
      )}

      {/* Вкладка 7: Порівняння */}
      {activeTab === 'comparison' && (
        <section>
          <div className="example-card">
            <h3>Порівняльна таблиця: Controlled vs Uncontrolled</h3>
            <p className="card-subtitle">Як обрати правильний підхід для вашого завдання</p>

            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Критерій / Можливість</th>
                    <th style={{ padding: '0.75rem' }}>Контрольований (Controlled)</th>
                    <th style={{ padding: '0.75rem' }}>Неконтрольований (Uncontrolled)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Джерело правди</td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>React State (useState)</td>
                    <td style={{ padding: '0.75rem', color: '#b45309' }}>Браузерний DOM</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Кількість ре-рендерів</td>
                    <td style={{ padding: '0.75rem' }}>На кожен символ / клік</td>
                    <td style={{ padding: '0.75rem' }}>Тільки при монтуванні або submit</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Миттєва валідація на льоту</td>
                    <td style={{ padding: '0.75rem' }}>✅ Дуже просто реалізувати</td>
                    <td style={{ padding: '0.75rem' }}>❌ Складно (потрібні DOM-події)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Умовне блокування кнопки Submit</td>
                    <td style={{ padding: '0.75rem' }}>✅ <code>disabled=&#123;!isValid&#125;</code></td>
                    <td style={{ padding: '0.75rem' }}>❌ Потребує додаткового коду</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Робота з інпутами типу File</td>
                    <td style={{ padding: '0.75rem' }}>⚠️ Не підтримує value (тільки onChange)</td>
                    <td style={{ padding: '0.75rem' }}>✅ Природно (ref.current.files)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Продуктивність на гігантських формах</td>
                    <td style={{ padding: '0.75rem' }}>Може потребувати оптимізацій</td>
                    <td style={{ padding: '0.75rem' }}>⚡ Максимальна швидкість</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>Популярні бібліотеки в індустрії</td>
                    <td style={{ padding: '0.75rem' }}>Formik, Redux Form</td>
                    <td style={{ padding: '0.75rem' }}>React Hook Form (гібридний/ref)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="theory-callout" style={{ marginTop: '1.5rem' }}>
              <strong>Порада ментора:</strong> Для більшості інтерактивних форм із валідацією полів, залежними селектами та живим відгуком починайте з <b>контрольованого підходу</b>. Якщо форма величезна або є простою статичною анкетою — <b>FormData API</b> чудово заощадить ваш час та пам'ять.
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default App;
