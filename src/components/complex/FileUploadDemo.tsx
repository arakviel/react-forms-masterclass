import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

/**
 * 7. Завантаження файлів (File Inputs)
 * Особливість: інпути type="file" у React ЗАВЖДИ є неконтрольованими щодо атрибута value,
 * оскільки браузер не дозволяє програмно призначати path з міркувань безпеки.
 * Для них використовують або e.target.files у onChange, або ref.current.files.
 */
export const FileUploadDemo: React.FC = () => {
  const renderCounter = useRenderCount('FileUploadDemo');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 2; // Ліміт 2MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;

    if (!files || files.length === 0) {
      setSelectedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    const file = files[0];

    // Валідація розміру
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`Файл занадто великий! Максимум ${MAX_FILE_SIZE_MB}MB.`);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      e.target.value = ''; // очищаємо інпут
      return;
    }

    // Валідація типу файлу
    if (!file.type.startsWith('image/')) {
      setFileError('Дозволені лише графічні файли (png, jpg, webp, svg)!');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    // Створюємо тимчасовий Object URL для попереднього перегляду
    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);
  };

  const handleClear = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl); // очищення пам'яті
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setFileError(null);
  };

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>1. Робота з файлами (type="file")</h3>
        <span className="tag tag-controlled">File & Preview</span>
      </div>
      <p className="card-subtitle">
        <code>&lt;input type="file"&gt;</code> завжди неконтрольований по <code>value</code>. Отримуємо файл через <code>e.target.files[0]</code>.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Важливі правила роботи з файлами:</strong>
        <br />• Ніколи не передавайте <code>value={'{file}'}</code> в інпут файлу (викличе помилку React).
        <br />• Валідуйте <code>file.size</code> та <code>file.type</code> безпосередньо в <code>onChange</code>.
        <br />• Для прев'ю зображень використовуйте <code>URL.createObjectURL(file)</code> або <code>FileReader</code>.
      </div>

      <div className="form-group">
        <label htmlFor="file-input">Виберіть аватарку (зображення до 2MB):</label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="form-input"
          onChange={handleFileChange}
        />
        {fileError && <div className="error-message">⚠️ {fileError}</div>}
      </div>

      {selectedFile && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
          <h4>Інформація про файл:</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Назва: <b>{selectedFile.name}</b><br />
            Розмір: <b>{(selectedFile.size / 1024).toFixed(1)} KB</b><br />
            MIME-тип: <b>{selectedFile.type}</b>
          </p>

          {filePreviewUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Попередній перегляд:</span>
              <br />
              <img
                src={filePreviewUrl}
                alt="Попередній перегляд"
                style={{ maxHeight: '120px', borderRadius: '6px', marginTop: '0.5rem', objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ marginTop: '0.75rem' }}>
            <button type="button" onClick={handleClear} className="btn btn-secondary">
              Видалити файл
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
