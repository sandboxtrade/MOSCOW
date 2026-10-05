function formatRub(value = 0) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₽G";
}

export default function TopHud({ wallet, account, online }) {
  return (
    <header className="topHud">
      <div className="brandBlock">
        <div className="brandMark">M</div>
        <div>
          <div className="brandName">MOSCOW</div>
          <div className="brandMeta">район: панельки · ночь</div>
        </div>
      </div>

      <div className="hudStats">
        <div className="hudPill">
          <span className="hudLabel">₽G</span>
          <strong>{formatRub(wallet?.rubTotal)}</strong>
        </div>
        <div className="hudPill">
          <span className="hudLabel">SOL</span>
          <strong>{Number(wallet?.solAvailable || 0).toFixed(2)}</strong>
        </div>
        <div className="hudPill compact">
          <span className={`dot ${online ? "ok" : "bad"}`} />
          <span>{account?.status || "FREE"}</span>
        </div>
      </div>
    </header>
  );
}
