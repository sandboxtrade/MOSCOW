export default function QuestPanel({ introDone, phoneOwned }) {
  return (
    <aside className="questPanel">
      <div className="panelEyebrow">ТЕКУЩИЕ ЗАДАЧИ</div>

      <div className={`quest ${introDone ? "done" : "active"}`}>
        <span className="questIcon">{introDone ? "✓" : "1"}</span>
        <div>
          <strong>Поговорить с проводником</strong>
          <p>Разберись, с чего начать в городе.</p>
        </div>
      </div>

      <div className={`quest ${phoneOwned ? "done" : introDone ? "active" : "locked"}`}>
        <span className="questIcon">{phoneOwned ? "✓" : "2"}</span>
        <div>
          <strong>Купить телефон</strong>
          <p>Первый инструмент для выхода в город.</p>
        </div>
      </div>
    </aside>
  );
}
