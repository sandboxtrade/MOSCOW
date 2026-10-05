export default function QuestPanel({ introDone, phoneOwned }) {
  return (
    <aside className="questPanel">
      <div className="panelEyebrow">ТЕКУЩИЕ ЗАДАЧИ</div>

      <div className={`quest ${introDone ? "done" : "active"}`}>
        <span className="questIcon">{introDone ? "✓" : "1"}</span>
        <div>
          <strong>Поговорить с проводником</strong>
          <p>Узнай, с чего начать в городе.</p>
        </div>
      </div>

      <div className={`quest ${phoneOwned ? "done" : introDone ? "active" : "locked"}`}>
        <span className="questIcon">{phoneOwned ? "✓" : "2"}</span>
        <div>
          <strong>Купить телефон</strong>
          <p>15 000 ₽G · первый инструмент для города.</p>
        </div>
      </div>

      <div className={`quest ${phoneOwned ? "active" : "locked"}`}>
        <span className="questIcon">3</span>
        <div>
          <strong>Выйти во двор</strong>
          <p>Выход откроется после покупки телефона.</p>
        </div>
      </div>
    </aside>
  );
}
