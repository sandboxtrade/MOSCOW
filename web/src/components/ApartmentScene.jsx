import { memo, useEffect, useRef, useState } from "react";
function InteractionMarker({ icon, text }) {
  return (
    <span className="interactionMarker" aria-hidden="true">
      <span className="interactionPulse" />
      <span className="interactionIcon">{icon}</span>
      <span className="interactionText">{text}</span>
    </span>
  );
}

// Pure deterministic details: no remote textures or random rendering between frames.
const rand01 = (n) => ((Math.sin(n * 127.1 + 42.73) * 43758.5453) % 1 + 1) % 1;
const roomMarks = Array.from({ length: 128 }, (_, n) => ({
  x: 3 + Math.floor(rand01(n + 200) * 351),
  y: 9 + Math.floor(rand01(n + 340) * 268),
  w: 1 + (n % 3 === 0 ? 2 : 0),
  c: n % 5 === 0 ? '#251f27' : n % 3 === 0 ? '#ab8c7e' : '#302b32',
  a: n % 5 === 0 ? .28 : .16,
}));
const floorMarks = Array.from({ length: 108 }, (_, n) => ({
  x: 2 + Math.floor(rand01(n + 800) * 355),
  y: 298 + Math.floor(rand01(n + 925) * 238),
  w: 2 + (n % 4),
  c: n % 3 === 0 ? '#a27a56' : '#1e1b1a',
  a: n % 3 === 0 ? .24 : .2,
}));
const towers = [
  {x:95,y:112,w:19,c:'#1a283d'}, {x:114,y:100,w:17,c:'#243448'},
  {x:131,y:120,w:15,c:'#121d2e'}, {x:146,y:88,w:22,c:'#1b2b43'},
  {x:168,y:106,w:20,c:'#142237'}, {x:188,y:72,w:26,c:'#17243a'},
  {x:214,y:101,w:17,c:'#1a2638'}, {x:230,y:89,w:20,c:'#152239'},
];
const distantTowers = [
  {x:93,y:105,w:15,h:64}, {x:109,y:94,w:18,h:77},
  {x:127,y:105,w:16,h:65}, {x:144,y:98,w:17,h:72},
  {x:163,y:90,w:16,h:83}, {x:179,y:94,w:19,h:75},
  {x:202,y:91,w:17,h:80}, {x:222,y:102,w:20,h:68},
];
const cityWindows = towers.flatMap((b, bi) => {
  const nodes = [];
  const rows = Math.floor((166 - b.y - 7) / 8);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < Math.floor((b.w - 2) / 6); col++) {
      const x = b.x + 3 + 6 * col;
      const y = b.y + 4 + 8 * row;
      const seed = bi * 311 + row * 23 + col * 13;
      if (rand01(seed + 333) > .3) {
        nodes.push({x,y,lit: rand01(seed + 115) > .46, tone: seed % 3});
      }
    }
  }
  return nodes;
});

function SurfaceWear() {
  return (
    <g pointerEvents="none" aria-hidden="true">
      <g className="pixelWallpaperWear">
        {roomMarks.map((m,i) => <rect key={`wm-${i}`} x={m.x} y={m.y} width={m.w} height={i%9===0?3:1} fill={m.c} opacity={m.a} />)}
        <path d="M0 7 H360 M0 290 H360" fill="none" stroke="#a08378" strokeOpacity=".21" strokeWidth="1" />
        <path d="M2 285H360" stroke="#19181c" strokeWidth="3" />
        <path d="M6 287 H359" stroke="#88654f" strokeOpacity=".75" />
        <path d="M311 48 V243 M338 32 V241" stroke="#2b2930" strokeWidth="1" />
        {[46,90,140,202].map((y) => <g key={y}><rect x="305" y={y} width="15" height="3" fill="#33383e" /><rect x="307" y={y} width="11" height="1" fill="#9a928e" opacity=".4" /></g>)}
      </g>
      <g className="floorWear">
        {floorMarks.map((m,i) => <rect key={`fm-${i}`} x={m.x} y={m.y} width={m.w} height="1" fill={m.c} opacity={m.a} />)}
        {Array.from({length:15},(_,i)=><path key={i} d={`M0 ${303+i*18} H360`} stroke="#1b1714" opacity=".32" strokeWidth="1" />)}
        {Array.from({length:15},(_,i)=><path key={i} d={`M${i*27+4} 298 L${i*27-36} 540`} stroke="#ac7953" opacity=".12" strokeWidth="1" />)}
      </g>
    </g>
  );
}

function CityDepth() {
  return (
    <g className="pixelCityDepth" clipPath="url(#cityWindowClip)">
      <rect x="93" y="43" width="156" height="121" fill="#233b60" />
      <rect x="94" y="45" width="155" height="31" fill="#2c4c73" opacity=".54" />
      <path d="M93 102H249 M93 87H249" stroke="#7695b0" strokeOpacity=".12" />
      {Array.from({length:34},(_,i)=>{
        const x=95+Math.floor(rand01(i+495)*148), y=48+Math.floor(rand01(i+629)*56);
        return <rect key={i} x={x} y={y} width="1" height="1" fill={i%3===0?'#c4d5e9':'#81a0c1'} opacity={i%4===0?.68:.27} />;
      })}
      <g opacity=".5">
        {distantTowers.map((b,i)=><g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={i%2?'#324965':'#344c6e'} />
          {Array.from({length:Math.floor((b.h-8)/9)},(_,row)=>
            <rect key={row} x={b.x+3+(row%2)*6} y={b.y+3+row*9} width="2" height="3" fill="#ffe0a4" opacity={row%3===0?.4:.12}/>
          )}
        </g>)}
      </g>
      <rect x="187" y="59" width="22" height="15" fill="#27354c" opacity=".65" />
      <rect x="197" y="62" width="2" height="20" fill="#26364d" />
      <rect className="beaconLight" x="198" y="56" width="2" height="3" fill="#ff7180" />
      <g className="pixelCityNear">
        {towers.map((b,i)=><g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={169-b.y} fill={b.c}/>
          <rect x={b.x+2} y={b.y+1} width="2" height={168-b.y} fill="#70839b" opacity=".16"/>
          <rect x={b.x+b.w-3} y={b.y+1} width="2" height={168-b.y} fill="#050f20" opacity=".45"/>
          <rect x={b.x} y={b.y} width={b.w} height="2" fill="#45566a" opacity=".32"/>
        </g>)}
        {cityWindows.map((w,i)=><rect key={i} className={w.lit && i % 6 === 0 ? `pixelCityLight delay-${i%8}` : undefined} x={w.x} y={w.y} width="2" height="3" fill={w.lit?(w.tone===0?'#ffd894':'#e9bc7a'):'#0a1324'} opacity={w.lit?.84:.75}/>)}
      </g>
      <g opacity=".32">
        <path d="M94 147 L128 136 L132 170 L94 170Z" fill="#0b192c"/>
        <path d="M203 150 L242 132 L250 164 L203 170Z" fill="#091425"/>
      </g>
      <g className="windowReflections">
        <path d="M96 49 L106 49 L128 163 L120 163Z" fill="#8cc0eb" opacity=".065" />
        <rect x="166" y="43" width="3" height="125" fill="#96bee5" opacity=".08" />
      </g>
    </g>
  );
}

