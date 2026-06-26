import React from 'react'
import { employeeIin } from '../utils/helpers'
import { RequestTable } from '../components/RequestTable'

export function ProfilePage({ profile, requests, refresh }) {
    return (
        <section className="content-band">
            <h1>Профиль</h1>
            <div className="profile-card">
                {[
                    ['ФИО', profile?.fullname || profile?.full_name],
                    ['ИИН', employeeIin(profile)],
                    ['Позиция', profile?.position],
                    ['Департамент', profile?.department],
                    ['Управление', profile?.management],
                    ['Кабинет', profile?.cabinet],
                    ['Рабочий номер', profile?.phone_work],
                    ['Личный номер', profile?.phone_personal],
                    ['Email', profile?.email],
                ].map(([label, value]) => (
                    <div key={label}>
                        <span>{label}</span>
                        <strong>{value || 'Не указано'}</strong>
                    </div>
                ))}
            </div>
            <div className="section-head">
                <h2>Мои заявки</h2>
                <button className="secondary small" onClick={refresh} type="button">Обновить</button>
            </div>
            <RequestTable items={requests} owner="employee" />
        </section>
    )
}