const lines = [
  {
    title: "Проводник",
    text: "Ну как добрался? Уже думал, чем займёшься?",
  },
  {
    title: "Проводник",
    text: "Пока не спеши. Сначала возьми телефон — без него дальше будет неудобно.",
  },
  {
    title: "Проводник",
    text: "На столе есть простой вариант за 15 000 ₽G. Стартовые деньги тратить можно, вывести их нельзя.",
  },
];

function GuideAvatar() {
  return (
    <div className="guideAvatarVector" aria-hidden="true">
      <span className="avatarGlow" />
      <span className="avatarHood" />
      <span className="avatarNeck" />
      <span className="avatarFace"><i /></span>
      <span className="avatarHair" />
      <span className="avatarStrap" />
    </div>
  );
}

export default function DialogueBox({ visible, step, onNext, onClose, phoneOwned }) {
  if (!visible) return null;

  const finalLine = phoneOwned
    ? {
        title: "Проводник",
        text: "Нормально. Телефон есть. Осмотрись здесь — дальше решим, чем займёмся.",
      }
    : lines[Math.min(step, lines.length - 1)];

  const isLast = phoneOwned || step >= lines.length - 1;
  const displayStep = phoneOwned ? "ГОТОВО" : `${Math.min(step + 1, lines.length)}/${lines.length}`;

  return (
    <section className="dialogueBox" role="dialog" aria-label="Диалог с проводником">
      <div className="guidePortrait" aria-hidden="true">
        <GuideAvatar />
      </div>

      <div className="dialogueCopy">
        <div className="dialogueMeta">
          <strong>{finalLine.title}</strong>
          <span>{displayStep}</span>
        </div>
        <p>{finalLine.text}</p>
      </div>

      <button
        className="dialogueNext"
        onClick={isLast ? onClose : onNext}
        aria-label={isLast ? "Закрыть диалог" : "Следующая реплика"}
      >
        <span>{isLast ? "×" : "›"}</span>
      </button>
    </section>
  );
}
