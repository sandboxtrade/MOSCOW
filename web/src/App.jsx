import { useEffect, useMemo, useState } from "react";
import ApartmentScene from "./components/ApartmentScene.jsx";
import DialogueBox from "./components/DialogueBox.jsx";
import PhoneShopModal from "./components/PhoneShopModal.jsx";
import PhonePanel from "./components/PhonePanel.jsx";
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
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
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

  const objective = useMemo(() => {
    if (!gameStarted) return { label: "Начало", title: "Начни новую жизнь", step: "0/3" };
    if (!introDone) return { label: "Задача", title: "Поговори с проводником", step: "1/3" };
    if (!phoneOwned) return { label: "Задача", title: "Купи телефон на столе", step: "2/3" };
    return { label: "Свободно", title: "Осмотрись в комнате", step: "3/3" };
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
      showToast("Новая задача · купить телефон");
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
      showToast("Телефон в инвентаре · −15 000 ₽G", 3200);
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

  function handleWorkstation() {
    showToast(
      phoneOwned
        ? "Рабочее место · пока только осмотр, но здесь появятся будущие действия"
        : "Сначала поговори с проводником и разберись с телефоном",
      3200,
    );
  }

  function showToast(message, duration = 2600) {
    setToast(message);
    window.setTimeout(() => setToast(""), duration);
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
    setPhoneOpen(false);
    setQuestsOpen(false);
    setError("");
  }

  return (
    <main className="appShell">
      {!gameStarted ? (
        <section className="startScreen">
          <div className="startBackdrop" aria-hidden="true">
            <span className="startCity cityOne" />
            <span className="startCity cityTwo" />
            <span className="startCity cityThree" />
            <span className="startRoadGlow" />
          </div>
          <div className="startAurora" aria-hidden="true" />
          <div className="startNoise" aria-hidden="true" />
          <div className="startScanline" aria-hidden="true" />

          <div className="startChrome">
            <div className="startTopline">
              <span className="startTag">MOSCOW</span>
              <span className="startTag buildTag">v0.3.14 · LIVE</span>
              <span className="startTag muted">пролог · панельки</span>
              <span className="startTag muted">ночь</span>
            </div>

            <div className="startContent">
              <div className="startHero">
                <div className="startKicker">СТАРТОВАЯ ЛОКАЦИЯ</div>
                <h1>Комната.<br />Первая точка.</h1>
                <p>
                  Сейчас это стартовое меню — временный пролог перед сюжетной видеовставкой.
                  Но даже в таком виде оно должно задавать атмосферу: ночь, Москва за окном,
                  бедная комната и первые деньги на старт.
                </p>

                <div className="startMetaRow">
                  <div className="startStatCard">
                    <span>СТАРТ</span>
                    <strong>200 000 ₽G</strong>
                    <small>невыводимый баланс</small>
                  </div>
                  <div className="startStatCard">
                    <span>СТАТУС</span>
                    <strong>FREE</strong>
                    <small>новый игрок</small>
                  </div>
                </div>

                <button className="startButton" onClick={startGame} disabled={busy}>
                  {busy ? "Создаём игрока..." : "Начать"}
                </button>

                {error && <div className="startError">{error === "API_TIMEOUT" ? "Сервер не ответил за 12 секунд. Обнови страницу и повтори." : error}</div>}
              </div>

              <aside className="startSideCard">
                <span className="panelEyebrow">ОТ ЧЕГО СТАРТУЕМ</span>
                <strong>Первая сцена</strong>
                <ul>
                  <li>комната в панельке ночью</li>
                  <li>проводник для первых шагов</li>
                  <li>телефон как первый инструмент</li>
                </ul>
                <div className="startSideNote">
                  Позже этот экран будет заменён сюжетным видео-вступлением,
                  поэтому здесь сейчас важны ритм, атмосфера и читаемость.
                </div>
              </aside>
            </div>
          </div>
        </section>
      ) : (
        <section className="gameViewport">
          <TopHud wallet={wallet} account={account} online={online} />

          <section className="gameFrame">
            <span className="buildStamp">v0.3.14 · LIVE ROOM</span>
            <ApartmentScene
              introDone={introDone}
              phoneOwned={phoneOwned}
              guideTalking={dialogueOpen}
              onGuide={openGuide}
              onPhone={() => setShopOpen(true)}
              onWorkstation={handleWorkstation}
            />

            <button
              className="objectiveChip"
              type="button"
              onClick={() => setQuestsOpen((value) => !value)}
              aria-expanded={questsOpen}
            >
              <span className="objectiveIndex">{objective.step}</span>
              <span className="objectiveCopy">
                <small>{objective.label}</small>
                <strong>{objective.title}</strong>
              </span>
              <span className="objectiveChevron">{questsOpen ? "−" : "+"}</span>
            </button>

            <QuestPanel
              open={questsOpen}
              introDone={introDone}
              phoneOwned={phoneOwned}
              onClose={() => setQuestsOpen(false)}
            />

            <DialogueBox
              visible={dialogueOpen}
              step={dialogueStep}
              onNext={nextDialogue}
              onClose={closeDialogue}
              phoneOwned={phoneOwned}
            />
          </section>

          <footer className="bottomBar">
            <button className="navButton active" type="button">
              <span className="navGlyph">⌂</span>
              <span>Комната</span>
            </button>
            <button
              className={`navButton ${phoneOwned ? "available" : ""}`}
              type="button"
              disabled={!phoneOwned}
              onClick={() => setPhoneOpen(true)}
            >
              <span className="navGlyph">▦</span>
              <span>Телефон</span>
            </button>
            <button className="navButton" type="button" onClick={() => setQuestsOpen(true)}>
              <span className="navGlyph">≡</span>
              <span>Задачи</span>
            </button>
          </footer>
        </section>
      )}

      <PhonePanel
        open={phoneOpen}
        wallet={wallet}
        phoneOwned={phoneOwned}
        onClose={() => setPhoneOpen(false)}
        onReset={resetLocalSession}
      />

      <PhoneShopModal
        open={shopOpen}
        wallet={wallet}
        busy={busy}
        error={error}
        onBuy={buyPhone}
        onClose={() => !busy && setShopOpen(false)}
      />

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
