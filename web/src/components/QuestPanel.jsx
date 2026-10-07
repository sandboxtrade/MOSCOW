export default function QuestPanel({ open, introDone, phoneOwned, onClose }) {
  if (!open) return null;

  return (
    <aside className="questPanel" aria-label="Текущие задачи">
      <header className="questHeader">
        <div>
          <span className="panelEyebrow">ПЕРВЫЕ ШАГИ</span>
          <strong>Комната</strong>
        </div>
        <button className="panelClose" type="button" onClick={onClose} aria-label="Закрыть задачи">×</button>
      </header>

      <div className={`quest ${introDone ? "done" : "active"}`}>
        <span className="questIcon">{introDone ? "✓" : "1"}</span>
        <div>
          <strong>Поговорить с проводником</strong>
          <p>Узнай, что делать в первые минуты.</p>
        </div>
      </div>

      <div className={`quest ${phoneOwned ? "done" : introDone ? "active" : "locked"}`}>
        <span className="questIcon">{phoneOwned ? "✓" : "2"}</span>
        <div>
          <strong>Купить телефон</strong>
          <p>15 000 ₽G · основной инструмент игрока.</p>
        </div>
      </div>

      <div className={`quest ${phoneOwned ? "active" : "locked"}`}>
        <span className="questIcon">3</span>
        <div>
          <strong>Осмотреть комнату</strong>
          <p>Рабочее место и окружение пока доступны только для осмотра.</p>
        </div>
      </div>

      <div className="questFooter">
        <span>{phoneOwned ? "Базовое знакомство завершено" : "Заверши текущий шаг"}</span>
        <strong>{phoneOwned ? "3/3" : introDone ? "1/3" : "0/3"}</strong>
      </div>
    </aside>
  );
}
