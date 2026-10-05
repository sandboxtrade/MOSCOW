export default function ApartmentScene({
  introDone,
  phoneOwned,
  onGuide,
  onPhone,
  onExit,
}) {
  return (
    <section className="apartmentScene">
      <div className="nightWindow">
        <div className="cityGlow" />
        <div className="block blockA" />
        <div className="block blockB" />
        <div className="block blockC" />
        <div className="tower" />
      </div>

      <div className="wallPoster posterOne">МОСКВА<br />ВСЕГДА<br />ДАЛЬШЕ</div>
      <div className="wallPoster posterTwo">1987</div>

      <div className="radiator" />
      <div className="bedScene">
        <div className="pillow" />
        <div className="blanket" />
      </div>

      <div className="deskScene">
        <div className="monitor"><span>terminal_</span></div>
        <div className="keyboard" />
        <div className="deskLamp" />
        <div className="mug" />
      </div>

      <div className="fridgeScene">
        <span className="magnet one" />
        <span className="magnet two" />
        <span className="magnet three" />
      </div>

      <div className="rug" />
      <div className="coffeeTable">
        <div className={`tablePhone ${phoneOwned ? "owned" : ""}`} />
        <div className="ashtray" />
      </div>

      <button className="hotspot guideHotspot" onClick={onGuide}>
        <span className="hotspotIcon">!</span>
        <span className="hotspotText">Проводник</span>
      </button>

      <div className="guideSprite" aria-hidden="true">
        <span className="spriteHead" />
        <span className="spriteBody" />
        <span className="spriteBag" />
        <span className="spriteLeg left" />
        <span className="spriteLeg right" />
      </div>

      <button
        className={`hotspot phoneHotspot ${!introDone || phoneOwned ? "disabled" : ""}`}
        onClick={onPhone}
        disabled={!introDone || phoneOwned}
      >
        <span className="hotspotIcon">▣</span>
        <span className="hotspotText">{phoneOwned ? "Телефон куплен" : "Купить телефон"}</span>
      </button>

      <button className={`hotspot exitHotspot ${phoneOwned ? "ready" : "disabled"}`} onClick={onExit} disabled={!phoneOwned}>
        <span className="hotspotIcon">↗</span>
        <span className="hotspotText">Во двор</span>
      </button>

      <div className="sceneCaption">
        <strong>Комната в панельке</strong>
        <span>Москва · 23:47</span>
      </div>
    </section>
  );
}
