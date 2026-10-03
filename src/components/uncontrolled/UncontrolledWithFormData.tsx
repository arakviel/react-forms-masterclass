import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

/**
 * 2. Неконтрольована форма через браузерний FormData API
 * Не потребує створення десятків ref-ів! Використовує нативні імена полів `name="..."`.
 * Сучасний стандартний спосіб роботи з формами у ванільному JS та в React Server Actions.
 */
export const UncontrolledWithFormData: React.FC = () => {
  const renderCounter = useRenderCount('UncontrolledWithFormData');
  const [formDataSummary, setFormDataSummary] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Створюємо FormData на основі DOM-елемента форми (e.currentTarget)
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Спосіб 1: Отримання конкретних значень
    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;
    const track = formData.get('track') as string;
    const notifications = formData.get('notifications') === 'on';

    // Спосіб 2: Перетворення всіх полів у звичайний JavaScript-об'єкт
    const allFields = Object.fromEntries(formData.entries());

    // Для полів з однаковим name (наприклад, чекбокси-набір) використовують formData.getAll()
    const selectedHobbies = formData.getAll('hobbies') as string[];

    setFormDataSummary({
      individualRead: { username, bio, track, notifications },
      selectedHobbies,
      allFieldsAsObject: allFields,
      submittedAt: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>2. FormData API підхід</h3>
        <span className="tag tag-uncontrolled">Uncontrolled / Modern</span>
      </div>
      <p className="card-subtitle">
        Без жодного <code>useState</code> чи <code>useRef</code> для кожного інпуту. Отримання значень через нативний <code>FormData</code>.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Головне правило:</strong>
        <br />• Кожен інпут <b>обов'язково повинен мати атрибут <code>name</code></b>!
        <br />• <code>formData.get('fieldName')</code> повертає одне значення.
        <br />• <code>formData.getAll('fieldName')</code> збирає масив значень (для мультиселектів або групи чекбоксів).
        <br />• <code>Object.fromEntries(formData)</code> швидко конвертує форму в об'єкт.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fd-username">Нікнейм (name="username"):</label>
          <input
            id="fd-username"
            name="username"
            type="text"
            className="form-input"
            defaultValue="taras_dev"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fd-bio">Про себе (name="bio"):</label>
          <textarea
            id="fd-bio"
            name="bio"
            rows={2}
            className="form-textarea"
            defaultValue="Вивчаю сучасний фронтенд та React."
          />
        </div>

        <div className="form-group">
          <label htmlFor="fd-track">Напрямок (name="track"):</label>
          <select id="fd-track" name="track" className="form-select" defaultValue="react">
            <option value="react">React / Frontend</option>
            <option value="node">Node.js / Backend</option>
            <option value="fullstack">Fullstack TS</option>
          </select>
        </div>

        <div className="form-group">
          <label>Інтереси (name="hobbies" у кількох чекбоксів):</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="hobbies" value="coding" defaultChecked />
              Програмування
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="hobbies" value="gaming" defaultChecked />
              Ігри
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="hobbies" value="travel" />
              Подорожі
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" name="notifications" defaultChecked />
            Отримувати сповіщення на пошту (name="notifications")
          </label>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary">
            Зчитати через new FormData()
          </button>
          <button type="reset" className="btn btn-secondary">
            Очистити форму (type="reset")
          </button>
        </div>
      </form>

      {formDataSummary && (
        <div className="preview-box">
          <h4>Зчитані дані через FormData:</h4>
          <pre>{JSON.stringify(formDataSummary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
