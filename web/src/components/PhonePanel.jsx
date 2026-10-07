function GuideMiniAvatar() {
  return (
    <span className="phoneAvatarVector" aria-hidden="true">
      <i className="miniHair" />
      <i className="miniFace" />
      <i className="miniHood" />
    </span>
  );
}

export default function PhonePanel({ open, wallet, onClose, onReset }) {
  if (!open) return null;

  return (
    <div className="phonePanelBackdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="phonePanel"
        role="dialog"
        aria-modal="true"
        aria-label="Телефон"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="phoneStatusBar" aria-hidden="true">
          <span>23:48</span>
          <span>● ● ●</span>
        </div>

        <header className="phonePanelHeader">
          <div>
            <span className="panelEyebrow">МОЙ ТЕЛЕФОН</span>
            <strong>Главная</strong>
          </div>
          <button className="phonePanelClose" onClick={onClose} aria-label="Закрыть телефон">×</button>
        </header>

        <div className="phoneBalanceCard">
          <span>Доступно</span>
          <strong>{Math.round(wallet?.rubTotal || 0).toLocaleString("ru-RU")} ₽G</strong>
          <small>{Number(wallet?.solAvailable || 0).toFixed(4)} SOL</small>
        </div>

        <div className="phoneSectionTitle">Приложения</div>
        <div className="phoneAppGrid">
          <button className="phoneApp active" onClick={onClose}>
            <span>⌂</span>
            <strong>Комната</strong>
            <small>Вернуться в игру</small>
          </button>
          <button className="phoneApp" disabled>
            <span>₽</span>
            <strong>Кошелёк</strong>
            <small>Скоро</small>
          </button>
          <button className="phoneApp" disabled>
            <span>●</span>
            <strong>Контакты</strong>
            <small>1 контакт</small>
          </button>
          <button className="phoneApp" disabled>
            <span>⌁</span>
            <strong>Сервисы</strong>
            <small>Недоступно</small>
          </button>
        </div>

        <div className="phoneSectionTitle">Сообщения</div>
        <div className="phoneMessagePreview">
          <GuideMiniAvatar />
          <div>
            <strong>Проводник</strong>
            <p>Осмотрись в комнате. Не спеши дальше.</p>
          </div>
          <span className="phoneMessageTime">сейчас</span>
        </div>

        <button className="phoneReset" type="button" onClick={onReset}>Сбросить локальную сессию</button>
      </section>
    </div>
  );
}
