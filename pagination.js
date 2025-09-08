// Simple paginator that owns pagination UI and counts
// Usage:
// const paginator = new Paginator({
//   perPage: 20,
//   selectors: { prev: '#prev', next: '#next', numbers: '#numbers', pageStart: '#start', pageEnd: '#end', totalResults: '#total' },
//   onPageChange: (page) => { ... fetch+render ...; paginator.apply(page, totalCount, totalPages); }
// });

class Paginator {
  constructor({ perPage = 20, selectors = {}, onPageChange }) {
    this.currentPage = 1;
    this.perPage = perPage;
    this.totalPages = 1;
    this.totalCount = 0;
    this.onPageChange = typeof onPageChange === 'function' ? onPageChange : () => {};

    this._els = {
      prev: document.querySelector(selectors.prev),
      next: document.querySelector(selectors.next),
      numbers: document.querySelector(selectors.numbers),
      pageStart: document.querySelector(selectors.pageStart),
      pageEnd: document.querySelector(selectors.pageEnd),
      totalResults: document.querySelector(selectors.totalResults),
    };

    this._bind();
  }

  _bind() {
    if (this._els.prev) {
      this._els.prev.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.currentPage > 1) this.onPageChange(this.currentPage - 1);
      });
    }
    if (this._els.next) {
      this._els.next.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.currentPage < this.totalPages) this.onPageChange(this.currentPage + 1);
      });
    }
  }

  apply(page, totalCount, totalPages) {
    this.currentPage = page;
    this.totalCount = totalCount ?? 0;
    this.totalPages = totalPages ?? 1;
    this._renderCounts();
    this._renderNumbers();
  }

  _renderCounts() {
    const start = this.totalCount === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    if (this._els.pageStart) this._els.pageStart.textContent = String(start);
    if (this._els.pageEnd) this._els.pageEnd.textContent = String(end);
    if (this._els.totalResults) this._els.totalResults.textContent = String(this.totalCount);
  }

  _computePageWindow() {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages = [];
    const add = (p) => { if (!pages.includes(p)) pages.push(p); };
    if (total <= 7) {
      for (let i = 1; i <= total; i++) add(i);
      return pages;
    }
    add(1); add(2);
    add(current - 1); add(current); add(current + 1);
    add(total - 1); add(total);
    const nums = pages.filter((p) => typeof p === 'number' && p >= 1 && p <= total).sort((a, b) => a - b);
    const windowed = [];
    for (let i = 0; i < nums.length; i++) {
      const prev = nums[i - 1];
      const cur = nums[i];
      if (prev && cur - prev > 1) windowed.push('...');
      windowed.push(cur);
    }
    return windowed;
  }

  _makePageButton(page, isCurrent = false, hiddenOnMobile = false) {
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
    a.className = [
      'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
      hiddenOnMobile ? 'hidden md:inline-flex' : '',
      isCurrent
        ? 'z-10 bg-indigo-500 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
        : 'text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0',
    ].join(' ').trim();
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const p = Number(a.getAttribute('data-page'));
      if (!Number.isNaN(p) && p !== this.currentPage) this.onPageChange(p);
    });
    return a;
  }

  _renderNumbers() {
    const numbersEl = this._els.numbers;
    if (!numbersEl) return;
    numbersEl.innerHTML = '';
    const pagesToShow = this._computePageWindow();
    pagesToShow.forEach((p) => {
      const isCurrent = p === this.currentPage;
      const hiddenOnMobile = typeof p === 'number' && p !== 1 && p !== this.totalPages && p !== this.currentPage;
      numbersEl.appendChild(this._makePageButton(p, isCurrent, hiddenOnMobile));
    });

    // Prev/Next enable/disable
    if (this._els.prev) {
      this._els.prev.classList.toggle('opacity-50', this.currentPage === 1);
      this._els.prev.classList.toggle('pointer-events-none', this.currentPage === 1);
    }
    if (this._els.next) {
      this._els.next.classList.toggle('opacity-50', this.currentPage === this.totalPages);
      this._els.next.classList.toggle('pointer-events-none', this.currentPage === this.totalPages);
    }
  }
}

// Expose globally
window.Paginator = Paginator;

