function formatRub(value = 0) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0));
}

export default function TopHud({ wallet, account, online }) {
  return (
    <header className="topHud">
      <div className="brandBlock">
        <div className="brandMark">M</div>
        <div className="brandCopy">
          <div className="brandName">MOSCOW</div>
          <div className="brandMeta">панельки · 23:47</div>
        </div>
      </div>

      <div className="hudStats">
        <div className="hudPill rubPill">
          <span className="hudLabel">₽G</span>
          <strong>{formatRub(wallet?.rubTotal)}</strong>
        </div>
        <div className="hudPill solPill">
          <span className="hudLabel">SOL</span>
          <strong>{Number(wallet?.solAvailable || 0).toFixed(2)}</strong>
        </div>
        <div className="connectionBadge" title={online ? "Сервер доступен" : "Нет связи с сервером"}>
          <span className={`dot ${online ? "ok" : "bad"}`} />
          <span>{account?.status || "FREE"}</span>
        </div>
      </div>
    </header>
  );
}
