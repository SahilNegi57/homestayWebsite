// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom ships no window.matchMedia, but App's phone-only Book Now docking effect
// reads it to decide whether it should run. Default to "not a phone" so tests
// that don't care about the media query get plain desktop behaviour.
// jsdom implements no media playback, so the tour videos' pause()/play() calls
// (fired on mount and on slide changes) would only log "Not implemented".
HTMLMediaElement.prototype.pause = () => {};
HTMLMediaElement.prototype.play = () => Promise.resolve();

if (!window.matchMedia) {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
