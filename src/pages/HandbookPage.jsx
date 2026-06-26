import React from 'react'

export function HandbookPage({ items, loading, error }) {
    return (
        <section className="content-band">
            <h1>Справочник</h1>
            {loading && <p className="muted">Загрузка справочника...</p>}
            {error && <p className="form-error">{error}</p>}
            <div className="handbook-list">
                {items.map((person, index) => (
                    <article className="person-card" key={person.id || person.email || index}>
                        {person.photo_url || person.photo ? (
                            <img alt={person.fullname || person.name || 'Сотрудник'} src={person.photo_url || person.photo} />
                        ) : (
                            <div className="photo-placeholder">{(person.fullname || person.name || 'МЮ').slice(0, 2)}</div>
                        )}
                        <div>
                            <h2>{person.fullname || person.name || 'ФИО не указано'}</h2>
                            <strong>{person.position || person.title || 'Должность не указана'}</strong>
                            <span>Курируемые направления</span>
                            <b>{person.area_of_work || person.area_of_work}</b>
                            <span>Телефон</span>
                            <b>{person.phone || person.phone_work || '+7 700 789 7908'}</b>
                            <span>Почта</span>
                            <b>{person.email || person.mail || 'email не указан'}</b>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}