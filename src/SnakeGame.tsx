import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const COLS = 20;
const ROWS = 15;
const TICK_MS_NORMAL = 240;
const TICK_MS_FAST = 90;

interface Point {
  x: number;
  y: number;
}
type Dir = Point;

/** Fruits only — simple silhouettes read at small sizes */
const FOOD_EMOJIS = [
  '🍎',
  '🍏',
  '🍐',
  '🍊',
  '🍋',
  '🍌',
  '🍉',
  '🍇',
  '🍓',
  '🍈',
  '🍒',
  '🍑',
  '🥝',
  '🥭',
  '🥥',
] as const;

const FOOD_ANIMATIONS = ['pulse', 'shake', 'jump'] as const;
type FoodAnim = (typeof FOOD_ANIMATIONS)[number];

type Food = Point & { emoji: string; anim: FoodAnim };

function pickFoodEmoji(): string {
  const i = Math.floor(Math.random() * FOOD_EMOJIS.length);
  return FOOD_EMOJIS[i] ?? '🍎';
}

function pickFoodAnim(): FoodAnim {
  const i = Math.floor(Math.random() * FOOD_ANIMATIONS.length);
  return FOOD_ANIMATIONS[i] ?? 'pulse';
}

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
} as const satisfies Record<string, Dir>;

type ArrowKey = keyof typeof DIRS;

function dirForKey(key: string): Dir | undefined {
  return key in DIRS ? DIRS[key as ArrowKey] : undefined;
}

function wrap(v: number, max: number): number {
  return ((v % max) + max) % max;
}

/** Body (middle + tail): dense Han — two independent shuffles per game */
const DENSE_BODY_HAN_POOL = [
  '龘',
  '靐',
  '齉',
  '鱻',
  '麤',
  '鑫',
  '森',
  '焱',
  '淼',
  '磊',
  '矗',
  '羴',
  '猋',
  '骉',
  '蟲',
  '鬱',
  '饕',
  '餮',
  '囍',
  '瀛',
  '麟',
  '曦',
  '贔',
  '彝',
  '驫',
  '壘',
  '欝',
  '鸞',
  '麗',
  '鑽',
  '廳',
  '靈',
  '鑰',
  '纛',
  '蠹',
  '蠻',
  '釁',
  '鑿',
  '瓤',
  '雥',
  '爨',
  '癵',
  '驎',
  '蠼',
  '衢',
  '黷',
  '齾',
  '籲',
  '龠',
  '靨',
  '響',
  '饔',
  '䨻',
  '䲜',
  '䵘',
  '䶑',
  '䶥',
  '尾',
  '蛇',
  '蜿',
  '蜒',
  '蠕',
  '鳞',
  '游',
  '末',
  '后',
  '随',
  '跟',
  '夔',
  '羲',
  '瀚',
  '澜',
  '燚',
  '瞐',
  '厵',
  '掱',
  '犇',
  '赑',
  '舙',
  '毳',
  '嚞',
  '譶',
  '灥',
  '皛',
  '惢',
  '歮',
  '轟',
  '聶',
  '鑾',
  '蠱',
] as const;

function shuffledCopy(pool: readonly string[]): string[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = arr[i];
    const b = arr[j];
    arr[i] = b;
    arr[j] = a;
  }
  return arr;
}

const CJK_FONT_STACK =
  '"Noto Sans SC","Source Han Sans SC","Hiragino Sans","Hiragino Kaku Gothic ProN","PingFang SC","Microsoft YaHei","Yu Gothic","Apple SD Gothic Neo",sans-serif';

const CELL_BOX_STYLE = { aspectRatio: '1' as const, containerType: 'size' as const };

/** Scales with the grid cell so glyphs stay inside the box (parent needs container-type: size). */
function glyphFontSize(cqwPercent: number, maxPx: number): string {
  const p = String(cqwPercent);
  const m = String(maxPx);
  return `clamp(5px, min(${p}cqw, ${p}cqh), ${m}px)`;
}

const HEAD_CHAR = '首';

/** 首 at 0° = facing down; rotate so the glyph points the way the snake moves. */
function headRotationDeg(d: Dir): number {
  if (d.x === 0 && d.y === 1) return 0;
  if (d.x === 0 && d.y === -1) return 180;
  if (d.x === 1 && d.y === 0) return -90;
  if (d.x === -1 && d.y === 0) return 90;
  return 0;
}

