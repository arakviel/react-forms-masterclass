import React, { useRef, useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

/**
 * 1. Неконтрольована форма через useRef
 * Значення зберігаються безпосередньо в DOM.
 * React звертається до них лише в момент необхідності (наприклад, onSubmit) через ref.current.value.
 */
export const UncontrolledWithRefs: React.FC = () => {
  const renderCounter = useRenderCount('UncontrolledWithRefs');

  // Створюємо рефи для кожного елемента вводу
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const roleSelectRef = useRef<HTMLSelectElement>(null);
  const agreementRef = useRef<HTMLInputElement>(null);

  // Стан лише для збереження результату після відправки
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // ⚠️ Завжди викликаємо e.preventDefault(), щоб запобігти перезавантаженню сторінки браузером!
    e.preventDefault();

    const result = {
      name: nameInputRef.current?.value,
      email: emailInputRef.current?.value,
      role: roleSelectRef.current?.value,
      agreement: agreementRef.current?.checked,
      submittedAt: new Date().toLocaleTimeString(),
    };

    setSubmittedData(result);
  };

  const handleReset = () => {
    // Для скидання форми вручну звертаємося до DOM
    if (nameInputRef.current) nameInputRef.current.value = '';
    if (emailInputRef.current) emailInputRef.current.value = '';
    if (roleSelectRef.current) roleSelectRef.current.value = 'student';
    if (agreementRef.current) agreementRef.current.checked = false;
    setSubmittedData(null);
  };

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>1. useRef підхід (Неконтрольований)</h3>
        <span className="tag tag-uncontrolled">Uncontrolled</span>
      </div>
      <p className="card-subtitle">
        Значення зберігаються в DOM. Зверніть увагу: введення тексту <b>не викликає повторний рендер</b>!
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Особливості:</strong>
        <br />• Використовуємо <code>defaultValue</code> або <code>defaultChecked</code> замість <code>value</code>.
        <br />• Доступ до значення: <code>ref.current.value</code>.
        <br />• Ідеально для простих форм, де не потрібна миттєва валідація під час набору.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="unref-name">Ім'я:</label>
          <input
            id="unref-name"
            ref={nameInputRef}
            type="text"
            className="form-input"
            defaultValue="Іван Франко"
            placeholder="Введіть повне ім'я"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unref-email">Email:</label>
          <input
            id="unref-email"
            ref={emailInputRef}
            type="email"
            className="form-input"
            defaultValue="franko@example.com"
            placeholder="email@domain.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unref-role">Роль:</label>
          <select id="unref-role" ref={roleSelectRef} className="form-select" defaultValue="student">
            <option value="student">Студент</option>
            <option value="mentor">Ментор</option>
            <option value="admin">Адміністратор</option>
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input id="unref-agreement" ref={agreementRef} type="checkbox" defaultChecked={true} />
            Погоджуюсь з умовами навчання
          </label>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary">
            Зберегти дані (Submit)
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Очистити
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="preview-box">
          <h4>Отримано при onSubmit (через refs):</h4>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
