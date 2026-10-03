import { useRef } from 'react';

/**
 * Хук для підрахунку кількості ре-рендерів компонента.
 * Дуже наочно показує студентам різницю між контрольованими компонентами
 * (які викликають рендер на кожен символ) та неконтрольованими (не рендеряться при введенні).
 */
export function useRenderCount(label: string = 'Компонент') {
  const count = useRef(0);
  count.current += 1;

  return (
    <div className="render-counter" title={`${label} ререндерився стільки разів`}>
      🔄 {label}: рендерів #{count.current}
    </div>
  );
}
