const lines = [
  {
    title: "Проводник",
    text: "Ну как добрался? Уже думал, чем займёшься?",
  },
  {
    title: "Проводник",
    text: "Москва тут простая: без инструментов далеко не уедешь. Начни с телефона.",
  },
  {
    title: "Проводник",
    text: "На столе есть вариант за 15 000 ₽G. Стартовые деньги тратить можно, вывести их нельзя.",
  },
];

export default function DialogueBox({ visible, step, onNext, onClose, phoneOwned }) {
  if (!visible) return null;

  const finalLine = phoneOwned
    ? {
        title: "Проводник",
        text: "Нормально. Телефон есть. Дальше спустимся во двор и начнём открывать город.",
      }
    : lines[Math.min(step, lines.length - 1)];

  const isLast = phoneOwned || step >= lines.length - 1;

  return (
    <section className="dialogueBox">
      <div className="guidePortrait" aria-hidden="true">
        <span className="hair" />
        <span className="face" />
        <span className="hood" />
      </div>

      <div className="dialogueCopy">
        <strong>{finalLine.title}</strong>
        <p>{finalLine.text}</p>
      </div>

      <button
        className="dialogueNext"
        onClick={isLast ? onClose : onNext}
        aria-label={isLast ? "Закрыть диалог" : "Следующая реплика"}
      >
        {isLast ? "×" : "›"}
      </button>
    </section>
  );
}