function ApartmentClutter() {
  return (
    <g className="pixelApartmentClutter" pointerEvents="none">
      {/* Framed monochrome apartment photos */}
      <rect x="16" y="188" width="29" height="25" fill="#302b2a" stroke="#827365" strokeWidth="2" />
      <rect x="19" y="192" width="23" height="17" fill="#796d68" />
      <path d="M20 208L30 198L40 206" fill="#423f44" />
      <rect x="21" y="196" width="6" height="6" fill="#b5a29a"/>
      {/* sockets, a damp stain and radiator plumbing */}
      <rect x="47" y="276" width="13" height="9" fill="#9b9183" /><rect x="49" y="278" width="9" height="5" fill="#6b655f" />
      <rect x="50" y="279" width="2" height="2" fill="#27272b" /><rect x="55" y="279" width="2" height="2" fill="#27272b" />
      <path d="M118 251H126 V268H134" stroke="#9a948b" strokeWidth="3" fill="none" />
      <path d="M119 250H124" stroke="#413e3c" strokeWidth="1" />
      <path d="M223 248H233V267" stroke="#73716c" strokeWidth="3" fill="none" />
      {/* Rug fringe and richer ornamentation */}
      {Array.from({length:27},(_,i)=><g key={`fr-${i}`}>
        <rect x={52+i*8} y="492" width="2" height={i%3===0?5:3} fill={i%2?'#a87a55':'#704842'}/>
        <rect x={82+i*6} y="348" width="2" height="2" fill="#d4a36e" opacity=".6"/>
      </g>)}
      <path d="M65 475 L274 475 M91 362L240 362" stroke="#b98d57" opacity=".55" strokeWidth="1" />
      {Array.from({length:25},(_,i)=>{
        const col=i%5, row=Math.floor(i/5), x=105+col*31,y=378+row*20;
        return <g key={`mot-${i}`} opacity={.44+(i%3)*.1}>
          <rect x={x} y={y} width="3" height="3" fill="#e1b87a" />
          <rect x={x+8} y={y+5} width="4" height="2" fill="#343c53" />
          <rect x={x-6} y={y+7} width="2" height="3" fill="#bd704d" />
        </g>;
      })}
      {/* Paper, instant coffee and stale mug on table */}
      <rect x="149" y="358" width="17" height="2" fill="#eadcc5" opacity=".62" />
      <rect x="148" y="364" width="12" height="1" fill="#8e7b6b" />
      <rect x="193" y="350" width="10" height="2" fill="#ac8258" />
      <rect x="199" y="363" width="4" height="2" fill="#4a3328" />
      {/* Bed quilt creases, folds and tiny check pattern */}
      <path d="M28 281H119 M28 300H117 M28 319H119" stroke="#b8b3a8" strokeOpacity=".23" strokeWidth="1" />
      {Array.from({length:5},(_,i)=><path key={`b-${i}`} d={`M${38+i*17} 279 V335`} stroke="#2c343f" strokeOpacity=".21" strokeWidth="1"/>)}
      <path d="M30 288L114 296 M31 320L102 323" fill="none" stroke="#d7c4b3" strokeOpacity=".18" strokeWidth="2" />
      {/* TV/desk wiring, stickers and loose desk notes */}
      <path d="M296 230 V260H285V269" fill="none" stroke="#11171c" strokeWidth="2" />
      <rect x="312" y="247" width="7" height="4" fill="#b4c5d4" opacity=".67" />
      <rect x="326" y="250" width="5" height="3" fill="#d6c0a4" />
      <rect x="341" y="307" width="3" height="5" fill="#424343" />
      {/* book spine glints */}
      {[267,275,284,292,302].map((x,i)=><rect key={`bs-${i}`} x={x} y={139+i%2*2} width="1" height="13" fill="#c7b49e" opacity=".46"/>)}
      {/* Light switches, slightly dirty refrigerator and doors */}
      <rect x="327" y="264" width="5" height="8" fill="#a79f96"/>
      <rect x="329" y="266" width="2" height="4" fill="#4a4440"/>
      <rect x="305" y="354" width="47" height="2" fill="#555960" opacity=".35"/>
      <rect x="312" y="362" width="12" height="2" fill="#e6e2d8" opacity=".26"/>
      <rect x="302" y="309" width="50" height="2" fill="#f9f8f0" opacity=".32"/>
      {/* Can and carton near bin */}
      <rect x="285" y="359" width="7" height="12" fill="#aa7a64" />
      <rect x="285" y="358" width="7" height="2" fill="#c9a08d" />
      <rect x="294" y="357" width="4" height="12" fill="#6f8290" />
      {/* Slippers highlights */}
      <rect x="83" y="337" width="8" height="1" fill="#707e90" opacity=".7" />
      <rect x="95" y="339" width="9" height="1" fill="#53647b" opacity=".7" />
    </g>
  );
}

