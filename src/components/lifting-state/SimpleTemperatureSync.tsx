import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

/**
 * Дочірній компонент: поле вводу температури в конкретній шкалі.
 * Він НЕ має власного useState. Він є «чисто контрольованим» презентаційним компонентом.
 * Значення та обробник змін він отримує згори через props.
 */
interface TemperatureInputProps {
  scale: 'c' | 'f';
  temperature: string;
  onTemperatureChange: (value: string, scale: 'c' | 'f') => void;
}

const scaleNames = {
  c: 'Цельсій (°C)',
  f: 'Фаренгейт (°F)',
};

const TemperatureInput: React.FC<TemperatureInputProps> = ({
  scale,
  temperature,
  onTemperatureChange,
}) => {
  return (
    <div className="form-group" style={{ flex: 1 }}>
      <label htmlFor={`temp-${scale}`}>Шкала {scaleNames[scale]}:</label>
      <input
        id={`temp-${scale}`}
        type="number"
        className="form-input"
        placeholder="Введіть градуси..."
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value, scale)}
      />
    </div>
  );
};

// Функції конвертації температури
function toCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature: string, convert: (temp: number) => number): string {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 10) / 10;
  return rounded.toString();
}

/**
 * Батьківський компонент: Калькулятор температури (Класичний приклад React Docs).
 *
 * Стан піднято сюди (Lifting State Up).
 * Обидва інпути (Цельсій і Фаренгейт) синхронізовані, бо спираються на єдине спільне джерело правди.
 */
export const SimpleTemperatureSync: React.FC = () => {
  const renderCounter = useRenderCount('SimpleTemperatureSync');

  // Єдине джерело правди: зберігаємо останнє введене значення та в якій шкалі його ввели
  const [temperature, setTemperature] = useState<string>('20');
  const [scale, setScale] = useState<'c' | 'f'>('c');

  const handleTemperatureChange = (newTemp: string, newScale: 'c' | 'f') => {
    setTemperature(newTemp);
    setScale(newScale);
  };

  // Обчислюємо значення для обох інпутів під час рендеру:
  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

  const celsiusNum = parseFloat(celsius);
  const isBoiling = !Number.isNaN(celsiusNum) && celsiusNum >= 100;
  const isFreezing = !Number.isNaN(celsiusNum) && celsiusNum <= 0;

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>1. Простий приклад: Синхронізація інпутів (Температура)</h3>
        <span className="tag tag-controlled">Lifting State Up / Classic</span>
      </div>
      <p className="card-subtitle">
        Два незалежні дочірні інпути відображають одні й ті самі дані в різних одиницях вимірювання.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Суть патерну «Lifting State Up»:</strong>
        <br />• Якщо двом (або більше) дочірнім компонентам потрібні одні й ті самі дані, ми <b>видаляємо внутрішній стан із дітей</b>.
        <br />• Переміщуємо стан у їхнього <b>найближчого спільного батька</b> (Parent).
        <br />• Батько передає дані вниз через <code>props</code> (наприклад, <code>temperature</code>) і передає функцію зворотного виклику (<code>onTemperatureChange</code>).
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={handleTemperatureChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={handleTemperatureChange}
        />
      </div>

      {/* Візуальний вердикт */}
      <div
        className="alert-box"
        style={{
          marginTop: '0.75rem',
          backgroundColor: isBoiling ? '#fee2e2' : isFreezing ? '#e0f2fe' : '#f1f5f9',
          color: isBoiling ? '#991b1b' : isFreezing ? '#0369a1' : '#334155',
          border: '1px solid var(--border)',
        }}
      >
        {isBoiling && '🔥 Вода закипить при цій температурі!'}
        {isFreezing && '❄️ Вода замерзне у лід!'}
        {!isBoiling && !isFreezing && '💧 Вода залишається у рідкому стані.'}
      </div>

      <div className="preview-box" style={{ marginTop: '1rem' }}>
        <h4>Спільний стан у батьківському компоненті:</h4>
        <pre>{JSON.stringify({ rawInput: temperature, activeScale: scale, celsius, fahrenheit }, null, 2)}</pre>
      </div>
    </div>
  );
};
