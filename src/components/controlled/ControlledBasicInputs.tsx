import React, { useState } from 'react'
import { useRenderCount } from '../common/useRenderCount'

/**
 * 3. Базові контрольовані елементи форми:
 * text input, number input, textarea, select, single checkbox, radio buttons
 *
 * У контрольованому підході єдиним джерелом правди (Single Source of Truth) є стан React (useState).
 * Кожен символ або зміна оновлює state, що спричиняє повторний рендер компонента.
 */
export const ControlledBasicInputs: React.FC = () => {
  const renderCounter = useRenderCount('ControlledBasicInputs')

  // Окремі стейти під різні типи інпутів
  const [text, setText] = useState<string>('Привіт, React!')
  const [age, setAge] = useState<number>(20)
  const [bio, setBio] = useState<string>('Студент курсу програмування')
  const [country, setCountry] = useState<string>('UA')
  const [subscribe, setSubscribe] = useState<boolean>(true)
  const [experienceLevel, setExperienceLevel] = useState<'junior' | 'middle' | 'senior'>('junior')

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Базові елементи введення (Controlled)</h3>
        <span className="tag tag-controlled">Controlled</span>
      </div>
      <p className="card-subtitle">
        React керує кожним інпутом через пари <code>value</code> + <code>onChange</code> (або <code>checked</code> +{' '}
        <code>onChange</code>).
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Зверніть увагу:</strong>
        <br />• Текстові поля: <code>value={'{text}'}</code> + <code>onChange={'(e) => setText(e.target.value)'}</code>
        <br />• Числа: перетворюємо рядок через <code>Number(e.target.value)</code> або{' '}
        <code>e.target.valueAsNumber</code>
        <br />• Чекбокси: <code>checked={'{subscribe}'}</code> +{' '}
        <code>onChange={'(e) => setSubscribe(e.target.checked)'}</code> (НЕ <code>target.value</code>!)
        <br />• Радіо кнопки: <code>checked={"{experienceLevel === 'junior'}"}</code>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Текстовий інпут */}
        <div className="form-group">
          <label htmlFor="basic-text">Текстове поле (Text):</label>
          <input
            id="basic-text"
            type="text"
            className="form-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <span className="form-hint">Символів: {text.length}</span>
        </div>

        {/* Числовий інпут */}
        <div className="form-group">
          <label htmlFor="basic-age">Числове поле (Number):</label>
          <input
            id="basic-age"
            type="number"
            className="form-input"
            value={age}
            min={0}
            max={120}
            onChange={(e) => setAge(+e.target.value)}
          />
        </div>

        {/* Багаторядковий текст */}
        <div className="form-group">
          <label htmlFor="basic-bio">Багаторядкове поле (Textarea):</label>
          <textarea
            id="basic-bio"
            rows={2}
            className="form-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Випадаючий список */}
        <div className="form-group">
          <label htmlFor="basic-country">Селект (Select):</label>
          <select
            id="basic-country"
            className="form-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="UA">🇺🇦 Україна</option>
            <option value="PL">🇵🇱 Польща</option>
            <option value="DE">🇩🇪 Німеччина</option>
            <option value="US">🇺🇸 США</option>
          </select>
        </div>

        {/* Одиночний Чекбокс */}
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} />
            Підписатися на оновлення (Checkbox <code>checked</code>)
          </label>
        </div>

        {/* Група радіо-кнопок */}
        <div className="form-group">
          <label>Рівень досвіду (Radio Buttons):</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="level"
                value="junior"
                checked={experienceLevel === 'junior'}
                onChange={(e) => setExperienceLevel(e.target.value as 'junior')}
              />
              Junior
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="level"
                value="middle"
                checked={experienceLevel === 'middle'}
                onChange={(e) => setExperienceLevel(e.target.value as 'middle')}
              />
              Middle
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="level"
                value="senior"
                checked={experienceLevel === 'senior'}
                onChange={(e) => setExperienceLevel(e.target.value as 'senior')}
              />
              Senior
            </label>
          </div>
        </div>
      </form>

      {/* Живий стан */}
      <div className="preview-box">
        <h4>Поточний стан форми у React (State):</h4>
        <pre>
          {JSON.stringify(
            {
              text,
              age,
              bio,
              country,
              subscribe,
              experienceLevel,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  )
}