function LightingAndWear() {
  return (
    <g pointerEvents="none">
      {/* Hard stepped pixel light pools, not blurred flat SVG gradients */}
      <g className="pixelLightingBands" opacity=".64">
        <polygon points="94,168 250,168 287,321 58,323" fill="#5182a8" opacity=".06" />
        <polygon points="111,173 231,173 261,283 86,285" fill="#81aacf" opacity=".07" />
        <polygon points="246,226 322,226 358,340 226,321" fill="#ffd189" opacity=".07" />
        <polygon points="262,232 312,232 338,309 244,294" fill="#ffc57d" opacity=".07" />
      </g>
      {/* Warm pool along desk edge and floor shadows */}
      <rect x="246" y="253" width="103" height="2" fill="#d4a269" opacity=".35" />
      <path d="M11 292 H359" stroke="#a17857" strokeOpacity=".25" strokeWidth="1" />
      <path d="M124 331L226 331L240 344L111 344Z" fill="#100e10" opacity=".24" />
      <path d="M296 410L354 410L358 417L292 417Z" fill="#07080a" opacity=".3" />
    </g>
  );
}

function BedTextile() {
  return (
    <g className="bedFabric" pointerEvents="none">
      <clipPath id="bedClothClip"><polygon points="25,277 125,277 125,337 25,337" /></clipPath>
      <g clipPath="url(#bedClothClip)">
        {Array.from({length: 10},(_,i)=><path key={`quilt-v-${i}`} d={`M${24+i*11} 276 L${25+i*10} 343`} stroke={i%2?'#b9b0a7':'#333540'} strokeWidth={i%3===0?'2':'1'} opacity={i%2?.12:.24}/>)}
        {Array.from({length: 7},(_,i)=><path key={`quilt-h-${i}`} d={`M26 ${279+i*9} H124`} stroke={i%2?'#efe8df':'#252832'} strokeWidth="1" opacity={i%2?.12:.2}/>)}
        <path d="M22 321 H123 V334H22Z" fill="#2b3547" opacity=".56" />
        <path d="M29 323 L47 328 L60 323 L77 330 L93 326 L119 332" fill="none" stroke="#65809c" strokeWidth="2" opacity=".27" />
      </g>
      <polygon points="13,250 54,250 73,278 27,278" fill="#ede9e0" opacity=".14" />
      <path d="M25 275 L57 275 L51 270 L25 270" fill="#c6c1b5" opacity=".55" />
      <path d="M33 281L115 282" fill="none" stroke="#ffffff" opacity=".18" strokeWidth="1" />
      <path d="M25 309H112 M25 316H112" stroke="#d1c8bb" strokeOpacity=".12" strokeWidth="1" />
      <rect x="53" y="331" width="57" height="3" fill="#1d2738" opacity=".58" />
    </g>
  );
}

function PixelDeskChair() {
  return (
    <g className="deskChair" pointerEvents="none">
      {/* compact office chair tucked into the workstation */}
      <rect x="223" y="282" width="24" height="35" fill="#141b25" />
      <rect x="226" y="286" width="18" height="27" fill="#344357" />
      <rect x="227" y="288" width="2" height="20" fill="#5b6a78" opacity=".4" />
      <path d="M224 310H249V315H224Z" fill="#10161f" />
      <path d="M224 315H251V322H224Z" fill="#242b34" />
      <rect x="234" y="322" width="4" height="21" fill="#11171f" />
      <path d="M220 345H252" stroke="#1b2028" strokeWidth="3" />
      <rect x="217" y="344" width="7" height="4" fill="#11171c" />
      <rect x="249" y="344" width="7" height="4" fill="#11171c" />
    </g>
  );
}

function PixelLampGlowFields() {
  return (
    <g className="pixelLampFields" pointerEvents="none">
      <path className="pixelWarmField" d="M248 225H271V236H278V255H286V270H235V256H241V239H248Z" fill="#f7d59a" opacity=".09" />
      <path className="pixelWarmField" d="M324 149H343V169H349V188H309V170H315V156H324Z" fill="#f5ce85" opacity=".07" />
      <rect x="269" y="242" width="61" height="2" fill="#e4a873" opacity=".2" />
      <rect x="220" y="294" width="61" height="2" fill="#bb945f" opacity=".12" />
    </g>
  );
}

const alphabet3x5 = {
  'А':['010','101','111','101','101'],
  'Б':['111','100','110','101','110'],
  'В':['110','101','110','101','110'],
  'Г':['111','100','100','100','100'],
  'Д':['011','101','101','111','101'],
  'Е':['111','100','110','100','111'],
  'Ж':['101','101','111','101','101'],
  'К':['101','101','110','101','101'],
  'Л':['011','101','101','101','101'],
  'М':['101','111','111','101','101'],
  'Н':['101','101','111','101','101'],
  'О':['111','101','101','101','111'],
  'Р':['110','101','110','100','100'],
  'С':['111','100','100','100','111'],
  'Т':['111','010','010','010','010'],
  'Ь':['100','100','110','101','110'],
  'Ш':['101','101','101','101','111'],
  'Ы':['101','101','111','101','111'],
};
function PixelBitmapText({ text, x, y, color='#e9daca', scale=1 }) {
  const nodes=[];
  [...text].forEach((letter, index) => {
    const rows=alphabet3x5[letter];
    if (!rows) return;
    rows.forEach((row,ri)=> [...row].forEach((v,ci)=> {
      if(v==='1') nodes.push(<rect key={`${index}-${ri}-${ci}`} x={x+index*4*scale+ci*scale} y={y+ri*scale} width={scale} height={scale} fill={color}/>);
    }));
  });
  return <g shapeRendering="crispEdges">{nodes}</g>;
}

