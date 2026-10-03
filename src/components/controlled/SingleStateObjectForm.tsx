import React, { useState } from 'react'
import { useRenderCount } from '../common/useRenderCount'

/**
 * Типізація стану форми
 */
interface RegistrationFormState {
  fullName: string
  email: string
  department: string
  experienceYears: number
  acceptTerms: boolean
  skills: string[] // масив обраних чекбоксів
}

const AVAILABLE_SKILLS = ['TypeScript', 'React', 'Node.js', 'Docker', 'GraphQL']

/**
 * 4. Управління формою з багатьма полями через один спільний об'єкт стану
 * Замість створення 10 окремих useState, використовуємо один об'єкт та
 * універсальний обробник handleChange з обчислювальними властивостями [name]: value.
 */
export const SingleStateObjectForm: React.FC = () => {
  const renderCounter = useRenderCount('SingleStateObjectForm')

  const [formData, setFormData] = useState<RegistrationFormState>({
    fullName: '',
    email: '',
    department: 'frontend',
    experienceYears: 1,
    acceptTerms: false,
    skills: ['TypeScript'],
  })

  const [submittedJson, setSubmittedJson] = useState<string | null>(null)

  /**
   * Універсальний обробник для текстових інпутів, селектів і простих чекбоксів
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Специфічна поведінка для checkbox
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
      return
    }

    // Специфічна поведінка для number
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }))
      return
    }

    // Звичайні текстові або select поля
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /**
   * Обробник для списку чекбоксів (масив)
   */
  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const isSelected = prev.skills.includes(skill)
      console.log(skill, ' ', isSelected)
      const updatedSkills = isSelected ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]

      return {
        ...prev,
        skills: updatedSkills,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedJson(JSON.stringify(formData, null, 2))
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      department: 'frontend',
      experienceYears: 1,
      acceptTerms: false,
      skills: [],
    })
    setSubmittedJson(null)
  }

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Один об'єкт стану для всієї форми</h3>
        <span className="tag tag-controlled">Controlled / Best Practice</span>
      </div>
      <p className="card-subtitle">
        Як масштабувати контрольовані форми: єдиний стейт-об'єкт та універсальний <code>handleChange</code> за назвою{' '}
        <code>name</code>.
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Паттерн:</strong>
        <br />
        <code>setFormData(prev =&gt; (&#123; ...prev, [e.target.name]: value &#125;))</code>
        <br />
        Також показано правильну роботу з масивом обраних опцій (група чекбоксів).
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="so-name">Повне ім'я:</label>
          <input
            id="so-name"
            name="fullName"
            type="text"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Олена Коваль"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="so-email">Корпоративний Email:</label>
          <input
            id="so-email"
            name="email"
            type="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="olena@company.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="so-dept">Відділ:</label>
          <select
            id="so-dept"
            name="department"
            className="form-select"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="frontend">Frontend Engineering</option>
            <option value="backend">Backend Engineering</option>
            <option value="qa">Quality Assurance</option>
            <option value="devops">DevOps & Cloud</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="so-exp">Років комерційного досвіду:</label>
          <input
            id="so-exp"
            name="experienceYears"
            type="number"
            min={0}
            max={30}
            className="form-input"
            value={formData.experienceYears}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Технічні навички (Multi-checkbox):</label>
          <div className="checkbox-group">
            {AVAILABLE_SKILLS.map((skill) => (
              <label key={skill} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />Я
            погоджуюсь на обробку персональних даних
          </label>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={!formData.acceptTerms}>
            Зареєструвати
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Скинути стан
          </button>
        </div>
      </form>

      {submittedJson && (
        <div className="preview-box">
          <h4>Дані відправлено (handleSubmit):</h4>
          <pre>{submittedJson}</pre>
        </div>
      )}
    </div>
  )
}
