// Covers the phone-only docking of the floating Book Now pill (App.js): while
// you scroll the footer it parks itself beside the Directions link instead of
// floating over the footer's tail.
//
// jsdom has no layout engine, so everything the effect measures is stubbed:
// element rects, the pill's offsetHeight, the viewport size, and a manual
// requestAnimationFrame queue so the rAF-throttled scroll listener runs exactly
// when we ask it to.
import { act, render, screen } from "@testing-library/react";
import App from "./App";

const PHONE_QUERY = "(max-width: 768px)";
const PILL_HEIGHT = 50;
const VIEWPORT = { width: 390, height: 800 };

// The Directions row's rect, in viewport coordinates
let rowRect = { top: 500, height: 40, right: 342 };
let isPhone = true;
let rafQueue = [];
let rafId = 0;
let originalOffsetHeight;

const rect = ({ top, height, right }) => ({
  top,
  height,
  right,
  bottom: top + height,
  left: right - 100,
  width: 100,
  x: right - 100,
  y: top,
  toJSON: () => {},
});

const flushRaf = () => {
  const queued = rafQueue;
  rafQueue = [];
  queued.forEach(cb => cb());
};

// Move the row and let the scroll listener react to it
const scrollRowTo = top => {
  rowRect = { ...rowRect, top };
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    flushRaf();
  });
};

const bookNowPill = () => screen.getByTitle("Book on WhatsApp");

beforeAll(() => {
  originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
});

beforeEach(() => {
  isPhone = true;
  rowRect = { top: 500, height: 40, right: 342 };
  rafQueue = [];
  rafId = 0;

  window.matchMedia = jest.fn(query => ({
    matches: isPhone && query === PHONE_QUERY,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(() => false),
  }));

  jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
    rafQueue.push(cb);
    return ++rafId;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
    return this.classList?.contains("footer-book-row")
      ? rect(rowRect)
      : rect({ top: 0, height: 0, right: 0 });
  });

  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return this.classList?.contains("book-float") ? PILL_HEIGHT : 0;
    },
  });

  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: VIEWPORT.width });
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: VIEWPORT.height });
});

afterEach(() => {
  jest.restoreAllMocks();
  if (originalOffsetHeight) Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
});

it("parks the floating Book Now pill beside the footer's Directions row on phones", () => {
  render(<App />);

  const pill = bookNowPill();
  expect(pill).toHaveClass("docked");
  // vertically centred on the row, right edge aligned with it
  expect(pill.style.top).toBe("495px");
  expect(pill.style.right).toBe("48px"); // 390px viewport − row's right edge (342)
});

it("keeps the pill docked once the row scrolls past, clamped inside the viewport", () => {
  render(<App />);
  const pill = bookNowPill();
  expect(pill).toHaveClass("docked");

  // Row has scrolled up past the navbar — the pill must not follow it off screen
  scrollRowTo(-400);

  expect(pill).toHaveClass("docked");
  expect(pill.style.top).toBe("88px");
});

it("never lets the docked pill hang below the viewport bottom edge", () => {
  render(<App />);
  const pill = bookNowPill();

  scrollRowTo(VIEWPORT.height - 10); // row just entering from the bottom

  expect(pill).toHaveClass("docked");
  expect(pill.style.top).toBe(`${VIEWPORT.height - PILL_HEIGHT - 8}px`);
});

it("releases the pill back to the floating corner while the row is still below the fold", () => {
  render(<App />);
  const pill = bookNowPill();
  expect(pill).toHaveClass("docked");

  scrollRowTo(VIEWPORT.height + 200); // row is off screen, below the fold

  expect(pill).not.toHaveClass("docked");
  expect(pill.style.top).toBe("");
  expect(pill.style.right).toBe("");
});

it("leaves desktop alone — the pill stays in its corner however the footer sits", () => {
  isPhone = false;
  render(<App />);

  const pill = bookNowPill();
  expect(pill).not.toHaveClass("docked");
  expect(pill.style.top).toBe("");

  scrollRowTo(300); // an in-view row is still ignored above the phone breakpoint
  expect(pill).not.toHaveClass("docked");
  expect(pill.style.top).toBe("");
});

it("still shows the correct linking affordance while docked", () => {
  render(<App />);

  const pill = bookNowPill();
  expect(pill).toHaveClass("docked");
  expect(pill).toHaveAttribute("href", expect.stringContaining("wa.me"));
});