function PixelPerson({ x, y, guide = false, talking = false, walking = false, facing = 1 }) {
  const plaid = guide ? "url(#guidePlaidPixel)" : "#182532";

  return (
    <g
      className={`pixelPerson ${guide ? "guidePixel" : "playerPixel"} ${talking ? "talking" : ""} ${walking ? "walking" : ""}`}
      transform={`translate(${x} ${y})`}
    >
      <rect className="pixelPersonShadow" x="-13" y="-2" width="28" height="5" />
      <g transform={`scale(${facing} 1)`}><g className="pixelPersonBody">
        {/* cast shadow and depth */}
        <rect x="-14" y="-4" width="30" height="3" fill="#05090d" opacity=".4" />
        {[[-10, 'left'], [2, 'right']].map(([lx, side]) => (
          <g key={side} className={`personLegRig ${side}`}>
            <rect className="pxOutline" x={lx} y="-27" width="10" height="27" />
            <rect className="pxLeg" x={lx+2} y="-25" width="6" height="22" />
            <rect x={lx+2} y="-17" width="5" height="2" fill="#35404a" />
            <rect className="pxShoe" x={lx-1} y="-4" width="12" height="5" />
            <rect className="pxShoeLight" x={lx+1} y="-3" width="7" height="1" />
          </g>
        ))}
        <g className="personUpperRig">
        {/* body */}
        <rect className="pxOutline" x="-14" y="-58" width="29" height="34" />
        <rect className="pxTorso" x="-12" y="-56" width="25" height="30" fill={plaid} />
        <rect className="pxTorsoShade" x="-12" y="-33" width="25" height="7" />
        <rect className="pxHood" x="-10" y="-61" width="21" height="8" />
        <rect className="pxHoodInner" x="-7" y="-59" width="15" height="5" />
        {!guide && <rect className="pxPlayerZip" x="0" y="-54" width="1" height="24" />}

        {/* clothing seams, layered pockets, plaid/shading */}
        <rect x="-10" y="-50" width="7" height="2" fill={guide?'#b98a87':'#3a4b5c'} opacity=".78" />
        <rect x="6" y="-50" width="6" height="2" fill={guide?'#aa8184':'#4e6171'} opacity=".65" />
        <rect x="-12" y="-39" width="8" height="8" fill={guide?'#35252d':'#141c25'} opacity=".66" />
        <rect x="7" y="-39" width="5" height="8" fill={guide?'#392630':'#101922'} opacity=".6" />
        <rect x="-1" y="-54" width="2" height="24" fill={guide?'#b28d86':'#769cb4'} opacity=".44" />
        <rect x="-11" y="-56" width="7" height="2" fill="#d0aa9d" opacity={guide ? .36 : .05}/>
        <rect x="6" y="-56" width="6" height="2" fill="#d0aa9d" opacity={guide ? .36 : .05}/>
        <rect x="-12" y="-32" width="25" height="2" fill="#1a1c22" opacity=".74" />
        {/* arms */}
        <g className="personArmRig left">
        <rect className="pxOutline" x="-19" y="-53" width="7" height="27" />
        <rect className="pxArm" x="-17" y="-51" width="4" height="23" fill={guide ? "#703944" : "#1d2b38"} />
        <rect x="-16" y="-31" width="4" height="4" fill={guide?'#b67959':'#8a6254'} />
        </g><g className="personArmRig right">
        {talking ? (
          <>
            <rect className="pxOutline" x="13" y="-53" width="7" height="17" />
            <rect className="pxArm" x="15" y="-51" width="4" height="13" fill="#703944" />
            <rect className="pxOutline" x="18" y="-39" width="13" height="7" />
            <rect className="pxArm" x="19" y="-37" width="10" height="4" fill="#703944" />
            <rect className="pxSkin" x="29" y="-37" width="5" height="5" />
          </>
        ) : (
          <>
            <rect className="pxOutline" x="13" y="-53" width="7" height="27" />
            <rect className="pxArm" x="15" y="-51" width="4" height="23" fill={guide ? "#703944" : "#1d2b38"} />
          </>
        )}

        {/* cuff and pocket hand */}
        {!talking && <rect x="15" y="-30" width="4" height="3" fill={guide?'#b67959':'#93654e'}/>}
        </g>
        <g className="personHeadRig">
        {/* neck + head */}
        <rect className="pxSkinShade" x="-4" y="-65" width="9" height="7" />
        <rect className="pxOutline" x="-11" y="-84" width="23" height="21" />
        <rect className="pxSkin" x="-9" y="-82" width="19" height="17" />
        <rect className="pxSkinShade" x="8" y="-78" width="2" height="10" />
        <rect className="pxHair" x="-10" y="-86" width="21" height="8" />
        <rect className="pxHair" x="-7" y="-89" width="5" height="4" />
        <rect className="pxHair" x="1" y="-91" width="6" height="5" />
        <rect className="pxHairWarm" x="6" y="-87" width="5" height="2" />
        <rect className="pxHair" x="-13" y="-83" width="6" height="8" />
        <rect className="pxHair" x="7" y="-83" width="5" height="5" />
        <rect className="pxHair" x="-9" y="-92" width="4" height="5" />
        <rect className="pxHair" x="9" y="-90" width="4" height="6" />
        <rect x="-7" y="-79" width="12" height="1" fill="#d39474" opacity=".68" />
        <rect x="-8" y="-67" width="3" height="2" fill="#8c5044" opacity=".44" />
        <rect x="6" y="-68" width="3" height="2" fill="#8c5044" opacity=".44" />
        <rect x="-6" y="-63" width="12" height="1" fill="#513c37" opacity=".7" />
        <rect className="pxBrow" x="-6" y="-76" width="5" height="1" />
        <rect className="pxBrow" x="3" y="-76" width="5" height="1" />
        <rect className="pxEye" x="-5" y="-74" width="2" height="2" />
        <rect className="pxEye" x="5" y="-74" width="2" height="2" />
        <rect className="pxFaceLine" x="0" y="-70" width="2" height="3" />
        <rect className="pxMouth" x="-3" y="-67" width="7" height="1" />

        </g>
        {guide && (
          <>
            <rect className="pxBagStrap" x="-8" y="-55" width="3" height="28" transform="rotate(-25 -8 -55)" />
            <rect className="pxOutline" x="7" y="-39" width="15" height="13" />
            <rect className="pxBag" x="9" y="-37" width="11" height="9" />
            <rect className="pxBagZip" x="11" y="-34" width="7" height="1" />
            <rect x="15" y="-54" width="2" height="4" fill="#d4aa80" opacity=".65" />
            <rect x="12" y="-36" width="2" height="2" fill="#473740" />
            <rect x="17" y="-35" width="2" height="2" fill="#53444c" />
            <rect x="10" y="-30" width="9" height="1" fill="#625459" opacity=".54"/>
            <rect className="pxScar" x="8" y="-73" width="1" height="4" />
          </>
        )}
      </g></g></g>
    </g>
  );
}

