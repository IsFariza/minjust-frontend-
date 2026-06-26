import React, { useState } from 'react'
import { registerEmployee } from '../api/authApi'
import { REGISTER_FIELDS } from '../utils/constants'
import { Topbar } from '../components/Topbar'

const emptyRegisterForm = REGISTER_FIELDS.reduce((acc, [name]) => ({ ...acc, [name]: '' }), {})

export function RegisterPage({ onBack, embedded = false }) {
    const [form, setForm] = useState(emptyRegisterForm)
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        setError('')
        setStatus('')
        setLoading(true)

        try {
            await registerEmployee(form)
            setStatus('Учетная запись создана. Теперь можно войти через ИИН и пароль.')
            setForm(emptyRegisterForm)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const content = (
        <form className="register-card" onSubmit={submit}>
            <h1>Создание новой учетной записи</h1>
            <div className="register-grid">
                {REGISTER_FIELDS.map(([name, label, placeholder]) => (
                    <label key={name}>
                        {label}
                        <input
                            autoComplete={name === 'password' ? 'new-password' : 'off'}
                            onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                            placeholder={placeholder}
                            required={['fullname', 'iin', 'position', 'department', 'password'].includes(name)}
                            type={name === 'password' ? 'password' : 'text'}
                            value={form[name]}
                        />
                    </label>
                ))}
            </div>
            {status && <p className="form-success">{status}</p>}
            {error && <p className="form-error">{error}</p>}
            <button className="primary" disabled={loading} type="submit">
                {loading ? 'Создание...' : 'Зарегистрироваться'}
            </button>
        </form>
    )

    if (embedded) {
        return content
    }

    return (
        <main className="page">
            <Topbar onLogout={onBack} onNavigate={(target) => target === 'home' && onBack()} page="register" />
            {content}
        </main>
    )
}