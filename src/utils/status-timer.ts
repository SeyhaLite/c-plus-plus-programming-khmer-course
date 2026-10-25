// ============================================================
// Status timer — បង្ហាញពេលវេលាកំពុងរង់ចាំ + spinner
// ប្រើសម្រាប់ប៊ូតុង Run / ពិនិត្យ test cases (សេវាខាងក្រៅអាចយឺត ៥–១០s)
// ============================================================

export interface StatusTimer {
  stop(): void;
}

export function startStatusTimer(host: HTMLElement, baseTextKm: string): StatusTimer {
  const started = performance.now();
  const spinner = document.createElement('span');
  spinner.className = 'spinner';
  spinner.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  host.replaceChildren(spinner, label);
  const tick = (): void => {
    label.textContent = ` ${baseTextKm} ${((performance.now() - started) / 1000).toFixed(1)}s`;
  };
  tick();
  const id = setInterval(tick, 100);
  return {
    stop() {
      clearInterval(id);
    },
  };
}
