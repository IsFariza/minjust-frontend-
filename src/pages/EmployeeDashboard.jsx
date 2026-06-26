import React, { useEffect, useState } from 'react'
import { getEmployeeProfile, getHandbook } from '../api/employeeApi'
import { createPasswordRequest, getMyRequests } from '../api/requestApi'
import { asArray } from '../utils/helpers'
import { Topbar } from '../components/Topbar'
import { NoticePanel } from '../components/NoticePanel'
import { RegisterPage } from './RegisterPage'
import { ResetPasswordPanel } from '../components/ResetPasswordPanel'
import { ProfilePage } from './ProfilePage'
import { HandbookPage } from './HandbookPage'
import { SupportPage } from './SupportPage'

export function EmployeeDashboard({ auth, onLogout }) {
    const [page, setPage] = useState('home')
    const [profile, setProfile] = useState(null)
    const [requests, setRequests] = useState([])
    const [handbook, setHandbook] = useState([])
    const [loadingHandbook, setLoadingHandbook] = useState(false)
    const [handbookError, setHandbookError] = useState('')

    const loadProfile = async () => {
        const [profileData, requestData] = await Promise.all([
            getEmployeeProfile(auth.token),
            getMyRequests(auth.token),
        ])
        setProfile(profileData)
        setRequests(asArray(requestData))
    }

    const loadHandbook = async () => {
        setLoadingHandbook(true)
        setHandbookError('')
        try {
            setHandbook(asArray(await getHandbook()))
        } catch (err) {
            setHandbookError(err.message)
        } finally {
            setLoadingHandbook(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProfile().catch(() => undefined)
        // Initial employee data is fetched once after the token is available.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (page === 'handbook' && !handbook.length) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadHandbook()
        }
        // Handbook is loaded lazily the first time the user opens that page.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const createRequest = async (systemName, iin) => {
        await createPasswordRequest(auth.token, { system_name: systemName, employee_iin: iin })
        await loadProfile()
    }

    return (
        <main className="page">
            <Topbar onLogout={onLogout} onNavigate={setPage} page={page} role="employee" />
            {page === 'home' && (
                <>
                    <section className="home-actions">
                        <button onClick={() => setPage('register')} type="button">Создание учетной записи</button>
                        <button onClick={() => setPage('reset')} type="button">Сброс пароля</button>
                        <button onClick={() => setPage('handbook')} type="button">Справочник</button>
                    </section>
                    <NoticePanel role="employee" />
                </>
            )}
            {page === 'register' && <RegisterPage embedded onBack={() => setPage('home')} />}
            {page === 'reset' && <ResetPasswordPanel onCreated={createRequest} profile={profile || { iin: auth.username }} />}
            {page === 'profile' && <ProfilePage profile={profile || { iin: auth.username }} refresh={loadProfile} requests={requests} />}
            {page === 'handbook' && <HandbookPage error={handbookError} items={handbook} loading={loadingHandbook} />}
            {page === 'support' && <SupportPage />}
        </main>
    )
}