function randomFood(avoid: Point[]): Food {
  let p: Food;
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
      emoji: pickFoodEmoji(),
      anim: pickFoodAnim(),
    };
  } while (avoid.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function initialSnake(): Point[] {
  const cx = Math.floor(COLS / 2);
  const cy = Math.floor(ROWS / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

/** One glyph per body segment (snake[1]..snake[end]); only grows with a new pool draw when eating. */
function nextBodyGlyphsForTick(
  prevLen: number,
  nextLen: number,
  oldGlyphs: string[],
  ate: boolean,
  appendFromPool: () => string,
): string[] {
  if (ate) {
    const L = prevLen;
    const out = new Array<string>(L);
    if (L < 2) {
      return [appendFromPool()];
    }
    out[0] = oldGlyphs[L - 2] ?? '墨';
    for (let i = 1; i < L - 1; i++) {
      out[i] = oldGlyphs[i - 1] ?? '墨';
    }
    out[L - 1] = appendFromPool();
    return out;
  }
  const n = nextLen;
  if (n <= 1) return [];
  const out = new Array<string>(n - 1);
  out[0] = oldGlyphs[n - 2] ?? '墨';
  for (let i = 1; i < n - 1; i++) {
    out[i] = oldGlyphs[i - 1] ?? '墨';
  }
  return out;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Food>(() => randomFood(initialSnake()));
  const [gameOver, setGameOver] = useState(false);
  const [faceDir, setFaceDir] = useState({ x: 1, y: 0 });
  const glyphPoolRef = useRef(shuffledCopy(DENSE_BODY_HAN_POOL));
  const appendIdxRef = useRef(2);
  const takeAppendGlyph = useCallback(() => {
    const p = glyphPoolRef.current;
    const i = appendIdxRef.current;
    appendIdxRef.current = i + 1;
    return p[i % p.length] ?? '墨';
  }, []);

  const [bodyGlyphs, setBodyGlyphs] = useState<string[]>(() => {
    const p = glyphPoolRef.current;
    return [p[0] ?? '墨', p[1] ?? '墨'];
  });
  const [score, setScore] = useState(0);

  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  useLayoutEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useLayoutEffect(() => {
    foodRef.current = food;
  }, [food]);

  const gameOverRef = useRef(false);

  const dirRef = useRef({ x: 1, y: 0 });
  const pendingRef = useRef({ x: 1, y: 0 });
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const heldArrowKeysRef = useRef(new Set());
  const [arrowHeld, setArrowHeld] = useState(false);

  const reset = useCallback(() => {
    gameOverRef.current = false;
    const s = initialSnake();
    const f = randomFood(s);
    snakeRef.current = s;
    foodRef.current = f;
    setSnake(s);
    setFood(f);
    setGameOver(false);
    dirRef.current = { x: 1, y: 0 };
    pendingRef.current = { x: 1, y: 0 };
    heldArrowKeysRef.current.clear();
    setArrowHeld(false);
    setFaceDir({ x: 1, y: 0 });
    const p = shuffledCopy(DENSE_BODY_HAN_POOL);
    glyphPoolRef.current = p;
    appendIdxRef.current = 2;
    setBodyGlyphs([p[0] ?? '墨', p[1] ?? '墨']);
    setScore(0);
  }, []);

  useEffect(() => {
    const tick = () => {
      if (gameOverRef.current) return;

      const prev = snakeRef.current;

      const d = pendingRef.current;
      const nd = dirRef.current;
      if (d.x + nd.x !== 0 || d.y + nd.y !== 0) {
        dirRef.current = d;
      }
      const dir = dirRef.current;
      setFaceDir({ x: dir.x, y: dir.y });

      const head = prev[0];
      const newHead = {
        x: wrap(head.x + dir.x, COLS),
        y: wrap(head.y + dir.y, ROWS),
      };

      const f = foodRef.current;
      const ate = newHead.x === f.x && newHead.y === f.y;

      // Only self-collision: tail vacates unless we eat and grow.
      const bodyWithoutTail = ate ? prev : prev.slice(0, -1);
      if (bodyWithoutTail.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        gameOverRef.current = true;
        setGameOver(true);
        return;
      }

      const next = [newHead, ...prev];
      if (!ate) {
        next.pop();
      } else {
        setScore((s) => s + 1);
        const nf = randomFood(next);
        foodRef.current = nf;
        setFood(nf);
      }

      snakeRef.current = next;
      setSnake(next);
      setBodyGlyphs((oldG) =>
        nextBodyGlyphsForTick(prev.length, next.length, oldG, ate, takeAppendGlyph),
      );
    };

    const ms = arrowHeld ? TICK_MS_FAST : TICK_MS_NORMAL;
    const id = window.setInterval(tick, ms);
    return () => {
      window.clearInterval(id);
    };
  }, [arrowHeld, takeAppendGlyph]);

  useEffect(() => {
    const syncHeld = () => {
      setArrowHeld(heldArrowKeysRef.current.size > 0);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const d = dirForKey(e.key);
      if (d === undefined) {
        if (gameOverRef.current && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          reset();
        }
        return;
      }
      e.preventDefault();
      heldArrowKeysRef.current.add(e.key);
      syncHeld();
      const cur = dirRef.current;
      if (d.x + cur.x !== 0 || d.y + cur.y !== 0) {
        pendingRef.current = d;
        if (!gameOverRef.current) {
          setFaceDir({ x: d.x, y: d.y });
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (dirForKey(e.key) === undefined) return;
      e.preventDefault();
      heldArrowKeysRef.current.delete(e.key);
      syncHeld();
    };

    const onBlur = () => {
      heldArrowKeysRef.current.clear();
      setArrowHeld(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [reset]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    if (e.changedTouches.length < 1) return;
    const endTouch = e.changedTouches[0];
    const dx = endTouch.clientX - start.x;
    const dy = endTouch.clientY - start.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;

    let d: Dir;
    if (Math.abs(dx) > Math.abs(dy)) {
      d = dx > 0 ? DIRS.ArrowRight : DIRS.ArrowLeft;
    } else {
      d = dy > 0 ? DIRS.ArrowDown : DIRS.ArrowUp;
    }
    const cur = dirRef.current;
    if (d.x + cur.x !== 0 || d.y + cur.y !== 0) {
      pendingRef.current = d;
      if (!gameOverRef.current) {
        setFaceDir({ x: d.x, y: d.y });
      }
    }
  };

  const cells: React.ReactNode[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const snakeIdx = snake.findIndex((s) => s.x === x && s.y === y);
      const isHead = snakeIdx === 0;
      const isBody = snakeIdx > 0;
      const isFood = food.x === x && food.y === y;

      let className =
        'flex min-h-0 min-w-0 items-center justify-center overflow-visible bg-white p-px';
      if (isHead || isBody || isFood) {
        className += ' relative z-[1]';
      }
      let inner: React.ReactNode = null;

      if (isHead) {
        inner = (
          <span
            className="inline-flex items-center justify-center leading-none text-black select-none"
            style={{
              fontSize: glyphFontSize(88, 30),
              fontFamily: CJK_FONT_STACK,
              fontWeight: 900,
              lineHeight: 1,
              transform: `rotate(${String(headRotationDeg(faceDir))}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {HEAD_CHAR}
          </span>
        );
      } else if (isBody) {
        const isTail = snakeIdx === snake.length - 1;
        const bodyChar = bodyGlyphs[snakeIdx - 1] ?? '墨';
        inner = (
          <span
            className="inline-flex items-center justify-center leading-none text-black/38 select-none"
            style={{
              fontSize: glyphFontSize(84, 27),
              fontFamily: CJK_FONT_STACK,
              fontWeight: isTail ? 600 : 550,
              lineHeight: 1,
            }}
          >
            {bodyChar}
          </span>
        );
      } else if (isFood) {
        const foodAnimClass =
          food.anim === 'pulse'
            ? 'food-anim-pulse'
            : food.anim === 'shake'
              ? 'food-anim-shake'
              : 'food-anim-jump';
        inner = (
          <span
            className={`pointer-events-none inline-flex items-center justify-center select-none ${foodAnimClass}`}
            style={{ fontSize: glyphFontSize(92, 34), lineHeight: 1 }}
            role="img"
            aria-hidden
          >
            <span className="inline-block" style={{ transform: 'translateY(0.09em)' }}>
              {food.emoji}
            </span>
          </span>
        );
      }

      cells.push(
        <div key={`${String(x)}-${String(y)}`} className={className} style={CELL_BOX_STYLE}>
          {inner}
        </div>,
      );
    }
  }

  return (
    <div
      className="box-border flex h-full max-h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden overscroll-none p-4"
      role="application"
      aria-label="Snake game"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-[min(96vw,560px)] bg-transparent pb-14">
        <p
          className="mb-2 w-full text-left font-mono text-sm tracking-wider text-black/55 tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {score}
        </p>
        <div
          className="grid w-full gap-0 overflow-visible border border-black/[0.14]"
          style={{
            gridTemplateColumns: `repeat(${String(COLS)}, minmax(0, 1fr))`,
          }}
        >
          {cells}
        </div>

        {gameOver && (
          <button
            type="button"
            onClick={reset}
            className="absolute top-full right-0 left-0 z-10 mt-2 w-full border-0 bg-transparent py-2 font-mono text-[12px] text-black/70 outline-none focus-visible:bg-black/[0.04] active:bg-black/5"
          >
            GAME OVER — TAP OR SPACE
          </button>
        )}
      </div>
    </div>
  );
}