const ApartmentPixelWorld = memo(function ApartmentPixelWorld({ phoneOwned }) {
  const cityLights = [
    [118, 87], [126, 94], [134, 76], [144, 99], [154, 85], [165, 70], [175, 91], [188, 78],
    [199, 97], [211, 83], [221, 65], [229, 91], [238, 76], [249, 95],
  ];

  return (
    <svg
      className="pixelRoomWorld"
      viewBox="0 0 360 540"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="cityWindowClip"><rect x="93" y="43" width="156" height="121" /></clipPath>
        <pattern id="wallpaperPixel" width="12" height="16" patternUnits="userSpaceOnUse">
          <rect width="12" height="16" fill="#675b5b" />
          <rect x="5" y="3" width="2" height="2" fill="#87736f" opacity=".48" />
          <rect x="4" y="8" width="1" height="3" fill="#7f6a67" opacity=".42" />
          <rect x="7" y="8" width="1" height="3" fill="#7f6a67" opacity=".42" />
          <rect x="5" y="12" width="2" height="1" fill="#8f7872" opacity=".38" />
        </pattern>
        <pattern id="floorPixel" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill="#4e3a2e" />
          <rect y="11" width="24" height="1" fill="#2e241e" />
          <rect x="12" width="1" height="12" fill="#33271f" opacity=".65" />
          <rect x="2" y="2" width="8" height="1" fill="#6b5040" opacity=".34" />
        </pattern>
        <pattern id="rugPixel" width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill="#66323b" />
          <rect x="2" y="2" width="14" height="14" fill="none" stroke="#ac704e" strokeWidth="1" />
          <rect x="7" y="7" width="4" height="4" fill="#d19a67" />
          <rect x="8" y="3" width="2" height="2" fill="#303a52" />
          <rect x="3" y="8" width="2" height="2" fill="#303a52" />
          <rect x="13" y="8" width="2" height="2" fill="#303a52" />
        </pattern>
        <pattern id="guidePlaidPixel" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#6a3340" />
          <rect y="3" width="8" height="1" fill="#a77c7e" />
          <rect x="3" width="1" height="8" fill="#a77c7e" />
          <rect y="6" width="8" height="1" fill="#27232a" />
          <rect x="6" width="1" height="8" fill="#27232a" />
        </pattern>
      </defs>

      {/* wall and floor */}
      <rect className="pxVoid" width="360" height="540" />
      <rect x="0" y="0" width="360" height="336" fill="url(#wallpaperPixel)" />
      <polygon points="0,292 360,292 360,540 0,540" fill="url(#floorPixel)" />
      <rect x="0" y="288" width="360" height="6" fill="#30231f" />
      <rect x="0" y="294" width="360" height="2" fill="#7b5b49" opacity=".5" />

      <SurfaceWear />

      {/* exposed pipes */}
      <rect x="309" y="0" width="4" height="258" fill="#55575a" />
      <rect x="314" y="0" width="2" height="258" fill="#24282d" />
      <rect x="336" y="0" width="3" height="248" fill="#55575a" />
      <rect x="0" y="27" width="340" height="3" fill="#4f5155" />
      <rect x="0" y="31" width="340" height="2" fill="#262a2f" />

      {/* posters */}
      <g className="pixelPosters">
        <rect x="10" y="73" width="35" height="47" fill="#d6cec0" />
        <rect x="13" y="76" width="29" height="41" fill="#a2453d" />
        <rect x="19" y="77" width="2" height="8" fill="#342b35" />
        <rect x="22" y="81" width="3" height="4" fill="#30323b" />
        <rect x="27" y="79" width="2" height="6" fill="#30323b" />
        <rect x="31" y="78" width="2" height="7" fill="#30323b" />
        <rect x="35" y="81" width="3" height="4" fill="#30323b" />
        <PixelBitmapText text="МОСКВА" x={15} y={88} color="#f3e3d3" />
        <PixelBitmapText text="ВСЕГДА" x={15} y={98} color="#f3e3d3" />
        <PixelBitmapText text="ДАЛЬШЕ" x={15} y={108} color="#f3e3d3" />
        <rect x="13" y="128" width="42" height="38" fill="#d8d2c7" />
        <rect x="17" y="132" width="16" height="25" fill="#33373c" />
        <rect x="36" y="132" width="15" height="25" fill="#1a1d21" />
        <rect x="21" y="136" width="5" height="9" fill="#a59a8d" />
        <rect x="40" y="137" width="5" height="9" fill="#756b64" />
      </g>

      {/* window */}
      <g className="pixelWindow">
        <rect x="86" y="36" width="170" height="135" fill="#c1c3c4" />
        <rect x="91" y="41" width="160" height="125" fill="#11243b" />
        <rect x="94" y="44" width="154" height="119" fill="#1f4168" />
        <rect x="94" y="44" width="154" height="29" fill="#2b5078" opacity=".66" />

        <CityDepth />
        <g clipPath="url(#cityWindowClip)" pointerEvents="none">
          {Array.from({length: 28}, (_, i) => <path key={i} className="roomRain" d={`M${95+i*6} 24 l-4 13`} stroke="#a4c5dc" strokeWidth="1" opacity=".27" style={{animationDelay: `${-i*.137}s`, animationDuration: `${.85+(i%4)*.19}s`}} />)}
          <g className="streetTraffic"><rect x="93" y="155" width="8" height="2" fill="#efd4a0"/><rect x="104" y="155" width="3" height="2" fill="#d97461"/></g>
        </g>

        {/* generated city architecture and animated windows */}
        <rect x="169" y="41" width="4" height="125" fill="#cfd0ce" />
        <rect x="91" y="99" width="160" height="4" fill="#cfd0ce" />
        <rect className="pixelWindowGlint" x="100" y="50" width="4" height="94" fill="#7db9ed" opacity=".14" />
        <rect className="pixelWindowGlint glintTwo" x="180" y="48" width="3" height="100" fill="#7db9ed" opacity=".1" />

        {/* curtains */}
        <polygon className="pixelCurtain leftCurtain" points="66,31 88,31 96,176 69,181" fill="#85848b" />
        <rect x="72" y="39" width="3" height="132" fill="#66666f" opacity=".68" />
        <rect x="80" y="38" width="3" height="136" fill="#6a6972" opacity=".62" />
        <polygon className="pixelCurtain rightCurtain" points="253,31 276,31 273,178 247,171" fill="#85848b" />
        <rect x="260" y="39" width="3" height="132" fill="#66666f" opacity=".68" />
        <rect x="268" y="40" width="3" height="130" fill="#6a6972" opacity=".62" />
      </g>

      {/* window sill items */}
      <rect x="94" y="166" width="158" height="8" fill="#726157" />
      <rect x="97" y="174" width="154" height="3" fill="#463a34" />
      <rect x="136" y="153" width="12" height="13" fill="#293c39" />
      <rect x="138" y="150" width="8" height="4" fill="#4e7061" />
      <rect x="201" y="149" width="17" height="17" fill="#685548" />
      <rect x="205" y="140" width="3" height="12" fill="#355f41" />
      <rect x="210" y="137" width="3" height="15" fill="#416f4b" />
      <rect x="216" y="143" width="3" height="10" fill="#3a6746" />

      {/* radiator */}
      <g className="pixelRadiator">
        <rect x="126" y="182" width="93" height="7" fill="#8a8682" />
        {[132, 145, 158, 171, 184, 197, 210].map((x) => (
          <g key={x}>
            <rect x={x} y="188" width="8" height="62" fill="#777674" />
            <rect x={x + 2} y="190" width="2" height="58" fill="#9a9790" opacity=".55" />
          </g>
        ))}
        <rect x="121" y="246" width="103" height="5" fill="#4c4a48" />
      </g>

      {/* bed */}
      <g className="pixelBed">
        <polygon points="0,261 111,261 132,291 20,291" fill="#51483f" />
        <polygon points="20,291 132,291 132,375 20,375" fill="#4a4039" />
        <polygon points="0,261 20,291 20,375 0,345" fill="#3c322c" />
        <polygon points="8,250 107,250 125,276 24,276" fill="#a9a39b" />
        <polygon points="24,276 125,276 125,336 24,336" fill="#6f6d6d" />
        <polygon points="14,256 53,256 68,276 28,276" fill="#d3cdc2" />
        <rect x="33" y="282" width="82" height="5" fill="#88817b" opacity=".72" />
        <rect x="33" y="291" width="79" height="4" fill="#4a4650" opacity=".65" />
        <rect x="33" y="302" width="77" height="4" fill="#88817b" opacity=".64" />
        <rect x="33" y="312" width="75" height="4" fill="#4a4650" opacity=".63" />
        <polygon points="20,316 74,316 99,338 43,338" fill="#17233a" opacity=".88" />
      </g>

      <BedTextile />

      {/* nightstand */}
      <g className="pixelNightstand">
        <rect x="102" y="239" width="35" height="43" fill="#513827" />
        <rect x="105" y="243" width="29" height="12" fill="#62442f" />
        <rect x="105" y="258" width="29" height="11" fill="#59402e" />
        <rect x="105" y="272" width="29" height="7" fill="#4a3427" />
        <rect x="126" y="248" width="3" height="2" fill="#c49a65" />
        <rect x="126" y="262" width="3" height="2" fill="#c49a65" />
        <rect x="106" y="228" width="24" height="11" fill="#242a2c" />
        <rect x="108" y="230" width="20" height="6" fill="#111d20" />
        <path d="M110 231h3v2h-3v2h3 M116 231h3v4h-3 M122 232v1 M122 234v1" stroke="#99b18c" strokeWidth="1" fill="none"/>
        <rect x="121" y="230" width="12" height="4" fill="#73584a" />
      </g>

      {/* wall shelf */}
      <g className="pixelShelf">
        <rect x="260" y="157" width="74" height="7" fill="#573b2a" />
        <rect x="265" y="132" width="7" height="25" fill="#87494a" />
        <rect x="274" y="137" width="7" height="20" fill="#4f6b8b" />
        <rect x="283" y="129" width="6" height="28" fill="#887a63" />
        <rect x="291" y="135" width="8" height="22" fill="#54525a" />
        <rect x="301" y="139" width="7" height="18" fill="#855247" />
        <rect x="315" y="145" width="13" height="12" fill="#674f3d" />
        <rect x="319" y="135" width="2" height="10" fill="#3a6946" />
        <rect x="324" y="132" width="2" height="13" fill="#48744e" />
        <rect x="314" y="138" width="2" height="8" fill="#49714c" />
      </g>

      {/* desk + work area */}
      <g className="pixelDesk">
        <polygon points="233,238 335,238 351,255 249,255" fill="#7a5335" />
        <rect x="249" y="255" width="102" height="79" fill="#533725" />
        <rect x="249" y="255" width="5" height="79" fill="#3a271e" />
        <rect x="339" y="255" width="5" height="79" fill="#3a271e" />
        <rect x="257" y="270" width="33" height="13" fill="#62442e" />
        <rect x="310" y="270" width="31" height="13" fill="#62442e" />
        <rect x="257" y="288" width="33" height="13" fill="#5b3f2c" />
        <rect x="310" y="288" width="31" height="13" fill="#5b3f2c" />
        <rect x="284" y="275" width="3" height="2" fill="#bd9060" />
        <rect x="334" y="275" width="3" height="2" fill="#bd9060" />

        {/* monitor */}
        <rect x="270" y="190" width="58" height="42" fill="#11161d" />
        <rect x="274" y="194" width="50" height="34" fill="#12344f" />
        <rect className="pixelMonitorGlow" x="278" y="199" width="28" height="3" fill="#4cb7e9" />
        <rect className="pixelMonitorGlow scanTwo" x="278" y="207" width="38" height="2" fill="#2f759d" />
        <rect className="pixelMonitorGlow scanThree" x="278" y="215" width="24" height="2" fill="#61d8ff" />
        <rect x="297" y="232" width="5" height="8" fill="#252a2e" />
        <rect x="287" y="239" width="25" height="4" fill="#2a2d31" />

        {/* laptop/keyboard */}
        <polygon points="275,245 318,245 327,253 284,253" fill="#24272c" />
        <rect x="281" y="246" width="34" height="1" fill="#6f777d" opacity=".7" />

        {/* lamp */}
        <rect x="247" y="219" width="4" height="30" fill="#30343a" />
        <rect x="246" y="217" width="13" height="4" fill="#34393f" />
        <rect className="pixelLampBulb" x="257" y="214" width="7" height="7" fill="#ffd887" />
        <rect className="pixelLampAura" x="246" y="207" width="30" height="30" fill="#ffd887" opacity=".08" />

        {/* desk clutter */}
        <rect x="321" y="244" width="8" height="5" fill="#d2c0a4" />
        <rect x="332" y="244" width="7" height="6" fill="#53453a" />
      </g>

      <PixelDeskChair />
      <PixelLampGlowFields />

      {/* fridge */}
      <g className="pixelFridge">
        <rect x="299" y="307" width="55" height="103" fill="#bebfbc" />
        <rect x="302" y="311" width="49" height="43" fill="#c9cac6" />
        <rect x="302" y="357" width="49" height="50" fill="#b4b6b3" />
        <rect x="305" y="353" width="43" height="3" fill="#6d7070" />
        <rect x="344" y="320" width="3" height="23" fill="#737778" />
        <rect x="344" y="366" width="3" height="25" fill="#737778" />
        <rect x="309" y="327" width="10" height="7" fill="#6f95b0" />
        <rect x="323" y="334" width="7" height="8" fill="#d47e6e" />
        <rect x="335" y="325" width="8" height="5" fill="#d9c596" />
      </g>

      {/* microwave */}
      <g className="pixelMicrowave">
        <rect x="306" y="281" width="42" height="26" fill="#c5c7ca" />
        <rect x="310" y="285" width="26" height="17" fill="#1b2127" />
        <rect x="339" y="286" width="5" height="3" fill="#434950" />
        <rect x="339" y="292" width="5" height="3" fill="#5ab6ff" opacity=".58" />
      </g>

      {/* door + coat */}
      <g className="pixelDoor">
        <rect x="334" y="172" width="26" height="114" fill="#34251f" />
        <rect x="338" y="177" width="18" height="104" fill="#453026" />
        <rect x="340" y="183" width="14" height="44" fill="#3a2923" />
        <rect x="340" y="232" width="14" height="43" fill="#3a2923" />
        <rect x="339" y="229" width="16" height="2" fill="#654638" />
        <rect x="340" y="236" width="3" height="3" fill="#d3aa6b" />
        <rect x="324" y="205" width="2" height="25" fill="#7d7f82" />
        <polygon points="320,229 332,229 337,262 320,262" fill="#a36778" opacity=".85" />
      </g>

      {/* hanging bulb */}
      <g className="pixelBulb">
        <rect x="326" y="36" width="2" height="93" fill="#292c30" />
        <rect x="322" y="129" width="10" height="5" fill="#303236" />
        <rect className="pixelBulbCore" x="320" y="134" width="14" height="14" fill="#f4ce71" />
        <rect className="pixelBulbGlow" x="311" y="125" width="32" height="32" fill="#ffd97a" opacity=".08" />
      </g>

      {/* rug */}
      <polygon points="74,345 252,345 292,494 46,494" fill="url(#rugPixel)" />
      <polygon points="86,355 241,355 274,482 59,482" fill="none" stroke="#c3875f" strokeWidth="3" />

      {/* slippers */}
      <rect x="80" y="335" width="14" height="6" fill="#1c2940" transform="rotate(-8 80 335)" />
      <rect x="93" y="337" width="14" height="6" fill="#17243a" transform="rotate(6 93 337)" />

      {/* coffee table */}
      <g className="pixelCoffeeTable">
        <polygon points="116,349 195,349 220,368 141,368" fill="#795238" />
        <rect x="141" y="368" width="79" height="8" fill="#563925" />
        <rect x="151" y="395" width="57" height="4" fill="#483224" />
        <rect x="159" y="390" width="27" height="5" fill="#777369" />
        <rect x="159" y="390" width="24" height="1" fill="#b4ac96" />
        <rect x="147" y="373" width="4" height="40" fill="#30221a" />
        <rect x="207" y="373" width="4" height="40" fill="#30221a" />
        <rect x="145" y="354" width="18" height="12" fill="#d3c2a4" />
        <rect x="148" y="357" width="12" height="1" fill="#635348" />
        <rect x="148" y="361" width="10" height="1" fill="#635348" />
        <rect x="172" y="354" width="12" height="12" fill="#3b3430" />
        <rect x="176" y="357" width="4" height="4" fill="#ba8f62" />
        <rect x="190" y="352" width="9" height="12" fill="#cbb18a" />
        <rect x="198" y="355" width="5" height="4" fill="none" stroke="#cbb18a" strokeWidth="1" />
      </g>

      {/* stool */}
      <g className="pixelStool">
        <rect x="213" y="397" width="31" height="9" fill="#70492f" />
        <rect x="217" y="405" width="5" height="35" fill="#4b3022" />
        <rect x="236" y="405" width="5" height="35" fill="#4b3022" />
      </g>

      {/* lower shelf foreground */}
      <g className="pixelForegroundShelf">
        <rect x="0" y="425" width="54" height="115" fill="#34261f" />
        <rect x="5" y="431" width="44" height="31" fill="#1f2024" />
        <rect x="5" y="468" width="44" height="29" fill="#24242a" />
        <rect x="5" y="503" width="44" height="31" fill="#292328" />
        <rect x="10" y="438" width="8" height="18" fill="#5c6c8b" />
        <rect x="21" y="441" width="7" height="15" fill="#876648" />
        <rect x="31" y="437" width="8" height="19" fill="#55505f" />
        <path d="M10 488 L20 473 L31 488" fill="#171c28" />
      </g>

      {/* phone */}
      {!phoneOwned && (
        <g className="pixelWorldPhone">
          <rect x="226" y="312" width="10" height="16" fill="#07111a" />
          <rect className="pixelPhoneScreen" x="228" y="314" width="6" height="11" fill="#3dc6ff" opacity=".6" />
        </g>
      )}

      <ApartmentClutter />
      <LightingAndWear />


      <g className="coffeeSteam" fill="none" stroke="#dccab3" opacity=".25">
        <path d="M194 350v-4h-2v-5h2v-4"/><path d="M198 347v-4h2v-5"/>
      </g>
      <g className="roomNightShade" pointerEvents="none"><rect width="360" height="540" fill="#06162d" opacity=".36"/></g>
      {/* atmospheric dust */}
      <g className="pixelDust" fill="#b8d8e7">
        <rect x="110" y="184" width="1" height="1" />
        <rect x="188" y="204" width="1" height="1" />
        <rect x="226" y="179" width="1" height="1" />
        <rect x="269" y="248" width="1" height="1" />
        <rect x="91" y="226" width="1" height="1" />
      </g>
    </svg>
  );
});

