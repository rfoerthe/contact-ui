import React from 'react';
import ReactDOM from 'react-dom/client';
import ContactApp from './ContactApp';

const rootEl = document.getElementById('root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
			<React.StrictMode>
				<ContactApp />
			</React.StrictMode>,
	);
}
