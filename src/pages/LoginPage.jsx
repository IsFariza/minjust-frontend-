import React, { useState } from 'react'
import { login } from '../api/authApi'
import { extractToken } from '../utils/helpers'

export function LoginPage({ onLogin, onGoRegister }) {
    const [role, setRole] = useState('employee')
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await login({ ...form, role })
            const token = extractToken(data)
            if (!token) throw new Error('В ответе сервера не найден токен')
            onLogin({ token, role, username: form.username })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-screen">
            <section className="ministry-title">Министерство юстиции Республики Казахстан</section>
            <form className="auth-card" onSubmit={submit}>
                <h1>Войти</h1>
                <div className="role-switch">
                    <button className={role === 'employee' ? 'selected' : ''} onClick={() => setRole('employee')} type="button">Сотрудник</button>
                    <button className={role === 'admin' ? 'selected' : ''} onClick={() => setRole('admin')} type="button">Модератор</button>
                </div>
                <label>
                    Логин / ИИН
                    <input
                        autoComplete="username"
                        onChange={(event) => setForm({ ...form, username: event.target.value })}
                        required
                        value={form.username}
                    />
                </label>
                <label>
                    Пароль
                    <input
                        autoComplete="current-password"
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        required
                        type="password"
                        value={form.password}
                    />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button className="primary" disabled={loading} type="submit">{loading ? 'Вход...' : 'Войти'}</button>
                {role === 'employee' && (
                    <button className="link-button" onClick={onGoRegister} type="button">
                        Вы новый сотрудник? Зарегистрироваться
                    </button>
                )}
            </form>
        </main>
    )
}