export default function ApartmentScene({ introDone, phoneOwned, guideTalking, onGuide, onPhone, onWorkstation }) {
  const [lampOn, setLampOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [actor, setActor] = useState({x:150, y:452, walking:false, facing:1});
  const [activity, setActivity] = useState('Выбери предмет — персонаж подойдёт к нему');
  const actorRef = useRef(actor);
  const frame = useRef(0);
  const motion = useRef(null);
  const blocked = useRef(false);
  blocked.current = guideTalking;
  useEffect(() => {
    const visibility = () => { if (motion.current) motion.current.last = 0; };
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame.current); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (guideTalking) {
      cancelAnimationFrame(frame.current);
      motion.current = null;
      actorRef.current = {...actorRef.current, walking:false};
      setActor(actorRef.current);
    }
  }, [guideTalking]);
  function approach(kind, callback) {
    if (blocked.current) return;
    cancelAnimationFrame(frame.current);
    const current = actorRef.current;
    const destinations = {guide:[205,452], phone:[279,375], desk:[300,345]};
    const end = destinations[kind];
    // Floor corridor passes below the coffee table and around the stool.
    const points = [[current.x,462],[280,462],[280,end[1]],end];
    if (kind === 'guide') points.splice(1, points.length-1, [205,462],end);
    const reduced = paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      actorRef.current = {x:end[0], y:end[1], walking:false, facing:kind==='guide'?1:-1};
      setActor(actorRef.current); motion.current=null; setActivity('Выбери предмет для взаимодействия'); callback();
    };
    if (reduced) { finish(); return; }
    motion.current = {points, last:0};
    setActivity(kind==='guide'?'Идём к проводнику…':kind==='phone'?'Подходим к телефону…':'Подходим к рабочему месту…');
    function tick(now) {
      const move = motion.current;
      if (!move) return;
      if (document.hidden) { move.last=0; frame.current=requestAnimationFrame(tick); return; }
      const dt = move.last ? Math.min((now-move.last)/1000,.05) : 0;
      move.last=now;
      const [tx,ty]=move.points[0];
      const p=actorRef.current, dx=tx-p.x, dy=ty-p.y, distance=Math.hypot(dx,dy), step=dt*100;
      if (distance<=step || distance<.1) {
        actorRef.current={...p,x:tx,y:ty}; move.points.shift();
        if (!move.points.length) { finish(); return; }
      } else actorRef.current={x:p.x+dx/distance*step,y:p.y+dy/distance*step,walking:true,facing:Math.abs(dx)>.1?Math.sign(dx):p.facing};
      setActor({...actorRef.current}); frame.current=requestAnimationFrame(tick);
    }
    frame.current=requestAnimationFrame(tick);
  }

  return (
    <section
      className={`apartmentScene pixelRoomScene ${lampOn ? "" : "lampOff"} ${paused ? "motionPaused" : ""}`}
      aria-label="Пиксельная комната в московской панельке ночью"
    >
      <div className="roomStage">
      <div className="pixelRoomCamera">
        <ApartmentPixelWorld phoneOwned={phoneOwned} />
        <svg className="pixelRoomWorld actorLayer" viewBox="0 0 360 540" aria-hidden="true">
          {actor.y < 414 && <PixelPerson x={actor.x} y={actor.y} walking={actor.walking} facing={actor.facing} />}
          <PixelPerson x={248} y={414} guide talking={guideTalking} />
          {actor.y >= 414 && <PixelPerson x={actor.x} y={actor.y} walking={actor.walking} facing={actor.facing} />}
        </svg>
      </div>
      <div className="pixelRoomAtmosphere" aria-hidden="true" />
      <div className="pixelRoomNoise" aria-hidden="true" />

      <button className="interactionTarget guideTarget" onClick={() => approach("guide", onGuide)} aria-label="Поговорить с проводником">
        <InteractionMarker icon="!" text="Поговорить" />
      </button>

      <button
        className={`interactionTarget phoneTarget ${!introDone || phoneOwned ? "disabled" : "ready"}`}
        onClick={() => approach("phone", onPhone)}
        disabled={!introDone || phoneOwned}
        aria-label={phoneOwned ? "Телефон уже куплен" : "Купить телефон"}
      >
        <InteractionMarker
          icon={phoneOwned ? "✓" : "▣"}
          text={phoneOwned ? "Телефон куплен" : introDone ? "Телефон · 15 000 ₽G" : "Сначала поговори"}
        />
      </button>

      <button className="interactionTarget workstationTarget" onClick={() => approach("desk", onWorkstation)} aria-label="Осмотреть рабочее место">
        <InteractionMarker icon="⌘" text="Рабочее место" />
      </button>

      </div>
      <div className="roomControls">
        <button type="button" aria-pressed={lampOn} onClick={() => setLampOn(v=>!v)}>{lampOn ? '◉ Свет' : '○ Свет'}</button>
        <button type="button" aria-pressed={paused} onClick={() => setPaused(v=>!v)}>{paused ? '▶ Фон' : 'Ⅱ Фон'}</button>
      </div>
      <div className="roomActivity" role="status">{activity}</div>
      <div className="sceneLocation" aria-hidden="true">
        <span>СТАРТОВАЯ КОМНАТА</span>
        <strong>Панелька · ночь</strong>
        <small>За окном дождь · 23:48</small>
      </div>
    </section>
  );
}
