import { render, fireEvent } from "@testing-library/react";
import App from "./App";

// jsdom ships no PointerEvent, so testing-library would fall back to a bare
// Event and drop clientX. A MouseEvent is a faithful stand-in for our handlers
// (they only read clientX / button / target).
beforeAll(() => {
  window.PointerEvent = window.MouseEvent;
  // jsdom has no layout engine either, so give every element a phone/laptop-like
  // width — the drag maths compares the gesture distance against the slider width.
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() { return 1000; },
  });
});

const setup = () => {
  render(<App />);
  const slider = document.querySelector(".slider");
  const activeDot = () =>
    Array.from(document.querySelectorAll(".slider-dot"))
      .findIndex(dot => dot.classList.contains("active"));
  return { slider, activeDot };
};

const drag = (slider, from, to) => {
  fireEvent.pointerDown(slider, { clientX: from, pointerId: 1 });
  fireEvent.pointerMove(slider, { clientX: to, pointerId: 1 });
  fireEvent.pointerUp(slider, { clientX: to, pointerId: 1 });
};

test("dragging the gallery by hand moves to the next slide", () => {
  const { slider, activeDot } = setup();
  expect(activeDot()).toBe(0);

  // Hand/cursor dragged left past a third of the slider width → next slide
  drag(slider, 700, 400);

  expect(activeDot()).toBe(1);
  expect(slider).not.toHaveClass("is-dragging");
});

test("dragging right goes back a slide, and a tiny wobble springs back", () => {
  const { slider, activeDot } = setup();

  drag(slider, 400, 700);            // drag right → wraps to the last slide
  expect(activeDot()).toBe(8);

  drag(slider, 400, 396);            // only 4px — below the threshold, no slide change
  expect(activeDot()).toBe(8);
});

test("a drag that starts on an arrow button keeps the arrow's own click", () => {
  const { slider, activeDot } = setup();
  const nextArrow = document.querySelector(".slider-next");

  fireEvent.pointerDown(nextArrow, { clientX: 900, pointerId: 1 });
  fireEvent.pointerMove(slider, { clientX: 400, pointerId: 1 });
  fireEvent.pointerUp(slider, { clientX: 400, pointerId: 1 });

  expect(activeDot()).toBe(0);       // the button press never started a drag
  expect(slider).not.toHaveClass("is-dragging");
});
