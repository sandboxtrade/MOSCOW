function formatRub(value = 0) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽G";
}

export default function PhoneShopModal({ open, wallet, busy, error, onBuy, onClose }) {
  if (!open) return null;

  const price = 15000;
  const available = Number(wallet?.rubNonWithdrawable || 0);
  const canBuy = available >= price && !busy;

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <section className="shopModal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={onClose}>×</button>

        <div className="shopPhone" aria-hidden="true">
          <div className="speaker" />
          <div className="screenGlow">M</div>
          <div className="homeBar" />
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
