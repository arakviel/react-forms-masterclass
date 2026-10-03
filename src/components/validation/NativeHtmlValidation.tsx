import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

/**
 * 5. Нативна HTML5 валідація
 * Використовує вбудовані браузерні механізми (required, minLength, pattern, type="email" тощо)
 * та нативні спливаючі підказки браузера або перевірку через e.currentTarget.checkValidity().
 */
export const NativeHtmlValidation: React.FC = () => {
  const renderCounter = useRenderCount('NativeHtmlValidation');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Браузер автоматично блокує submit, якщо є порушення required/pattern/min/max.
    // Якщо дійшло сюди — форма валідна!
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setSuccessMessage(`Успішно валідовано! Користувач: ${data.username}, Вік: ${data.age}`);
  };

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>1. Нативна HTML5 валідація</h3>
        <span className="tag tag-validation">HTML5 Built-in</span>
      </div>
      <p className="card-subtitle">
        Використання атрибутів <code>required</code>, <code>minLength</code>, <code>pattern</code>, <code>min/max</code> без сторонніх бібліотек.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Атрибути валідації:</strong>
        <br />• <code>required</code>: поле обов'язкове для заповнення
        <br />• <code>minLength="3" maxLength="20"</code>: обмеження довжини тексту
        <br />• <code>pattern="^[a-zA-Z0-9_]+$"</code>: валідація регулярним виразом
        <br />• <code>min="18" max="100"</code>: числові межі
        <br />• Спробуйте натиснути "Відправити" з пустими або некоректними полями.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nat-username">Нікнейм (3-15 латинських літер або цифр):</label>
          <input
            id="nat-username"
            name="username"
            type="text"
            className="form-input"
            required
            minLength={3}
            maxLength={15}
            pattern="^[a-zA-Z0-9_]+$"
            title="Дозволені лише літери латиниці, цифри та символ підкреслення (від 3 до 15 знаків)"
            placeholder="john_doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nat-email">Email (вбудована валідація email):</label>
          <input
            id="nat-email"
            name="email"
            type="email"
            className="form-input"
            required
            placeholder="student@university.edu"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nat-age">Вік (18 - 99):</label>
          <input
            id="nat-age"
            name="age"
            type="number"
            className="form-input"
            required
            min={18}
            max={99}
            placeholder="21"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nat-url">Портфоліо або GitHub (type="url"):</label>
          <input
            id="nat-url"
            name="website"
            type="url"
            className="form-input"
            placeholder="https://github.com/my-profile"
            required
          />
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary">
            Відправити та перевірити
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="alert-box alert-success">
          ✓ {successMessage}
        </div>
      )}
    </div>
  );
};
