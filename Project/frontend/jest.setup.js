const { TextEncoder, TextDecoder } = require('util');

// Polyfill TextEncoder and TextDecoder globally for JSDOM compatibility
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';
