import { publicAsset } from "../lib/assets.js";

function PixelCharacter({ variant, label }) {
  return (
    <div className={`pixelCharacter ${variant}`} aria-hidden="true">
      <span className="characterShadow" />
      <span className="characterHead"><span className="characterHair" /></span>
      <span className="characterTorso" />
      <span className="characterArm armLeft" />
      <span className="characterArm armRight" />
      <span className="characterLeg legLeft" />
      <span className="characterLeg legRight" />
      {variant === "guide" && <span className="characterBag" />}
      <span className="characterLabel">{label}</span>
    </div>
  );
}

function InteractionMarker({ icon, text }) {
  return (
    <span className="interactionMarker" aria-hidden="true">
      <span className="interactionPulse" />
      <span className="interactionIcon">{icon}</span>
      <span className="interactionText">{text}</span>
    </span>
  );
}

export default function ApartmentScene({ introDone, phoneOwned, onGuide, onPhone, onWorkstation }) {
  return (
    <section className="apartmentScene" aria-label="Комната в московской панельке ночью">
      <div className="sceneLayer sceneBackground" aria-hidden="true">
        <img
          src={publicAsset("assets/apartment-room-approved.png")}
          alt=""
          draggable="false"
          loading="eager"
          decoding="sync"
        />
      </div>

      <div className="sceneLayer sceneAmbience" aria-hidden="true">
        <span className="windowGlow" />
        <span className="cityTwinkle twinkleA" />
        <span className="cityTwinkle twinkleB" />
        <span className="cityTwinkle twinkleC" />
        <span className="deskGlow" />
        <span className="bulbGlow" />
        <span className="ambientDrift driftA" />
        <span className="ambientDrift driftB" />
      </div>

      <div className="sceneLayer sceneLighting" aria-hidden="true" />
      <div className="sceneLayer sceneGrain" aria-hidden="true" />

      <div className="sceneLayer playerLayer">
        <PixelCharacter variant="player" label="Ты" />
      </div>

      <div className="sceneLayer guideLayer">
        <PixelCharacter variant="guide" label="Проводник" />
        <button className="interactionTarget guideTarget" onClick={onGuide} aria-label="Поговорить с проводником">
          <InteractionMarker icon="!" text="Поговорить" />
        </button>
      </div>

      <div className={`sceneLayer phoneLayer ${phoneOwned ? "owned" : ""}`}>
        {!phoneOwned && <span className="phoneObject" aria-hidden="true"><span /></span>}
        <button
          className={`interactionTarget phoneTarget ${!introDone || phoneOwned ? "disabled" : "ready"}`}
          onClick={onPhone}
          disabled={!introDone || phoneOwned}
          aria-label={phoneOwned ? "Телефон уже куплен" : "Купить телефон"}
        >
          <InteractionMarker
            icon={phoneOwned ? "✓" : "▣"}
            text={phoneOwned ? "Телефон куплен" : introDone ? "Телефон · 15 000 ₽G" : "Сначала поговори"}
          />
        </button>
      </div>

      <div className="sceneLayer workstationLayer">
        <button className="interactionTarget workstationTarget" onClick={onWorkstation} aria-label="Осмотреть рабочее место">
          <InteractionMarker icon="⌘" text="Рабочее место" />
        </button>
      </div>

      <div className="sceneLocation" aria-hidden="true">
        <span>СТАРТОВАЯ КОМНАТА</span>
        <strong>Панелька · ночь</strong>
        <small>Окно, свет города и первые шаги</small>
      </div>
    </section>
  );
}
