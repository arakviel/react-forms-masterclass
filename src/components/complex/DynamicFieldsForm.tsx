import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

interface TodoItem {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * 8. Динамічні форми (Dynamic Form Fields / Form Array)
 * Додавання, редагування та видалення полів форми в рантаймі.
 * Типова задача: список телефонів, адрес, досвіду роботи або завдань.
 */
export const DynamicFieldsForm: React.FC = () => {
  const renderCounter = useRenderCount('DynamicFieldsForm');

  const [items, setItems] = useState<TodoItem[]>([
    { id: '1', title: 'Вивчити неконтрольовані форми', priority: 'medium' },
    { id: '2', title: 'Опанувати валідацію в React', priority: 'high' },
  ]);

  const [savedJson, setSavedJson] = useState<string | null>(null);

  // Додавання нового рядка
  const handleAddItem = () => {
    const newItem: TodoItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: '',
      priority: 'medium',
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Видалення рядка за id
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Оновлення конкретного поля елемента масиву
  const handleFieldChange = (id: string, field: keyof TodoItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedJson(JSON.stringify(items, null, 2));
  };

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>2. Динамічні поля (Масив елементів форми)</h3>
        <span className="tag tag-controlled">Dynamic Array</span>
      </div>
      <p className="card-subtitle">
        Динамічне додавання, редагування та видалення полів зі стану списку (масиву).
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Важливі правила масивів у React:</strong>
        <br />• Завжди використовуйте <b>унікальний <code>id</code> як <code>key</code></b>, а НЕ індекс масиву <code>index</code>, щоб уникнути багів при видаленні елементів.
        <br />• Оновлюйте стан імутабельно: <code>prev.map(item =&gt; item.id === id ? &#123; ...item, field: val &#125; : item)</code>.
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: 'var(--card-bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', minWidth: '20px' }}>
                #{index + 1}
              </span>

              <input
                type="text"
                placeholder="Назва завдання / пункту"
                className="form-input"
                style={{ flex: 2 }}
                value={item.title}
                onChange={(e) => handleFieldChange(item.id, 'title', e.target.value)}
                required
              />

              <select
                className="form-select"
                style={{ flex: 1 }}
                value={item.priority}
                onChange={(e) => handleFieldChange(item.id, 'priority', e.target.value)}
              >
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>

              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="btn btn-danger"
                title="Видалити цей пункт"
                style={{ padding: '0.5rem 0.75rem' }}
                disabled={items.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="btn-group">
          <button type="button" onClick={handleAddItem} className="btn btn-secondary">
            + Додати пункт
          </button>
          <button type="submit" className="btn btn-primary">
            Зберегти список
          </button>
        </div>
      </form>

      {savedJson && (
        <div className="preview-box">
          <h4>Збережений масив форми:</h4>
          <pre>{savedJson}</pre>
        </div>
      )}
    </div>
  );
};
