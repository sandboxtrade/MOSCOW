import { useEffect, useMemo, useState } from "react";
import ApartmentScene from "./components/ApartmentScene.jsx";
import DialogueBox from "./components/DialogueBox.jsx";
import PhoneShopModal from "./components/PhoneShopModal.jsx";
import QuestPanel from "./components/QuestPanel.jsx";
import TopHud from "./components/TopHud.jsx";
import {
  apiRequest,
  createPlayer,
  loadPlayer,
  purchaseStarterPhone,
} from "./lib/api.js";

const ACCOUNT_KEY = "moscow.accountId";
const INTRO_KEY = "moscow.introDone";

export default function App() {
  const [accountId, setAccountId] = useState(() => localStorage.getItem(ACCOUNT_KEY) || "");
  const [account, setAccount] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [progress, setProgress] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [online, setOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [introDone, setIntroDone] = useState(() => localStorage.getItem(INTRO_KEY) === "1");
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [toast, setToast] = useState("");

  const phoneOwned = Boolean(progress?.phoneOwned);
  const gameStarted = Boolean(accountId);

  useEffect(() => {
    apiRequest("/health")
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    if (!accountId) return;

    refreshPlayer();
  }, [accountId]);

  useEffect(() => {
    if (phoneOwned) {
      setIntroDone(true);
      localStorage.setItem(INTRO_KEY, "1");
    }
  }, [phoneOwned]);

  const nextHint = useMemo(() => {
    if (!gameStarted) return "Начни новую жизнь";
    if (!introDone) return "Поговори с проводником";
    if (!phoneOwned) return "Купи телефон на столе";
    return "Выход во двор открыт";
  }, [gameStarted, introDone, phoneOwned]);

  async function refreshPlayer() {
    try {
      const data = await loadPlayer(accountId);
      setAccount(data.account);
      setWallet(data.wallet);
      setProgress(data.progress);
      setInventory(data.inventory);
      setError("");
      setOnline(true);
    } catch (err) {
      setError(err.message);
      setOnline(false);
    }
  }

  async function startGame() {
    setBusy(true);
    setError("");

    try {
      const data = await createPlayer();
      localStorage.setItem(ACCOUNT_KEY, data.account.id);
      localStorage.removeItem(INTRO_KEY);
      setAccountId(data.account.id);
      setAccount(data.account);
      setWallet(data.wallet);
      setProgress(data.progress);
      setInventory([]);
      setIntroDone(false);
      setDialogueStep(0);
      setDialogueOpen(true);
      setOnline(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openGuide() {
    setDialogueStep(phoneOwned ? 99 : 0);
    setDialogueOpen(true);
  }

  function nextDialogue() {
    setDialogueStep((step) => step + 1);
  }

  function closeDialogue() {
    setDialogueOpen(false);
    if (!phoneOwned) {
      setIntroDone(true);
      localStorage.setItem(INTRO_KEY, "1");
      setToast("Новая задача: купить телефон");
      window.setTimeout(() => setToast(""), 2600);
    }
  }

  async function buyPhone() {
    if (!accountId) return;

    setBusy(true);
    setError("");

    try {
      await purchaseStarterPhone(accountId);
      await refreshPlayer();
      setShopOpen(false);
      setToast("Телефон добавлен в инвентарь · −15 000 ₽G");
      window.setTimeout(() => setToast(""), 3200);
      setDialogueStep(99);
      setDialogueOpen(true);
    } catch (err) {
      if (err.message === "ITEM_ALREADY_OWNED") {
        await refreshPlayer();
        setShopOpen(false);
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  function handleExit() {
    if (!phoneOwned) return;
    setToast("Следующая сцена: двор панельки · будет в следующем вертикальном срезе");
    window.setTimeout(() => setToast(""), 3800);
  }

  function handleWorkstation() {
    const message = phoneOwned
      ? "Рабочее место готово для следующей активности. Пока здесь только осмотр."
      : "Старый компьютер включается, но сначала разберись с проводником и телефоном.";
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function resetLocalSession() {
    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem(INTRO_KEY);
    setAccountId("");
    setAccount(null);
    setWallet(null);
    setProgress(null);
    setInventory([]);
    setIntroDone(false);
    setDialogueOpen(false);
    setShopOpen(false);
    setError("");
  }

  return (
    <main className="appShell">
      {!gameStarted ? (
        <section className="startScreen">
          <div className="startBackdrop" />
          <div className="startNoise" />

          <div className="startContent">
            <div className="startKicker">MOSCOW / 00:47</div>
            <h1>Город никого<br />не ждёт.</h1>
            <p>
              Комната в панельке, 200 000 ₽G стартовых денег и один знакомый,
              который обещал показать, как тут всё устроено.
            </p>

            <button className="startButton" onClick={startGame} disabled={busy}>
              {busy ? "Создаём игрока..." : "Войти в Москву"}
            </button>

            {error && <div className="startError">{error}</div>}
          </div>
        </section>
      ) : (
        <>
          <TopHud wallet={wallet} account={account} online={online} />

          <section className="gameFrame">
            <ApartmentScene
              introDone={introDone}
              phoneOwned={phoneOwned}
              onGuide={openGuide}
              onPhone={() => setShopOpen(true)}
              onExit={handleExit}
              onWorkstation={handleWorkstation}
            />

            <QuestPanel introDone={introDone} phoneOwned={phoneOwned} />

            <div className="nextHint">
              <span>СЕЙЧАС</span>
              <strong>{nextHint}</strong>
            </div>

            <DialogueBox
              visible={dialogueOpen}
              step={dialogueStep}
              onNext={nextDialogue}
              onClose={closeDialogue}
              phoneOwned={phoneOwned}
            />
          </section>

          <footer className="bottomBar">
            <button className="navButton active"><span>⌂</span>Комната</button>
            <button className="navButton" disabled><span>⌖</span>Карта</button>
            <button className="navButton" disabled><span>▦</span>Телефон</button>
            <button className="navButton" onClick={resetLocalSession}><span>↺</span>Сброс</button>
          </footer>

          <PhoneShopModal
            open={shopOpen}
            wallet={wallet}
            busy={busy}
            error={error}
            onBuy={buyPhone}
            onClose={() => !busy && setShopOpen(false)}
          />

          {toast && <div className="toast">{toast}</div>}
        </>
      )}
    </main>
  );
}
