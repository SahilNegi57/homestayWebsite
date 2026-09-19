// The Experience carousel (App.js) no longer paints a "Swipe to explore" chip,
// but the gesture behind it stays: a horizontal flick still moves between
// clips, while taps and vertical scrolls are left to the page and the native
// player. jsdom has no layout engine, so the swipe threshold is fed directly
// through the touch coordinates.
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";

const setup = () => {
  render(<App />);
  return {
    slider: document.querySelector(".video-slider"),
    count: () => document.querySelector(".video-count").textContent,
  };
};

const swipe = (slider, fromX, toX, fromY = 300, toY = 300) => {
  fireEvent.touchStart(slider, { touches: [{ clientX: fromX, clientY: fromY }] });
  fireEvent.touchEnd(slider, { changedTouches: [{ clientX: toX, clientY: toY }] });
};

it("shows no swipe hint over the video carousel", () => {
  const { slider } = setup();

  expect(slider.querySelector(".slider-hint")).toBeNull();
  expect(screen.queryByText(/swipe to explore/i)).toBeNull();
});

it("swiping left turns to the next clip and swiping right turns back", () => {
  const { slider, count } = setup();
  expect(count()).toBe("1 / 4");

  swipe(slider, 300, 180);
  expect(count()).toBe("2 / 4");

  swipe(slider, 180, 300);
  expect(count()).toBe("1 / 4");
});

it("ignores small wobbles and mostly vertical gestures", () => {
  const { slider, count } = setup();

  swipe(slider, 300, 290);                    // 10px — a tap, not a swipe
  expect(count()).toBe("1 / 4");

  swipe(slider, 300, 180, 300, 120);          // 120px left but 180px up → scrolling
  expect(count()).toBe("1 / 4");
});

it("loops past the last clip back to the first", () => {
  const { slider, count } = setup();

  for (let i = 0; i < 4; i++) swipe(slider, 300, 150);

  expect(count()).toBe("1 / 4");
});

it("keeps the arrows working alongside the swipe", () => {
  const { count } = setup();

  fireEvent.click(document.querySelector(".video-slider .slider-next"));
  expect(count()).toBe("2 / 4");

  fireEvent.click(document.querySelector(".video-slider .slider-prev"));
  expect(count()).toBe("1 / 4");
});
