function iso(x, y, z = 0) {
  return {
    x: 400 + (x - y) * 0.82,
    y: 500 + (x + y) * 0.45 - z,
  };
}

function pts(...points) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

function IsoBlock({ x, y, w, d, h, top, left, right, className = "" }) {
  const a = iso(x, y, h);
  const b = iso(x + w, y, h);
  const c = iso(x + w, y + d, h);
  const d1 = iso(x, y + d, h);
  const a0 = iso(x, y, 0);
  const b0 = iso(x + w, y, 0);
  const c0 = iso(x + w, y + d, 0);
  const d0 = iso(x, y + d, 0);

  return (
    <g className={`isoBlock ${className}`}>
      <polygon points={pts(a, b, c, d1)} fill={top} />
      <polygon points={pts(a, d1, d0, a0)} fill={left} />
      <polygon points={pts(b, c, c0, b0)} fill={right} />
    </g>
  );
}

function RoomPerson({ x, y, guide = false, talking = false }) {
  const p = iso(x, y, 0);
  const scale = guide ? 1.06 : 1;

  return (
    <g
      className={`roomPerson ${guide ? "guidePerson" : "playerPerson"} ${talking ? "talking" : ""}`}
      transform={`translate(${p.x} ${p.y}) scale(${scale})`}
    >
      <ellipse className="personShadow" cx="0" cy="7" rx="34" ry="12" />
      <g className="personBody">
        <path className="personLeg personLegBack" d="M-17,-45 L-10,-5 L-15,14 L-26,14 L-29,-39 Z" />
        <path className="personLeg personLegFront" d="M4,-48 L14,-5 L11,16 L0,16 L-4,-41 Z" />
        <path className="personCargoPocket leftPocket" d="M-23,-43 L-10,-41 L-12,-26 L-25,-29 Z" />
        <path className="personCargoPocket rightPocket" d="M8,-43 L21,-40 L19,-25 L7,-28 Z" />
        <path className="personShoe leftShoe" d="M-28,10 L-8,10 L1,16 L-31,18 Z" />
        <path className="personShoe rightShoe" d="M-1,11 L18,11 L27,17 L-5,19 Z" />

        {!guide && <path className="playerCoatTail" d="M-31,-97 Q-7,-82 1,-70 L-9,-48 L-26,-54 L-35,-77 Z" />}
        <path className="personTorso" d="M-30,-110 Q0,-126 31,-108 L28,-63 Q13,-45 -1,-49 Q-18,-50 -28,-64 Z" />
        <path className="personChest" d="M-12,-102 Q0,-108 11,-101 L9,-67 Q0,-61 -10,-67 Z" />
        <path className="personNeck" d="M-8,-133 L8,-133 L9,-117 L-9,-117 Z" />
        <path className="personHood" d="M-27,-118 Q-11,-144 14,-141 Q24,-138 30,-118 L17,-101 Q-1,-111 -17,-101 Z" />
        <path className="personInnerHood" d="M-15,-114 Q-2,-125 11,-113 L6,-103 Q-2,-108 -10,-103 Z" />
        <path className="personArm personArmBack" d={talking ? "M-26,-103 Q-42,-87 -34,-60" : "M-26,-103 Q-40,-82 -34,-56"} />
        <path className="personArm personArmFront" d={talking ? "M22,-102 Q41,-92 50,-72" : "M24,-103 Q35,-80 30,-55"} />
        {talking && <circle className="personHand" cx="52" cy="-70" r="6" />}

        <g className="personHeadGroup">
          <path className="personEar" d="M-26,-132 Q-26,-124 -21,-122" />
          <path className="personHead" d="M-23,-150 Q-18,-174 0,-176 Q19,-176 24,-156 Q25,-136 18,-125 Q10,-116 -2,-115 Q-18,-117 -23,-150 Z" />
          <path className="personJawShadow" d="M-8,-123 Q4,-118 17,-126" />
          <path className="personHair" d="M-23,-151 Q-22,-174 -6,-180 L3,-188 L8,-180 Q19,-177 27,-159 Q16,-164 9,-158 Q2,-163 -5,-160 Q-14,-164 -23,-151 Z" />
          <path className="personHairGlow" d="M-7,-183 L4,-189 L13,-177" />
          <circle className="personEye" cx="-8" cy="-144" r="2.1" />
          <circle className="personEye" cx="8" cy="-144" r="2.1" />
          <path className="personBrow" d="M-13,-148 L-4,-149" />
          <path className="personBrow" d="M4,-149 L13,-147" />
          <path className="personNose" d="M1,-140 L-1,-132 L2,-131" />
          <path className="personMouth" d="M-6,-125 Q0,-122 7,-125" />
          {guide && <path className="guideScar" d="M17,-145 L12,-138" />}
        </g>

        {guide ? (
          <>
            <path className="guideStrap" d="M-19,-111 L24,-55" />
            <path className="guideBag" d="M8,-72 L33,-60 L25,-35 L-1,-46 Z" />
            <path className="guideBagZip" d="M12,-55 L26,-48" />
          </>
        ) : (
          <>
            <path className="playerZip" d="M0,-103 L0,-60" />
            <path className="playerHarness" d="M18,-104 Q7,-83 10,-58" />
          </>
        )}
      </g>
    </g>
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

function RoomWorld({ guideTalking }) {
  const floorA = iso(0, 0, 0);
  const floorB = iso(430, 0, 0);
  const floorC = iso(430, 390, 0);
  const floorD = iso(0, 390, 0);

  const backTopA = iso(0, 0, 312);
  const backTopB = iso(430, 0, 312);
  const rightTopB = iso(430, 0, 312);
  const rightTopC = iso(430, 390, 312);

  const windowA = iso(74, 0, 252);
  const windowB = iso(270, 0, 252);
  const windowC = iso(270, 0, 113);
  const windowD = iso(74, 0, 113);

  return (
    <svg className="roomWorld" viewBox="0 0 800 1200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="floorGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d4634" />
          <stop offset="0.52" stopColor="#342a22" />
          <stop offset="1" stopColor="#1d1a19" />
        </linearGradient>
        <linearGradient id="backWallGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a605d" />
          <stop offset="0.62" stopColor="#423d42" />
          <stop offset="1" stopColor="#2d3036" />
        </linearGradient>
        <linearGradient id="rightWallGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#504a4a" />
          <stop offset="1" stopColor="#252a31" />
        </linearGradient>
        <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#264b73" />
          <stop offset="0.45" stopColor="#1a3658" />
          <stop offset="1" stopColor="#0b1625" />
        </linearGradient>
        <linearGradient id="windowFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9d9d3" />
          <stop offset="1" stopColor="#80898e" />
        </linearGradient>
        <linearGradient id="curtainGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c8d97" />
          <stop offset="1" stopColor="#646670" />
        </linearGradient>
        <linearGradient id="rugGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#78363f" />
          <stop offset="1" stopColor="#3b2329" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd887" stopOpacity=".52" />
          <stop offset="1" stopColor="#ffd887" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="windowGlow" cx="48%" cy="30%" r="75%">
          <stop offset="0" stopColor="#66b7ff" stopOpacity=".22" />
          <stop offset="1" stopColor="#66b7ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cityGlow" cx="50%" cy="0%" r="72%">
          <stop offset="0" stopColor="#4ec1ff" stopOpacity=".25" />
          <stop offset="1" stopColor="#4ec1ff" stopOpacity="0" />
        </radialGradient>
        <pattern id="floorBoards" width="32" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect width="32" height="16" fill="transparent" />
          <path d="M0 15.5H32" stroke="#8a715c" strokeOpacity=".19" />
          <path d="M16 0V16" stroke="#161412" strokeOpacity=".23" />
        </pattern>
        <pattern id="wallPaper" width="30" height="38" patternUnits="userSpaceOnUse">
          <rect width="30" height="38" fill="transparent" />
          <circle cx="15" cy="10" r="2" fill="#b28f87" fillOpacity=".15" />
          <path d="M15 11 L10 20 L15 28 L20 20 Z" fill="none" stroke="#a68880" strokeOpacity=".16" />
          <path d="M9 20 Q15 16 21 20" fill="none" stroke="#b88f87" strokeOpacity=".12" />
        </pattern>
        <pattern id="guidePlaid" width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill="#63313a" />
          <path d="M0 6H18M0 12H18M6 0V18M12 0V18" stroke="#bbb0aa" strokeOpacity=".42" strokeWidth="2" />
          <path d="M0 9H18M9 0V18" stroke="#211f23" strokeOpacity=".72" strokeWidth="3" />
        </pattern>
        <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="screenGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect className="roomVoid" width="800" height="1200" fill="#060a10" />
      <ellipse className="roomVignette" cx="410" cy="640" rx="420" ry="560" fill="#0c1721" opacity=".6" />
      <ellipse className="roomAmbientPool" cx="418" cy="695" rx="286" ry="190" />

      <polygon className="backWall" points={pts(backTopA, backTopB, floorB, floorA)} fill="url(#backWallGradient)" />
      <polygon points={pts(backTopA, backTopB, floorB, floorA)} fill="url(#wallPaper)" />
      <polygon className="rightWall" points={pts(rightTopB, rightTopC, floorC, floorB)} fill="url(#rightWallGradient)" />
      <polygon className="floorPlane" points={pts(floorA, floorB, floorC, floorD)} fill="url(#floorGradient)" />
      <polygon points={pts(floorA, floorB, floorC, floorD)} fill="url(#floorBoards)" />

      <g className="wallDecor backWallDecor">
        <path className="ceilingPipe" d="M358 254 L714 424" />
        <path className="ceilingPipe" d="M609 265 L609 448" />
        <path className="ceilingPipe" d="M664 291 L664 473" />
        <g className="posterStack">
          <polygon points="123,457 172,479 170,560 120,536" fill="#dfdacd" stroke="#654f45" strokeWidth="3" />
          <polygon points="127,462 166,480 164,550 125,532" fill="#b4382f" opacity=".88" />
          <path d="M136 490 L161 500 M136 507 L158 516" stroke="#f7ead7" strokeWidth="3" opacity=".8" />
          <polygon points="130,381 183,405 178,455 126,431" fill="#d2d0c9" stroke="#5f554f" strokeWidth="3" />
          <circle cx="144" cy="405" r="11" fill="#bcb7b0" />
          <circle cx="164" cy="414" r="11" fill="#202229" />
        </g>
      </g>

      <g className="windowGroup">
        <polygon points={pts(windowA, windowB, windowC, windowD)} fill="url(#windowFrame)" stroke="#d7d9d1" strokeWidth="4" />
        <polygon
          className="windowGlass"
          points={pts(iso(86, 0, 239), iso(258, 0, 239), iso(258, 0, 126), iso(86, 0, 126))}
          fill="url(#windowSky)"
        />
        <polygon className="windowGlassSheen" points="415,305 570,380 571,402 426,338" />
        <path className="windowFrameLine" d="M493 282 L493 394" />
        <path className="windowFrameLine" d="M409 340 L575 414" />
        <g className="citySilhouette">
          <path d="M451 337 L451 300 L468 300 L468 287 L484 287 L484 318 L497 318 L497 271 L517 271 L517 327 L530 327 L530 257 L546 257 L546 323 L561 323 L561 287 L578 287 L578 341 Z" fill="#0d1622" />
          <path d="M459 344 L459 291 L474 291 L474 304 L485 304 L485 282 L499 282 L499 315 L517 315 L517 264 L536 264 L536 335 Z" fill="url(#cityGlow)" opacity=".65" />
          {[
            [466, 304], [470, 315], [487, 293], [503, 287], [510, 305], [524, 276], [540, 286], [545, 299], [566, 305],
          ].map(([x, y], index) => (
            <rect key={index} className={`cityLight light${index}`} x={x} y={y} width="5" height="7" />
          ))}
        </g>
        <g className="curtains">
          <polygon points="408,285 439,299 429,457 398,443" fill="url(#curtainGradient)" opacity=".92" />
          <path d="M418 305 L423 451 M428 310 L430 457" stroke="#4f5762" strokeWidth="2" opacity=".65" />
          <polygon points="574,360 604,374 596,510 564,495" fill="url(#curtainGradient)" opacity=".94" />
          <path d="M580 382 L586 498 M591 386 L594 505" stroke="#535b67" strokeWidth="2" opacity=".65" />
        </g>
        <polygon className="windowBeam" points="408,348 592,432 615,658 368,546" fill="url(#windowGlow)" />
      </g>

      <g className="radiatorAssembly">
        <IsoBlock x={198} y={16} w={112} d={18} h={76} top="#7d7971" left="#59544d" right="#46423c" className="radiatorBlock" />
        <g className="radiatorLines">
          <path d="M527 476 L527 527" />
          <path d="M541 482 L541 533" />
          <path d="M555 488 L555 539" />
          <path d="M569 494 L569 545" />
        </g>
      </g>

      <IsoBlock x={22} y={58} w={62} d={58} h={59} top="#6d5a4b" left="#40342c" right="#302723" className="nightstandBlock" />
      <g className="nightstandDetails">
        <path d="M272 544 L304 560" stroke="#2a201c" strokeWidth="4" />
        <path d="M268 559 L300 574" stroke="#2a201c" strokeWidth="4" />
        <circle cx="293" cy="551" r="3" fill="#b9915e" />
        <circle cx="289" cy="566" r="3" fill="#b9915e" />
        <ellipse cx="269" cy="522" rx="11" ry="6" fill="#433d3d" />
        <rect x="283" y="513" width="23" height="10" fill="#53637c" opacity=".9" />
      </g>

      <IsoBlock x={20} y={155} w={155} d={157} h={44} top="#6d6f74" left="#393c40" right="#2a2d31" className="bedBlock" />
      <g className="bedDetails">
        <path d="M152 606 L283 664 L181 720 L52 661 Z" fill="#807973" opacity=".8" />
        <path d="M82 640 Q131 609 184 636 L151 665 Q106 675 70 652 Z" fill="#d6d3cc" opacity=".75" />
        <path d="M100 657 L187 697" stroke="#484a4f" strokeWidth="4" opacity=".48" />
        <path d="M52 664 Q89 648 121 671 T183 702" fill="none" stroke="#2a2830" strokeWidth="8" opacity=".55" />
        <path d="M112 634 Q135 614 160 628" fill="none" stroke="#f0ece1" strokeWidth="5" opacity=".6" />
      </g>

      <g className="bookshelfBlock">
        <IsoBlock x={-6} y={300} w={56} d={72} h={116} top="#4d392d" left="#31261e" right="#261f1b" className="leftShelfBlock" />
        <path className="shelfDivider" d="M95 783 L139 804" />
        <path className="shelfDivider" d="M83 815 L127 836" />
        <path className="shelfDivider" d="M71 848 L115 868" />
        <rect x="93" y="778" width="8" height="18" fill="#2d6b7f" transform="rotate(25 97 788)" />
        <rect x="106" y="784" width="7" height="20" fill="#8d6346" transform="rotate(24 110 793)" />
        <rect x="89" y="811" width="7" height="19" fill="#6053a1" transform="rotate(26 93 821)" />
        <rect x="101" y="818" width="9" height="22" fill="#4f4f5b" transform="rotate(25 105 829)" />
        <ellipse cx="82" cy="875" rx="16" ry="9" fill="#16161b" />
        <path d="M72 872 Q82 859 92 872" fill="#292b31" />
      </g>

      <g className="slippersGroup">
        <path d="M189 754 Q205 751 214 762 Q199 771 182 765 Z" fill="#243244" />
        <path d="M207 763 Q223 760 230 770 Q216 778 199 773 Z" fill="#1a2636" />
      </g>

      <IsoBlock x={132} y={255} w={134} d={95} h={9} top="url(#rugGradient)" left="#2c181d" right="#231417" className="rugBlock" />
      <g className="rugPattern" opacity=".56">
        <path d="M214 721 L319 770 L236 816 L135 768 Z" fill="none" stroke="#c18a5c" strokeWidth="4" />
        <path d="M222 740 L295 774 L236 804 L165 771 Z" fill="none" stroke="#dfb179" strokeWidth="3" />
        <path d="M237 739 L251 746 L238 753 L226 747 Z" fill="none" stroke="#f0d2a0" strokeWidth="2" />
      </g>

      <IsoBlock x={163} y={271} w={102} d={68} h={44} top="#785338" left="#473021" right="#33251b" className="coffeeTableBlock" />
      <g className="coffeeTableDetails">
        <circle cx="249" cy="718" r="10" fill="#d4b58a" />
        <circle cx="249" cy="718" r="5" fill="#362c26" />
        <polygon points="212,706 230,714 228,729 209,721" fill="#bda483" opacity=".88" />
        <path d="M214 711 L226 716 M213 718 L226 723" stroke="#45352b" strokeWidth="2" opacity=".5" />
        <ellipse cx="270" cy="732" rx="15" ry="8" fill="#17181c" />
        <circle cx="270" cy="732" r="4" fill="#454d5b" />
        <path d="M281 734 Q289 727 289 737" fill="none" stroke="#d4b58a" strokeWidth="3" />
      </g>

      <IsoBlock x={233} y={310} w={28} d={28} h={32} top="#735341" left="#4c3224" right="#3a261d" className="stoolBlock" />

      <IsoBlock x={290} y={42} w={124} d={146} h={72} top="#705037" left="#432f24" right="#30231c" className="deskBlock" />
      <g className="deskDetails">
        <polygon points="585,474 643,501 628,538 571,512" fill="#0b1119" stroke="#3b6885" strokeWidth="3" />
        <g className="monitorLines" stroke="#4cc8ff" strokeWidth="2" opacity=".9" filter="url(#screenGlow)">
          <path d="M586 488 L628 506" />
          <path d="M585 497 L620 511" />
          <path d="M582 504 L613 517" />
        </g>
        <rect x="565" y="520" width="14" height="8" fill="#1a1d23" />
        <path d="M566 504 L570 523" stroke="#0d1015" strokeWidth="5" />
        <circle className="deskLampBulb" cx="557" cy="500" r="7.5" fill="#ffe09a" />
        <circle className="deskLampGlow" cx="557" cy="500" r="58" fill="url(#lampGlow)" />
        <path d="M557 500 L545 526" stroke="#1e2227" strokeWidth="5" />
        <path d="M545 526 L527 531" stroke="#1e2227" strokeWidth="5" />
        <polygon points="527,531 535,535 521,541 514,537" fill="#a09b90" />
        <rect x="518" y="513" width="12" height="12" fill="#d0c1a6" opacity=".78" />
        <rect x="533" y="518" width="15" height="9" fill="#40372e" opacity=".8" />
        <path d="M646 531 L662 538" stroke="#1b1c21" strokeWidth="7" />
      </g>

      <g className="wallShelf">
        <polygon points="580,431 673,474 667,489 574,446" fill="#563e2d" />
        <rect x="588" y="421" width="8" height="24" fill="#915d4a" transform="rotate(24 592 433)" />
        <rect x="599" y="426" width="9" height="22" fill="#5470a3" transform="rotate(24 603 437)" />
        <rect x="611" y="431" width="9" height="20" fill="#8a8a83" transform="rotate(24 615 441)" />
        <rect x="625" y="437" width="9" height="18" fill="#79484d" transform="rotate(24 629 446)" />
        <rect x="638" y="441" width="10" height="21" fill="#587d70" transform="rotate(24 643 451)" />
        <path d="M651 447 Q661 430 672 443 Q669 459 656 463" fill="#5c8b5a" />
        <ellipse cx="650" cy="456" rx="10" ry="5" fill="#6d5948" />
      </g>

      <g className="wallPhotos">
        <polygon points="613,487 636,497 633,516 610,505" fill="#d1cec8" stroke="#665f58" strokeWidth="2" />
        <polygon points="641,500 662,510 659,528 638,519" fill="#c9c5be" stroke="#68615a" strokeWidth="2" />
        <polygon points="668,512 690,522 687,541 665,531" fill="#cdcac3" stroke="#6b655e" strokeWidth="2" />
        <path d="M618 495 L629 500 M620 501 L630 506" stroke="#547fa4" strokeWidth="2" opacity=".65" />
        <path d="M646 507 L655 511 M645 515 L656 520" stroke="#8f7257" strokeWidth="2" opacity=".65" />
        <path d="M671 519 L683 525" stroke="#596e8b" strokeWidth="2" opacity=".65" />
      </g>

      <IsoBlock x={366} y={226} w={63} d={71} h={166} top="#d0cfc8" left="#878a86" right="#686d6c" className="fridgeBlock" />
      <g className="fridgeDetails">
        <path d="M598 576 L639 595" stroke="#32393f" strokeWidth="4" />
        <circle cx="623" cy="626" r="5" fill="#4fb7ff" opacity=".46" />
        <circle cx="636" cy="632" r="5" fill="#dd8a76" opacity=".42" />
        <rect x="612" y="605" width="17" height="10" fill="#f0e7c7" opacity=".6" transform="rotate(24 620 610)" />
      </g>

      <g className="microwaveGroup">
        <IsoBlock x={357} y={184} w={52} d={32} h={28} top="#d1d2d6" left="#9ea3a9" right="#7b8088" className="microwaveBlock" />
        <polygon points="633,527 659,539 651,554 625,542" fill="#0c1118" stroke="#58697e" strokeWidth="2" />
        <circle cx="661" cy="548" r="3" fill="#5ab6ff" opacity=".62" />
      </g>

      <g className="eggTrayGroup">
        <IsoBlock x={372} y={286} w={25} d={20} h={14} top="#cfc1a8" left="#b4a78f" right="#9b8f7b" className="eggTrayBlock" />
        <circle cx="616" cy="645" r="3.5" fill="#eee7d9" />
        <circle cx="624" cy="648" r="3.5" fill="#eee7d9" />
        <circle cx="632" cy="651" r="3.5" fill="#eee7d9" />
      </g>

      <g className="kitchenCabinetBlock">
        <IsoBlock x={382} y={342} w={54} d={66} h={84} top="#614634" left="#3f2d23" right="#30231d" className="kitchenBaseBlock" />
        <polygon points="685,707 737,731 735,810 683,786" fill="#f0efeb" stroke="#9c9c9c" strokeWidth="3" />
        <circle cx="721" cy="771" r="7" fill="#1b1f24" />
        <circle cx="705" cy="764" r="7" fill="#1b1f24" />
        <rect x="694" y="748" width="16" height="16" fill="#d9d9d9" />
        <path d="M674 801 L686 807" stroke="#6d7d88" strokeWidth="3" />
      </g>

      <g className="doorOnWall">
        <polygon points="696,437 742,459 742,607 696,585" fill="#241c19" stroke="#674b3b" strokeWidth="4" />
        <circle cx="706" cy="558" r="4" fill="#d0a96d" />
        <path d="M730 470 L730 598" stroke="#4d3428" strokeWidth="2" opacity=".55" />
      </g>
      <g className="coatHook">
        <path d="M688 528 L696 531" stroke="#88939f" strokeWidth="3" />
        <path d="M701 534 Q712 557 704 580 L689 573 Q684 548 691 535" fill="#d58ca0" opacity=".78" />
      </g>
      <g className="hangingBulb">
        <path d="M725 322 L725 421" stroke="#222428" strokeWidth="3" />
        <circle cx="726" cy="432" r="11" fill="#f0c768" />
        <circle cx="726" cy="432" r="44" fill="url(#lampGlow)" opacity=".42" />
      </g>

      <g className="phoneInWorld">
        <polygon points="516,584 531,591 523,605 507,598" fill="#0a1823" stroke="#5bc7ff" strokeWidth="2" />
        <path className="phonePing" d="M514 590 L524 595" stroke="#67d7ff" strokeWidth="2" />
      </g>

      <RoomPerson x={147} y={281} />
      <RoomPerson x={307} y={226} guide talking={guideTalking} />

      <g className="foregroundRail">
        <path d="M54 887 L154 933 L154 972 L54 926 Z" fill="#291d17" opacity=".95" />
        <path d="M156 932 L223 963 L223 1003 L156 971 Z" fill="#33241d" opacity=".95" />
      </g>

      <g className="floatingDust" fill="#b9d8e8">
        <circle cx="306" cy="431" r="2" />
        <circle cx="355" cy="474" r="1.5" />
        <circle cx="434" cy="405" r="1.8" />
        <circle cx="512" cy="454" r="1.4" />
        <circle cx="574" cy="520" r="1.7" />
        <circle cx="611" cy="462" r="1.2" />
      </g>
    </svg>
  );
}

export default function ApartmentScene({ introDone, phoneOwned, guideTalking, onGuide, onPhone, onWorkstation }) {
  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--room-look-x", `${x * 10}px`);
    event.currentTarget.style.setProperty("--room-look-y", `${y * 6}px`);
  }

  function resetPointer(event) {
    event.currentTarget.style.setProperty("--room-look-x", "0px");
    event.currentTarget.style.setProperty("--room-look-y", "0px");
  }

  return (
    <section
      className="apartmentScene faux3dScene"
      aria-label="Объёмная комната в московской панельке ночью"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="roomCamera">
        <RoomWorld guideTalking={guideTalking} />
      </div>
      <div className="roomAtmosphere" aria-hidden="true" />
      <div className="roomScan" aria-hidden="true" />

      <button className="interactionTarget guideTarget" onClick={onGuide} aria-label="Поговорить с проводником">
        <InteractionMarker icon="!" text="Поговорить" />
      </button>

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

      <button className="interactionTarget workstationTarget" onClick={onWorkstation} aria-label="Осмотреть рабочее место">
        <InteractionMarker icon="⌘" text="Рабочее место" />
      </button>

      <div className="sceneLocation" aria-hidden="true">
        <span>СТАРТОВАЯ КОМНАТА</span>
        <strong>Панелька · ночь</strong>
        <small>Живая faux-3D сцена · глубина, свет и персонажи без PNG</small>
      </div>
    </section>
  );
}
