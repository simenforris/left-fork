import { icons } from 'feather-icons';
import resetText from '@/assets/reset.css?inline';
import cssText from './fullscreen-image.css?inline';

const resetSheet = new CSSStyleSheet();
resetSheet.replaceSync(resetText);

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(cssText);

const maximizeIcon = icons['maximize-2'].toSvg({ width: '1em', height: '1em' });
const closeIcon = icons['x'].toSvg({ width: '1em', height: '1em' });

export default class FullscreenImage extends HTMLElement {
  static define(tagName = 'fullscreen-image') {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, FullscreenImage);
    }
  }

  #controller: AbortController | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [
      resetSheet,
      styleSheet,
    ];

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <div>
        <div class="trigger-wrapper">
          <slot></slot>
          <button id="open-btn" aria-haspopup="dialog" aria-controls="fs-img-dialog" aria-label="Open fullscreen image">
            <span aria-hidden="true">${maximizeIcon}</span>
          </button>
        </div>

        <dialog id="fs-img-dialog">
          <form method="dialog">
            <slot name="dialog"></slot>
            <button type="submit" aria-label="Close fullscreen image">
              <span aria-hidden="true">${closeIcon}</span>
            </button>
          </form>
        </dialog>
      </div>
    `;
  }

  connectedCallback() {
    const wrapper = this.shadowRoot?.querySelector(
      'div.trigger-wrapper'
    ) as HTMLDivElement | null;
    const openBtn = this.shadowRoot?.getElementById(
      'open-btn'
    ) as HTMLButtonElement | null;
    const dialog = this.shadowRoot?.getElementById(
      'fs-img-dialog'
    ) as HTMLDialogElement | null;

    const clickHandler = () => {
      if (!dialog) return;

      dialog.showModal();

      this.#controller = new AbortController();

      window.addEventListener(
        'click',
        (event) => {
          if (!dialog) {
            this.#controller?.abort();
            return;
          }

          // Use composedPath to traverse shadow boundaries
          const path = event.composedPath();
          if (path[0] === dialog) {
            dialog.close();
            this.#controller?.abort();
          }
        },
        { signal: this.#controller.signal }
      );
    };

    openBtn?.addEventListener('click', clickHandler);
    wrapper?.addEventListener('click', clickHandler);
  }

  diconnectedCallback() {
    this.#controller?.abort();
  }
}

if (!customElements.get('fullscreen-image')) {
  customElements.define('fullscreen-image', FullscreenImage);
}
