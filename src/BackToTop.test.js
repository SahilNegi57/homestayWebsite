// Covers the two "back to top" circles (App.js): the one sitting in the
// footer's bottom row, and the floating one that rides the page while you
// scroll and steps aside once the footer's own circle is on screen.
//
// jsdom has no layout, so the scroll position and the footer circle's rect are
// stubbed, and requestAnimationFrame is a manual queue so the rAF-throttled
// scroll listener runs exactly when we ask it to.
import { act, render, screen, within, fireEvent } from "@testing-library/react";
import App from "./App";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const VIEWPORT = { width: 1280, height: 800 };

let reduceMotion = false;
let scrollY = 0;
// The footer circle's rect, in viewport coordinates — off screen by default
let circleRect = { top: 5000, height: 40 };
let rafQueue = [];
let rafId = 0;

const scrollTo = jest.fn();

const rect = ({ top, height }) => ({
  top,
  height,
  bottom: top + height,
  left: 0,
  right: 40,
  width: 40,
  x: 0,
  y: top,
  toJSON: () => {},
});

const flushRaf = () => {
  const queued = rafQueue;
  rafQueue = [];
  queued.forEach(cb => cb());
};

// Move the page and let the scroll listener react to it
const scrollPageTo = (y, footerCircleTop = circleRect.top) => {
  scrollY = y;
  circleRect = { ...circleRect, top: footerCircleTop };
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    flushRaf();
  });
};

// The glide to the top is driven frame by frame (App.js → glideTo), so time is
// mocked and the manual rAF queue is flushed until it lands.
const runGlide = (click) => {
  let t = 1000;
  const now = jest.spyOn(performance, "now").mockImplementation(() => t);
  click();
  for (let i = 0; i < 40; i++) {
    t += 120;
    flushRaf();
  }
  now.mockRestore();
};

// Every y the window was scrolled to, in order
const scrollTops = () => scrollTo.mock.calls.map(([, y]) => y);

// App reads matchMedia for reduced motion and for the phone-only Book Now
// docking, so the stub needs the full listener surface, not just `matches`.
const stubMatchMedia = () => {
  window.matchMedia = jest.fn(query => ({
    matches: reduceMotion && query === REDUCE_QUERY,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(() => false),
  }));
};

const footerCircle = () =>
  within(screen.getByRole("contentinfo")).getByRole("button", { name: /back to top/i });
const floatingCircle = () => document.querySelector(".to-top-float");

beforeEach(() => {
  reduceMotion = false;
  scrollY = 0;
  circleRect = { top: 5000, height: 40 };
  rafQueue = [];
  rafId = 0;

  scrollTo.mockClear();
  window.scrollTo = scrollTo;
  stubMatchMedia();

  jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
    rafQueue.push(cb);
    return ++rafId;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
    const isFooterCircle = this.classList?.contains("to-top") && !this.classList?.contains("to-top-float");
    return isFooterCircle ? rect(circleRect) : rect({ top: 0, height: 0 });
  });

  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: VIEWPORT.width });
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: VIEWPORT.height });
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders a Back to top circle inside the footer", () => {
  render(<App />);
  expect(footerCircle()).toHaveClass("to-top");
});

it("glides the window back to the top when the footer circle is clicked", () => {
  render(<App />);
  scrollPageTo(1000);
  runGlide(() => fireEvent.click(footerCircle()));

  const tops = scrollTops();
  expect(tops.length).toBeGreaterThan(3);                       // a glide, not one jump
  expect(tops.every((y, i) => i === 0 || y <= tops[i - 1])).toBe(true);  // always upward
  expect(tops[tops.length - 1]).toBe(0);                        // and it lands
});

it("jumps instantly rather than animating when reduced motion is preferred", () => {
  reduceMotion = true;
  render(<App />);
  fireEvent.click(footerCircle());
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
});

it("keeps the floating circle hidden at the top of the page", () => {
  render(<App />);
  expect(floatingCircle()).not.toHaveClass("show");
});

it("shows the floating circle once the hero is behind you", () => {
  render(<App />);
  scrollPageTo(1000);
  expect(floatingCircle()).toHaveClass("show");
});

it("hides the floating circle again back at the top of the page", () => {
  render(<App />);
  scrollPageTo(1000);
  scrollPageTo(0, 5000);
  expect(floatingCircle()).not.toHaveClass("show");
});

it("hides the floating circle while the footer's own circle is on screen", () => {
  render(<App />);
  scrollPageTo(1000);
  expect(floatingCircle()).toHaveClass("show");

  // Footer circle has scrolled into view — the two must never coexist
  scrollPageTo(4000, 600);
  expect(floatingCircle()).not.toHaveClass("show");
});

it("returns to the top from the floating circle too", () => {
  render(<App />);
  scrollPageTo(1000);
  runGlide(() => fireEvent.click(floatingCircle()));

  expect(scrollTops()[scrollTops().length - 1]).toBe(0);
});
