import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

/**
 * Антипатерн 1: «Зайвий / Дублюючий стан» (Redundant / Derived State)
 *
 * ❌ Помилка початківців: зберігати в useState значення, які можна обчислити під час рендеру
 * (наприклад, fullName = firstName + lastName, або totalPrice = items * price, або isValid, charsLeft).
 * Це призводить до синхронізаційних багів, зайвих useEffect і зайвих ре-рендерів.
 */
export const RedundantStateDemo: React.FC = () => {
  const renderCounter = useRenderCount('RedundantStateDemo');

  // Вибір режиму: як роблять з помилкою vs як треба робити
  const [approach, setApproach] = useState<'bad' | 'good'>('bad');

  // Базові вхідні дані форми
  const [firstName, setFirstName] = useState('Тарас');
  const [lastName, setLastName] = useState('Шевченко');
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [ticketPrice] = useState(500); // 500 грн за квиток

  // ❌ АНТИПАТЕРН: окремі useState для похідних значень, які треба постійно синхронізувати!
  const [badFullName, setBadFullName] = useState('Тарас Шевченко');
  const [badTotalPrice, setBadTotalPrice] = useState(1000);

  // Обробники для "поганого" підходу (потрібно не забути оновити похідний стейт!)
  const handleBadFirstNameChange = (val: string) => {
    setFirstName(val);
    setBadFullName(`${val} ${lastName}`); // Легко забути або зробити розсинхрон!
  };

  const handleBadLastNameChange = (val: string) => {
    setLastName(val);
    setBadFullName(`${firstName} ${val}`);
  };

  const handleBadQuantityChange = (qty: number) => {
    setTicketQuantity(qty);
    setBadTotalPrice(qty * ticketPrice);
  };

  // ✅ ПРАВИЛЬНИЙ ПІДХІД (Derived State):
  // Жодного зайвого useState чи useEffect! Обчислюється миттєво під час рендеру:
  const goodFullName = `${firstName} ${lastName}`.trim();
  const goodTotalPrice = ticketQuantity * ticketPrice;
  const charsRemaining = 30 - goodFullName.length;
  const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0 && ticketQuantity > 0;

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>1. Зайвий стан (Derived vs Redundant State)</h3>
        <span className="tag" style={{ background: '#fee2e2', color: '#991b1b' }}>Anti-pattern & Solution</span>
      </div>
      <p className="card-subtitle">
        Принцип React Docs: <b>«Don't put in state what you can calculate during render»</b>.
      </p>

      {renderCounter}

      {/* Перемикач підходів */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setApproach('bad')}
          className={`btn ${approach === 'bad' ? 'btn-danger' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem' }}
        >
          ❌ Як роблять з помилкою (Bad)
        </button>
        <button
          type="button"
          onClick={() => setApproach('good')}
          className={`btn ${approach === 'good' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem' }}
        >
          ✅ Як рекомендує React Docs (Good)
        </button>
      </div>

      {approach === 'bad' ? (
        <div className="theory-callout" style={{ borderLeft: '4px solid #ef4444' }}>
          <strong>❌ Антипатерн (Redundant State):</strong>
          <br />• <code>const [fullName, setFullName] = useState(...)</code>
          <br />• <code>const [totalPrice, setTotalPrice] = useState(...)</code>
          <br />⚠️ <b>Проблема:</b> якщо оновити <code>firstName</code>, але забути вручну оновити <code>fullName</code> (або через затримку в <code>useEffect</code>), дані в інтерфейсі стануть суперечливими (розсинхронізуються).
        </div>
      ) : (
        <div className="theory-callout" style={{ borderLeft: '4px solid #10b981' }}>
          <strong>✅ Правильно (Похідний стан під час рендеру):</strong>
          <br />• <code>const fullName = firstName + ' ' + lastName;</code>
          <br />• <code>const totalPrice = ticketQuantity * ticketPrice;</code>
          <br />💡 <b>Перевага:</b> 0% ймовірності розсинхронізації, немає зайвих викликів <code>setState</code>, менше коду, не потрібен <code>useEffect</code>.
        </div>
      )}

      {/* Поля вводу */}
      <div className="form-group">
        <label>Ім'я:</label>
        <input
          type="text"
          className="form-input"
          value={firstName}
          onChange={(e) =>
            approach === 'bad'
              ? handleBadFirstNameChange(e.target.value)
              : setFirstName(e.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>Прізвище:</label>
        <input
          type="text"
          className="form-input"
          value={lastName}
          onChange={(e) =>
            approach === 'bad'
              ? handleBadLastNameChange(e.target.value)
              : setLastName(e.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>Кількість квитків (ціна {ticketPrice} грн/шт):</label>
        <input
          type="number"
          min={1}
          max={10}
          className="form-input"
          value={ticketQuantity}
          onChange={(e) =>
            approach === 'bad'
              ? handleBadQuantityChange(Number(e.target.value))
              : setTicketQuantity(Number(e.target.value))
          }
        />
      </div>

      {/* Підсумок */}
      <div style={{ background: 'var(--card-bg-subtle)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Результат у формі:</h4>
        <p style={{ fontSize: '0.9rem' }}>
          Повне ім'я: <b>{approach === 'bad' ? badFullName : goodFullName}</b>
        </p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Загальна сума: <b>{approach === 'bad' ? badTotalPrice : goodTotalPrice} грн</b>
        </p>
        <p style={{ fontSize: '0.85rem', color: charsRemaining < 0 ? 'var(--error)' : 'var(--text-muted)', marginTop: '0.25rem' }}>
          Залишилось символів для бейджа: <b>{charsRemaining}</b> (обчислено на льоту)
        </p>
        <p style={{ fontSize: '0.85rem', color: isFormValid ? 'var(--success)' : 'var(--error)', marginTop: '0.25rem' }}>
          Статус валідності форми: <b>{isFormValid ? '✓ Валідна' : '✗ Заповніть усі поля'}</b>
        </p>
      </div>
    </div>
  );
};
