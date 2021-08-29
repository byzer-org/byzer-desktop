import { h, render } from 'preact';
import { ActivationFunction } from 'vscode-notebook-renderer';
import './style.css';

export const activate: ActivationFunction = (_context) => ({
	renderOutputItem(_, element) {
		render(<p>Error!</p>, element);
	}
});