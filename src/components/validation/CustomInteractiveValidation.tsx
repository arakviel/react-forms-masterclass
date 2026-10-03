import React, { useState } from 'react'
import { useRenderCount } from '../common/useRenderCount'

interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  age: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  age?: string
}

interface FormTouched {
  name?: boolean
  email?: boolean
  password?: boolean
  confirmPassword?: boolean
  age?: boolean
}

/**
 * 6. Кастомна валідація в React: концепції Touched, Blur, Change та Submit валідації.
 * Це основа того, як під капотом працюють Formik, React Hook Form або інші бібліотеки.
 */
export const CustomInteractiveValidation: React.FC = () => {
  const renderCounter = useRenderCount('CustomInteractiveValidation')

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
  })

  // Об'єкт помилок для кожного поля
  const [errors, setErrors] = useState<FormErrors>({})

  // Прапорці: чи взаємодіяв користувач із полем (onBlur)
  // Важливо показувати помилки тільки після того, як користувач покинув поле або натиснув Submit,
  // щоб не дратувати червоними помилками до початку вводу.
  const [touched, setTouched] = useState<FormTouched>({})

  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false)

  /**
   * Чиста функція валідації поля
   */
  const validateField = (name: keyof FormValues, value: string, currentValues: FormValues): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return "Ім'я є обов'язковим"
        if (value.trim().length < 2) return "Ім'я повинно містити мінімум 2 символи"
        return undefined

      case 'email':
        if (!value.trim()) return "Email є обов'язковим"
        // Проста перевірка формату email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Введіть коректний email (напр. user@test.com)'
        }
        return undefined

      case 'password':
        if (!value) return "Пароль є обов'язковим"
        if (value.length < 6) return 'Пароль повинен бути не менше 6 символів'
        if (!/\d/.test(value)) return 'Пароль повинен містити хоча б одну цифру'
        return undefined

      case 'confirmPassword':
        if (!value) return "Підтвердження пароля обов'язкове"
        if (value !== currentValues.password) return 'Паролі не збігаються'
        return undefined

      case 'age': {
        if (!value) return "Вік є обов'язковим"
        const numAge = Number(value)
        if (isNaN(numAge) || numAge < 16 || numAge > 100) {
          return 'Вік повинен бути числом від 16 до 100'
        }
        return undefined
      }

      default:
        return undefined
    }
  }

  /**
   * Загальна валідація всієї форми
   */
  const validateAll = (currentValues: FormValues): FormErrors => {
    const newErrors: FormErrors = {}
    ;(Object.keys(currentValues) as Array<keyof FormValues>).forEach((field) => {
      const err = validateField(field, currentValues[field], currentValues)
      if (err) newErrors[field] = err
    })
    return newErrors
  }

  /**
   * Обробка зміни значення: оновлюємо state та перевіряємо помилку, якщо поле вже було touched
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof FormValues

    const updatedValues = { ...values, [fieldName]: value }
    setValues(updatedValues)

    // Якщо поле вже зачіпали — валідуємо на льоту
    if (touched[fieldName]) {
      const errorMsg = validateField(fieldName, value, updatedValues)
      setErrors((prev) => ({
        ...prev,
        [fieldName]: errorMsg,
      }))
    }

    // Якщо змінюється пароль, треба також перевірити confirmPassword, якщо воно touched
    if (fieldName === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', values.confirmPassword, updatedValues),
      }))
    }
  }

  /**
   * onBlur: користувач вийшов із фокусу поля
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof FormValues

    setTouched((prev) => ({ ...prev, [fieldName]: true }))

    const errorMsg = validateField(fieldName, value, values)
    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Позначаємо всі поля як touched
    const allTouched: FormTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      age: true,
    }
    setTouched(allTouched)

    const formErrors = validateAll(values)
    setErrors(formErrors)

    const hasErrors = Object.keys(formErrors).length > 0
    if (hasErrors) {
      setSubmittedSuccess(false)
      return
    }

    setSubmittedSuccess(true)
  }

  return (
    <div className="example-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>2. Кастомна валідація (Touched + Blur + Real-time)</h3>
        <span className="tag tag-validation">Custom UI Validation</span>
      </div>
      <p className="card-subtitle">
        Золотий стандарт UX: помилка показується після того, як користувач покинув поле (<code>onBlur</code>), або при
        відправці (<code>onSubmit</code>).
      </p>

      {renderCounter}

      <div className="theory-callout">
        <strong>Ключові концепції валідації:</strong>
        <br />• <b>Touched</b>: чи торкався користувач поля? Не показуємо помилки завчасно.
        <br />• <b>Dirty</b>: чи змінилось значення поля від початкового.
        <br />• <b>Залежна валідація</b>: наприклад, поле підтвердження пароля залежить від першого пароля.
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="cv-name">Ім'я:</label>
          <input
            id="cv-name"
            name="name"
            type="text"
            className={`form-input ${touched.name && errors.name ? 'is-invalid' : ''}`}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Тарас Шевченко"
          />
          {touched.name && errors.name && <div className="error-message">⚠️ {errors.name}</div>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="cv-email">Email адреса:</label>
          <input
            id="cv-email"
            name="email"
            type="email"
            className={`form-input ${touched.email && errors.email ? 'is-invalid' : ''}`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="taras@example.ua"
          />
          {touched.email && errors.email && <div className="error-message">⚠️ {errors.email}</div>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="cv-pass">Пароль (мін. 6 знаків + цифра):</label>
          <input
            id="cv-pass"
            name="password"
            type="password"
            className={`form-input ${touched.password && errors.password ? 'is-invalid' : ''}`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••"
          />
          {touched.password && errors.password && <div className="error-message">⚠️ {errors.password}</div>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="cv-cpass">Підтвердіть пароль:</label>
          <input
            id="cv-cpass"
            name="confirmPassword"
            type="password"
            className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••"
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <div className="error-message">⚠️ {errors.confirmPassword}</div>
          )}
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="cv-age">Вік (від 16 до 100):</label>
          <input
            id="cv-age"
            name="age"
            type="number"
            className={`form-input ${touched.age && errors.age ? 'is-invalid' : ''}`}
            value={values.age}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="25"
          />
          {touched.age && errors.age && <div className="error-message">⚠️ {errors.age}</div>}
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary">
            Перевірити та зареєструвати
          </button>
        </div>
      </form>

      {submittedSuccess && (
        <div className="alert-box alert-success">
          ✓ Усі дані успішно пройшли кастомну валідацію! Форма готова до відправки на сервер.
        </div>
      )}

      <div className="preview-box">
        <h4>Стан валідації (Touched & Errors):</h4>
        <pre>
          {JSON.stringify(
            {
              touched,
              errors,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  )
}
