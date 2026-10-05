import { useEffect, useState } from "react";

const API =
  import.meta.env.VITE_API_URL ||
  "https://moscow-city-api.ermilov-stepa228337.workers.dev";

function formatRub(value = 0) {
  return new Intl.NumberFormat("ru-RU").format(value || 0) + " ₽G";
}

async function request(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "REQUEST_FAILED");
  }

  return data;
}

export default function App() {
  const [accountId, setAccountId] = useState(
    () => localStorage.getItem("moscow.accountId") || "",
  );
  const [wallet, setWallet] = useState(null);
  const [progress, setProgress] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const phoneOwned = Boolean(progress?.phoneOwned);

  useEffect(() => {
    if (accountId) refresh();
  }, [accountId]);

  async function refresh() {
    try {
      const [walletData, progressData, inventoryData] = await Promise.all([
        request("/wallet/" + accountId),
        request("/progress/" + accountId),
        request("/inventory/" + accountId),
      ]);

      setWallet(walletData.wallet);
      setProgress(progressData);
      setInventory(inventoryData.items || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function startGame() {
    setBusy(true);
    setError("");

    try {
      const data = await request("/account/create", { method: "POST" });
      localStorage.setItem("moscow.accountId", data.account.id);
      setAccountId(data.account.id);
      setWallet(data.wallet);
      setProgress(data.progress);
      setInventory([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function buyPhone() {
    setBusy(true);
    setError("");

    try {
      await request("/shop/buy", {
        method: "POST",
        headers: {
          "Idempotency-Key": "starter-phone-" + accountId,
        },
        body: JSON.stringify({
          accountId,
          itemId: "starter_phone",
        }),
      });

      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="game">
      <header>
        <b>MOSCOW</b>
        <span>{formatRub(wallet?.rubTotal)}</span>
      </header>

      <section className="scene">
        <div className="city" />
        <div className="bed" />
        <div className={"phone " + (phoneOwned ? "owned" : "")}>
          {phoneOwned ? "MOSCOW" : ""}
        </div>

        <div className="guide">
          <strong>
            {!accountId
              ? "Новая жизнь"
              : phoneOwned
                ? "Телефон куплен"
                : "Первый день"}
          </strong>
          <p>
            {!accountId
              ? "Создай игрока и начни жизнь в городе."
              : phoneOwned
                ? "Телефон у тебя. Теперь город может открываться."
                : "Купи простой телефон за 15 000 ₽G."}
          </p>
        </div>
      </section>

      <section className="hud">
        {!accountId ? (
          <button onClick={startGame} disabled={busy}>
            Начать игру
          </button>
        ) : (
          <>
            <div className="stats">
              <span>{formatRub(wallet?.rubNonWithdrawable)}</span>
              <span>{wallet?.solAvailable || 0} TEST SOL</span>
              <span>{inventory.length} предметов</span>
            </div>

            {!phoneOwned ? (
              <button onClick={buyPhone} disabled={busy}>
                Купить телефон · 15 000 ₽G
              </button>
            ) : (
              <button disabled>Телефон в инвентаре</button>
            )}
          </>
        )}

        {error && <pre>{error}</pre>}
      </section>
    </main>
  );
}
