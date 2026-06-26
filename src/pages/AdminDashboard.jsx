import React, { useEffect, useState } from 'react'
import { getAllRequests, reviewRequest } from '../api/requestApi'
import { asArray } from '../utils/helpers'
import { Topbar } from '../components/Topbar'
import { RequestTable } from '../components/RequestTable'
import { NoticePanel } from '../components/NoticePanel'
import { SupportPage } from './SupportPage'

export function AdminDashboard({ auth, onLogout }) {
    const [page, setPage] = useState('home')
    const [requests, setRequests] = useState([])
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const loadRequests = async () => {
        setError('')
        try {
            setRequests(asArray(await getAllRequests(auth.token)))
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRequests()
        // Initial admin queue is fetched once after login.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const approve = async (id) => {
        await reviewRequest(auth.token, id, { status: 'approved' })
        setMessage(`Заявка ${id} одобрена.`)
        await loadRequests()
    }

    const reject = async (id, rejectionReason) => {
        await reviewRequest(auth.token, id, { status: 'rejected', rejection_reason: rejectionReason })
        setMessage(`Заявка ${id} отклонена.`)
        await loadRequests()
    }

    return (
        <main className="page">
            <Topbar onLogout={onLogout} onNavigate={setPage} page={page} role="admin" />
            {page === 'home' && (
                <section className="content-band admin-band">
                    <div className="section-head">
                        <h1>Заявки на сброс пароля</h1>
                        <button className="secondary small" onClick={loadRequests} type="button">Обновить</button>
                    </div>
                    {message && <p className="form-success">{message}</p>}
                    {error && <p className="form-error">{error}</p>}
                    <RequestTable items={requests} onApprove={approve} onReject={reject} owner="admin" />
                    <NoticePanel role="admin" />
                </section>
            )}
            {page === 'support' && <SupportPage />}
        </main>
    )
}