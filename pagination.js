// Simple paginator that owns pagination UI and counts
// Usage:
// const paginator = new Paginator({
//   perPage: 20,
//   selectors: { prev: '#prev', next: '#next', numbers: '#numbers', pageStart: '#start', pageEnd: '#end', totalResults: '#total' },
//   onPageChange: (page) => { ... fetch+render ...; paginator.apply(page, totalCount, totalPages); }
// });

class Paginator {
  constructor({ perPage = 20, selectors = {}, onPageChange }) {
    this.currentPage = 1;     // start on page 1 by default (to be set later)
    this.perPage = perPage;   // store items‑per‑page setting
    this.totalPages = 1;      // default total pages to 1 (to be set later)
    this.totalCount = 0;      // default total count to 0 (to be set later)
    this.onPageChange = typeof onPageChange === 'function' ? onPageChange : () => {};   //ensure onPageChange is a function, otherwise use a no‑op

    // an object holding DOM element references
    this._els = {
      prev: document.querySelector(selectors.prev),
      next: document.querySelector(selectors.next),
      numbers: document.querySelector(selectors.numbers),
      pageStart: document.querySelector(selectors.pageStart),
      pageEnd: document.querySelector(selectors.pageEnd),
      totalResults: document.querySelector(selectors.totalResults),
    };

    // set up event listeners for prev/next buttons
    this._bind();
  }

  // Event listeners for prev/next buttons
  _bind() {
    if (this._els.prev) {
      this._els.prev.addEventListener('click', (e) => {
        if (this.currentPage > 1) this.onPageChange(this.currentPage - 1);
      });
    }
    if (this._els.next) {
      this._els.next.addEventListener('click', (e) => {
        if (this.currentPage < this.totalPages) this.onPageChange(this.currentPage + 1);
      });
    }
  }

  // Update paginator state & redraw UI after your data fetch completes.
  // Call this with the page you loaded, the total item count, and total pages.
  apply(page, totalCount, totalPages) {
    this.currentPage = page;
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this._renderCounts();     // Updates the counts display (e.g. "1-20 of 137")
    this._renderNumbers();    // updates page buttons
  }

  // Updates the counts display (e.g. "1-20 of 137")
  _renderCounts() {
    const start = this.totalCount === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    if (this._els.pageStart) this._els.pageStart.textContent = String(start);
    if (this._els.pageEnd) this._els.pageEnd.textContent = String(end);
    if (this._els.totalResults) this._els.totalResults.textContent = String(this.totalCount);
  }

  //Figures out which page numbers (and “...”) to display.
  _computePageWindow() {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages = [];

    // This add() function says : Add this page number to the list, but only if it’s not already there.
    const add = (p) => { if (!pages.includes(p)) pages.push(p); };

    // If there are 7 pages or fewer in total, just show all the page numbers, no need for dots (…) or skipping.
    if (total <= 7) {
      for (let i = 1; i <= total; i++) add(i);
      return pages;
    }

    // Otherwise, show first 2 pages, last 2 pages, current page, and one page before and after current page.
    add(1); add(2);
    add(current - 1); add(current); add(current + 1);
    add(total - 1); add(total);

    // Now filter out any pages that are out of range (less than 1 or greater than total),
    const nums = pages
    .filter((p) => p >= 1 && p <= total)
    
    // Then, loop through the list of pages and insert “...” wherever there’s a gap of 2 or more pages.
    // For example, if the list is [1, 2, 5, 6, 7, 20], it becomes [1, 2, '...', 5, 6, 7, '...', 20].
    const windowed = [];
    for (let i = 0; i < nums.length; i++) {
      const prev = nums[i - 1];
      const cur = nums[i];
      if (prev && cur - prev > 1) windowed.push('...');
      windowed.push(cur);
    }
    return windowed; // e.g → [1, 2, '...', 5, 6, 7, '...', 41, 42] // The rendering function will handle displaying the dots as non-clickable spans.
  }

  // Creates the buttons in the pagination area and adds event listeners to them.
  _makePageButton(page, isCurrent, hiddenOnMobile) {
    if (page === '...') {
      const span = document.createElement('span');
      span.className = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-700 focus:outline-offset-0';
      span.textContent = '...';
      return span;
    }
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = String(page);
    a.setAttribute('data-page', String(page));

    // CSS: current page gets the “active” styling; others get the default styles.
    // Also hide “middle” numbers on mobile if hiddenOnMobile = true
    a.className = [
      'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
      hiddenOnMobile ? 'hidden md:inline-flex' : '',
      isCurrent
        ? 'z-10 bg-indigo-500 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
        : 'text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0',
    ].join(' ').trim();

    // Makes the number in the pagination area a clickable button
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const p = Number(a.getAttribute('data-page'));
      if (p !== this.currentPage) this.onPageChange(p);
    });
    return a;
  }

  // Updates page buttons
  // Render the full pagination control bar:
  //  *  - Clears existing numbers,
  //  *  - Builds the window of pages (with "..."),
  //  *  - Appends each button/span,
  //  *  - Updates Prev/Next disabled states based on current page.
  _renderNumbers() {
    const numbersEl = this._els.numbers;       // e.g., document.querySelector('#numbers')
    if (!numbersEl) return;

    numbersEl.innerHTML = '';                  // clear existing buttons so we can draw fresh buttons for page #n.
    
    const pagesToShow = this._computePageWindow();   //Asks _computePageWindow() which page numbers (and “...”) to display.
    
    pagesToShow.forEach((p) => {
      const isCurrent = p === this.currentPage;
      const hiddenOnMobile = typeof p === 'number' && p !== 1 && p !== this.totalPages && p !== this.currentPage;
      numbersEl.appendChild(this._makePageButton(p, isCurrent, hiddenOnMobile));
    });

    // Prev/Next enable/disable
    if (this._els.prev) {
      const disabled = this.currentPage === 1;  // Makes a Boolean variable (true or false).
      this._els.prev.classList.toggle('opacity-50', disabled);
      this._els.prev.classList.toggle('pointer-events-none', disabled);
    }
    if (this._els.next) {
      const disabled = this.currentPage === this.totalPages; // Makes a Boolean variable (true or false).
      this._els.next.classList.toggle('opacity-50', disabled);
      this._els.next.classList.toggle('pointer-events-none', disabled);
    }
  }
}

// Expose globally
// window is the global object in the browser.
// 👉 “Hey browser, make this class available everywhere in my scripts under the name Paginator.”
window.Paginator = Paginator;

