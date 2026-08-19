import { renderToString } from 'react-dom/server';
import React from 'react';
import ReactQuill from 'react-quill';
try {
  console.log(typeof ReactQuill);
  // renderToString(React.createElement(ReactQuill, { value: '', onChange: () => {} }));
} catch (e) {
  console.error(e);
}
