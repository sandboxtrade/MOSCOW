function formatRub(value = 0) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽G";
}

function CssPhoneModel() {
  return (
    <div className="cssPhoneModel" aria-hidden="true">
      <span className="cssPhoneSpeaker" />
      <span className="cssPhoneCamera" />
      <div className="cssPhoneScreen">
        <span className="cssPhoneOrb orbA" />
        <span className="cssPhoneOrb orbB" />
        <strong>M</strong>
      </div>
      <span className="cssPhoneSideButton sideA" />
      <span className="cssPhoneSideButton sideB" />
    </div>
  );
}

export default function PhoneShopModal({ open, wallet, busy, error, onBuy, onClose }) {
  if (!open) return null;

  const price = 15000;
  const available = Number(wallet?.rubNonWithdrawable || 0);
  const canBuy = available >= price && !busy;

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <section className="shopModal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="Закрыть магазин">×</button>

        <div className="shopPhoneArt" aria-hidden="true">
          <span className="shopPhoneGlow" />
          <CssPhoneModel />
        </div>

        <div className="shopInfo">
          <div className="panelEyebrow">БАРАХОЛКА · ТЕХНИКА</div>
          <h2>Бюджетный смартфон</h2>
          <p>
            Звонки, сообщения, карта и доступ к будущим городским сервисам.
            Ничего лишнего.
          </p>

          <div className="priceRow">
            <span>Цена</span>
            <strong>{formatRub(price)}</strong>
          </div>
          <div className="priceRow muted">
            <span>Доступно</span>
            <strong>{formatRub(available)}</strong>
          </div>

          {error && <div className="modalError">{error}</div>}

          <button className="buyButton" disabled={!canBuy} onClick={onBuy}>
            {busy ? "Проводим покупку..." : "Купить телефон"}
          </button>
        </div>
      </section>
    </div>
  );
}
