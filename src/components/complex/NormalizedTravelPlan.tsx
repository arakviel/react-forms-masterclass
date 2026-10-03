import React, { useState } from 'react';
import { initialTravelPlan } from './travelPlanData';
import type { TravelPlan, Place } from './travelPlanData';
import { useRenderCount } from '../common/useRenderCount';

/**
 * Окремий вузол дерева (рекурсивний рендеринг за ID)
 */
interface PlaceTreeItemProps {
  id: number;
  parentId: number;
  plan: TravelPlan;
  onComplete: (parentId: number, childId: number) => void;
  onRename: (id: number, newTitle: string) => void;
  onAddChild: (parentId: number, title: string) => void;
}

const PlaceTreeItem: React.FC<PlaceTreeItemProps> = ({
  id,
  parentId,
  plan,
  onComplete,
  onRename,
  onAddChild,
}) => {
  const place = plan[id];
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(place.title);
  const [newChildTitle, setNewChildTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!place) return null;

  const childIds = place.childIds;

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChildTitle.trim()) {
      onAddChild(id, newChildTitle.trim());
      setNewChildTitle('');
      setShowAddForm(false);
    }
  };

  return (
    <li style={{ margin: '0.4rem 0', listStyleType: 'none' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: id === 0 ? 'var(--card-bg-subtle)' : 'var(--card-bg)',
          padding: '0.35rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid var(--border)',
        }}
      >
        {isEditing ? (
          <form
            onSubmit={handleSaveRename}
            style={{ display: 'inline-flex', gap: '0.3rem', alignItems: 'center' }}
          >
            <input
              type="text"
              className="form-input"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem', width: '160px' }}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
              ✓ Зберегти
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => {
                setEditTitle(place.title);
                setIsEditing(false);
              }}
            >
              Скасувати
            </button>
          </form>
        ) : (
          <>
            <span style={{ fontWeight: childIds.length > 0 ? 600 : 400, color: '#1e293b' }}>
              {childIds.length > 0 ? '📁' : '📍'} {place.title}
            </span>

            {/* Дії над вузлом */}
            {id !== 0 && (
              <div style={{ display: 'inline-flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                  title="Перейменувати"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => onComplete(parentId, id)}
                  className="btn btn-danger"
                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                  title="Відвідано / Видалити"
                >
                  Видалити
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="btn btn-secondary"
              style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
              title="Додати під-локацію"
            >
              + Додати
            </button>
          </>
        )}
      </div>

      {/* Форма додавання дочірнього елемента */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          style={{
            display: 'flex',
            gap: '0.3rem',
            margin: '0.35rem 0 0.35rem 1.5rem',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder={`Нова локація в ${place.title}...`}
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem', width: '200px' }}
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
            Додати
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            onClick={() => setShowAddForm(false)}
          >
            ✕
          </button>
        </form>
      )}

      {/* Рекурсивний вивід дочірніх вузлів */}
      {childIds.length > 0 && (
        <ol style={{ paddingLeft: '1.25rem', borderLeft: '2px dashed var(--border)', marginLeft: '0.5rem' }}>
          {childIds.map((childId) => (
            <PlaceTreeItem
              key={childId}
              id={childId}
              parentId={id}
              plan={plan}
              onComplete={onComplete}
              onRename={onRename}
              onAddChild={onAddChild}
            />
          ))}
        </ol>
      )}
    </li>
  );
};

/**
 * 9. Демонстрація теми "Choosing the State Structure":
 * Нормалізація стану (Flat / Normalized State vs Deeply Nested State)
 */
export const NormalizedTravelPlan: React.FC = () => {
  const renderCounter = useRenderCount('NormalizedTravelPlan');
  const [plan, setPlan] = useState<TravelPlan>(initialTravelPlan);

  /**
   * 1. Швидке оновлення поля (Перейменування локації)
   * У нормалізованому стані це робиться за O(1) без рекурсивного перебору всього дерева!
   */
  const handleRename = (id: number, newTitle: string) => {
    setPlan((prevPlan) => ({
      ...prevPlan,
      [id]: {
        ...prevPlan[id],
        title: newTitle,
      },
    }));
  };

  /**
   * 2. Додавання нової локації у дерево
   * Створюємо новий запис за його ID та додаємо ID у батьківський childIds.
   */
  const handleAddChild = (parentId: number, title: string) => {
    const newId = Date.now();
    const newPlace: Place = {
      id: newId,
      title,
      childIds: [],
    };

    setPlan((prevPlan) => {
      const parent = prevPlan[parentId];
      return {
        ...prevPlan,
        // Додаємо новий об'єкт
        [newId]: newPlace,
        // Оновлюємо масив дочірніх id батька
        [parentId]: {
          ...parent,
          childIds: [...parent.childIds, newId],
        },
      };
    });
  };

  /**
   * 3. Видалення локації
   * Видаляємо ID зі списку childIds батька.
   */
  const handleComplete = (parentId: number, childId: number) => {
    setPlan((prevPlan) => {
      const parent = prevPlan[parentId];
      return {
        ...prevPlan,
        [parentId]: {
          ...parent,
          childIds: parent.childIds.filter((id) => id !== childId),
        },
      };
    });
  };

  const handleReset = () => {
    setPlan(initialTravelPlan);
  };

  // Кореневі діти плану (id: 0)
  const rootPlace = plan[0];
  const planetIds = rootPlace ? rootPlace.childIds : [];

  return (
    <div className="example-card" style={{ gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Нормалізація стану: План подорожей (Travel Plan)</h3>
        <span className="tag tag-controlled">Normalized State / React Docs</span>
      </div>
      <p className="card-subtitle">
        Принцип <b>"Avoid deeply nested state"</b> із офіційного підручника React.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Чому нормалізована структура краща за глибоко вкладені об'єкти?</strong>
        <br />
        ❌ <b>Якщо об'єкти вкладені (дерево):</b> для перейменування або видалення потрібна складна рекурсія по всій структурі з копіюванням кожного батьківського рівня (<code>{'{ ...parent, children: parent.children.map(...) }'}</code>).
        <br />
        ✅ <b>Якщо стан плаский (нормалізований):</b> кожен елемент зберігається за ключем-ID <code>Record&lt;number, Place&gt;</code>. Оновлення елемента — це один простий рядок:
        <br />
        <code>
          setPlan(prev =&gt; (&#123; ...prev, [id]: &#123; ...prev[id], title: newTitle &#125; &#125;))
        &#125;</code>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Спробуйте <b>перейменувати</b> (✏️), <b>видалити</b> або <b>додати нову країну/планету</b>.
        </p>
        <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
          🔄 Скинути до початкового плану
        </button>
      </div>

      <div
        style={{
          maxHeight: '450px',
          overflowY: 'auto',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: 'var(--card-bg-subtle)',
        }}
      >
        <ol style={{ paddingLeft: '0.5rem' }}>
          {planetIds.map((id) => (
            <PlaceTreeItem
              key={id}
              id={id}
              parentId={0}
              plan={plan}
              onComplete={handleComplete}
              onRename={handleRename}
              onAddChild={handleAddChild}
            />
          ))}
        </ol>
      </div>

      <div className="preview-box" style={{ marginTop: '1rem' }}>
        <h4>Фрагмент нормалізованого стану в React (перші 3 ключі):</h4>
        <pre>
          {JSON.stringify(
            {
              0: plan[0],
              1: plan[1],
              2: plan[2],
              '...всього_локацій': Object.keys(plan).length,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
