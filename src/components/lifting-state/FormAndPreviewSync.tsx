import React, { useState } from 'react';
import { useRenderCount } from '../common/useRenderCount';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'mentor';
  bio: string;
}

/**
 * 🧒 Дитина №1: Тільки Форма редагування (Presentation + Input Handling)
 * Компонент не тримає даних самостійно, а транслює зміни нагору.
 */
interface ProfileEditorProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onReset: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange, onReset }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...profile,
      [name]: value,
    });
  };

  return (
    <div style={{ flex: 1, padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h4 style={{ marginBottom: '0.75rem', color: '#1e293b' }}>📝 Компонент: ProfileEditor (Form)</h4>
      
      <div className="form-group">
        <label>Ім'я:</label>
        <input
          name="firstName"
          type="text"
          className="form-input"
          value={profile.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Прізвище:</label>
        <input
          name="lastName"
          type="text"
          className="form-input"
          value={profile.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          name="email"
          type="email"
          className="form-input"
          value={profile.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Роль на платформі:</label>
        <select
          name="role"
          className="form-select"
          value={profile.role}
          onChange={handleChange}
        >
          <option value="student">🎓 Студент курсу</option>
          <option value="mentor">🧑‍🏫 Ментор / Викладач</option>
        </select>
      </div>

      <div className="form-group">
        <label>Коротко про себе:</label>
        <textarea
          name="bio"
          rows={2}
          className="form-textarea"
          value={profile.bio}
          onChange={handleChange}
        />
      </div>

      <button type="button" onClick={onReset} className="btn btn-secondary" style={{ width: '100%' }}>
        Скинути профіль
      </button>
    </div>
  );
};

/**
 * 🧒 Дитина №2: Картка прев'ю профілю (Read-Only Preview)
 * Відображає бейдж користувача в реальному часі. Не має жодного інпуту.
 */
interface ProfileCardPreviewProps {
  profile: UserProfile;
}

const ProfileCardPreview: React.FC<ProfileCardPreviewProps> = ({ profile }) => {
  const isMentor = profile.role === 'mentor';

  return (
    <div
      style={{
        flex: 1,
        padding: '1.25rem',
        borderRadius: '8px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', alignSelf: 'flex-start' }}>
        👁️ Компонент: ProfileCardPreview
      </h4>

      {/* Аватар-бейдж */}
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: isMentor ? 'var(--warning-bg)' : 'var(--primary-light)',
          color: isMentor ? 'var(--warning)' : 'var(--primary)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          marginBottom: '0.75rem',
        }}
      >
        {profile.firstName ? profile.firstName[0].toUpperCase() : '?'}
      </div>

      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
        {profile.firstName || 'Ім\'я'} {profile.lastName || 'Прізвище'}
      </h3>
      <span
        className={`tag ${isMentor ? 'tag-uncontrolled' : 'tag-controlled'}`}
        style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}
      >
        {isMentor ? '🧑‍🏫 Ментор' : '🎓 Студент'}
      </span>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        📧 {profile.email || 'електронна адреса не вказана'}
      </p>

      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--card-bg-subtle)',
          padding: '0.75rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontStyle: profile.bio ? 'normal' : 'italic',
        }}
      >
        "{profile.bio || 'Тут відобразиться біографія...'}"
      </div>
    </div>
  );
};

const initialProfile: UserProfile = {
  firstName: 'Леся',
  lastName: 'Українка',
  email: 'lesia@academy.ua',
  role: 'mentor',
  bio: 'Письменниця, поетеса, викладачка літератури та драматургії.',
};

/**
 * 👨‍👩‍👦 Батьківський компонент (Parent Container)
 * Тримає єдиний стан форми і синхронізує форму редагування та картку візитки.
 */
export const FormAndPreviewSync: React.FC = () => {
  const renderCounter = useRenderCount('FormAndPreviewSync');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>2. Практичний сценарій: Форма + Live Preview картки</h3>
        <span className="tag tag-controlled">Parent State Container</span>
      </div>
      <p className="card-subtitle">
        Типовий UI реальних додатків: ліворуч компонент форми, праворуч компонент попереднього перегляду.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Архітектурна перевага:</strong>
        <br />• <code>ProfileEditor</code> та <code>ProfileCardPreview</code> нічого не знають один про одного (loose coupling / слабка зв'язаність).
        <br />• Їх об'єднує спільний батьківський контейнер, який передає <code>profile</code> та функцію <code>setProfile</code>.
        <br />• Ви можете безболісно винести віджет картки в шапку сайту чи модальне вікно без переписування логіки форми!
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <ProfileEditor
          profile={profile}
          onChange={setProfile}
          onReset={() => setProfile(initialProfile)}
        />
        <ProfileCardPreview profile={profile} />
      </div>
    </div>
  );
};
