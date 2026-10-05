export default function PhonePanel({ open, wallet, onClose }) {
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
        <header className="phonePanelHeader">
          <div>
            <span className="panelEyebrow">STARTER PHONE</span>
            <strong>23:48</strong>
          </div>
          <button className="phonePanelClose" onClick={onClose} aria-label="Закрыть телефон">×</button>
        </header>

        <div className="phoneBalanceCard">
          <span>Баланс</span>
          <strong>{Math.round(wallet?.rubTotal || 0).toLocaleString("ru-RU")} ₽G</strong>
          <small>{Number(wallet?.solAvailable || 0).toFixed(4)} SOL</small>
        </div>

        <div className="phoneAppGrid">
          <button className="phoneApp active" onClick={onClose}>
            <span>⌂</span>
            <strong>Комната</strong>
            <small>Текущая точка</small>
          </button>
          <button className="phoneApp" disabled>
            <span>⌖</span>
            <strong>Карта</strong>
            <small>После выхода во двор</small>
          </button>
          <button className="phoneApp" disabled>
            <span>₽</span>
            <strong>Кошелёк</strong>
            <small>Скоро</small>
          </button>
          <button className="phoneApp" disabled>
            <span>●</span>
            <strong>Контакты</strong>
            <small>Проводник</small>
          </button>
        </div>

        <div className="phoneMessagePreview">
          <span className="phoneAvatar">П</span>
          <div>
            <strong>Проводник</strong>
            <p>Спускайся во двор. Дальше покажу район.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
