import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

// ✅ Правильний підхід: дискриміноване об'єднання станів (State Machine)
type FormStatus = 'typing' | 'submitting' | 'success' | 'error';

/**
 * Антипатерн 2: «Суперечливі булеві прапорці» (Contradictory / Impossible States)
 *
 * ❌ Помилка початківців: створювати купу незалежних useState:
 * const [isTyping, setIsTyping] = useState(true);
 * const [isSubmitting, setIsSubmitting] = useState(false);
 * const [isSuccess, setIsSuccess] = useState(false);
 * const [isError, setIsError] = useState(false);
 *
 * Це створює "неможливі стани", коли, наприклад, isSuccess === true І isError === true одночасно,
 * якщо розробник забув скинути один із прапорців при помилці.
 */
export const ContradictoryStatusDemo: React.FC = () => {
  const renderCounter = useRenderCount('ContradictoryStatusDemo');

  // Введення повідомлення
  const [message, setMessage] = useState('');

  // ❌ АНТИПАТЕРН: окремі незалежні булеві прапорці
  const [badIsSubmitting, setBadIsSubmitting] = useState(false);
  const [badIsSuccess, setBadIsSuccess] = useState(false);
  const [badIsError, setBadIsError] = useState(false);

  // ✅ ПРАВИЛЬНИЙ ПІДХІД: одна змінна статусу з вичерпним переліком (State Machine)
  const [goodStatus, setGoodStatus] = useState<FormStatus>('typing');
  const [errorMessage, setErrorMessage] = useState('');

  // Симуляція відправки запиту на сервер
  const simulateApiCall = (text: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Якщо повідомлення містить слово "помилка", кидаємо помилку
        if (text.toLowerCase().includes('помилка') || text.trim().length === 0) {
          reject(new Error('Сервер відхилив повідомлення! Текст містить помилку або пустий.'));
        } else {
          resolve(true);
        }
      }, 1200);
    });
  };

  /**
   * ❌ Поганий хендлер: якщо забути setBadIsSuccess(false),
   * обидва прапорці badIsSuccess і badIsError стануть true!
   */
  const handleBadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBadIsSubmitting(true);

    try {
      await simulateApiCall(message);
      setBadIsSuccess(true);
      // Типовий людський баг: забули написати setBadIsError(false)!
    } catch {
      setBadIsError(true);
      // Типовий людський баг: забули скинути setBadIsSuccess(false)!
    } finally {
      setBadIsSubmitting(false);
    }
  };

  /**
   * ✅ Правильний хендлер: статус може бути ТІЛЬКИ ОДНИМ у будь-який момент часу!
   */
  const handleGoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoodStatus('submitting');
    setErrorMessage('');

    try {
      await simulateApiCall(message);
      setGoodStatus('success');
    } catch (err: unknown) {
      setGoodStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Сталася невідома помилка');
    }
  };

  // Кнопка спеціально створює "баг неможливого стану" для демонстрації студентам
  const triggerImpossibleStateBug = () => {
    setBadIsSuccess(true);
    setBadIsError(true);
    setBadIsSubmitting(false);
  };

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>2. Суперечливі статуси (Contradictory State)</h3>
        <span className="tag" style={{ background: '#fee2e2', color: '#991b1b' }}>Anti-pattern & Solution</span>
      </div>
      <p className="card-subtitle">
        Принцип React Docs: <b>«Avoid contradictory and impossible states»</b>.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Чому 4 булеві прапорці — це бомба сповільненої дії?</strong>
        <br />4 незалежні булеві змінні (<code>isTyping, isSubmitting, isSuccess, isError</code>) створюють <b>2⁴ = 16 можливих комбінацій</b>, більшість із яких є абсурдними (наприклад: і успіх, і помилка одночасно).
        <br /><b>Рішення:</b> стейт-машина з одним полем: <code>status: 'typing' | 'submitting' | 'success' | 'error'</code>.
      </div>

      <div className="form-group">
        <label>Текст відгуку / звернення (напишіть слово <i>"помилка"</i> для симуляції збою):</label>
        <input
          type="text"
          className="form-input"
          placeholder="Напишіть відгук..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (goodStatus !== 'typing') setGoodStatus('typing');
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        {/* Блок 1: Поганий спосіб */}
        <div style={{ border: '1px solid var(--error-border)', borderRadius: '8px', padding: '0.75rem', background: 'var(--error-bg)' }}>
          <h4 style={{ color: 'var(--error)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            ❌ Окремі булеві прапорці
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            isSubmitting: <b>{String(badIsSubmitting)}</b> | isSuccess: <b>{String(badIsSuccess)}</b> | isError: <b>{String(badIsError)}</b>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={handleBadSubmit}
              disabled={badIsSubmitting}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              {badIsSubmitting ? 'Відправка...' : 'Відправити (Bad)'}
            </button>
            <button
              type="button"
              onClick={triggerImpossibleStateBug}
              className="btn btn-danger"
              style={{ fontSize: '0.75rem', padding: '0.3rem' }}
            >
              Зламати: викликати баг (Success + Error)
            </button>
          </div>

          {badIsSuccess && (
            <div className="alert-box alert-success" style={{ marginTop: '0.5rem', padding: '0.4rem', fontSize: '0.75rem' }}>
              ✓ Повідомлення надіслано успішно!
            </div>
          )}
          {badIsError && (
            <div className="alert-box alert-error" style={{ marginTop: '0.5rem', padding: '0.4rem', fontSize: '0.75rem' }}>
              ✗ Помилка відправки!
            </div>
          )}
        </div>

        {/* Блок 2: Правильний спосіб */}
        <div style={{ border: '1px solid var(--success-border)', borderRadius: '8px', padding: '0.75rem', background: 'var(--success-bg)' }}>
          <h4 style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            ✅ Єдиний статус (State Machine)
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            status: <b>"{goodStatus}"</b> (неможливий стан фізично виключений типізацією!)
          </p>

          <button
            type="button"
            onClick={handleGoodSubmit}
            disabled={goodStatus === 'submitting'}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', width: '100%' }}
          >
            {goodStatus === 'submitting' ? 'Відправка...' : 'Відправити (Good)'}
          </button>

          {goodStatus === 'success' && (
            <div className="alert-box alert-success" style={{ marginTop: '0.5rem', padding: '0.4rem', fontSize: '0.75rem' }}>
              ✓ Успіх! Гарантовано без суперечливих станів.
            </div>
          )}
          {goodStatus === 'error' && (
            <div className="alert-box alert-error" style={{ marginTop: '0.5rem', padding: '0.4rem', fontSize: '0.75rem' }}>
              ✗ {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
