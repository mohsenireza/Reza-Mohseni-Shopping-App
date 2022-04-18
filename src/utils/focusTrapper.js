class FocusTrapper {
  constructor(elementToTrapFocusIn) {
    this.elementToTrapFocusIn = elementToTrapFocusIn;
    this.elementToRevertFocusTo = null;
    this.untrapFocus = null;

    // Bind methods
    this.trapFocus = this.trapFocus.bind(this);
    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
    this.reset = this.reset.bind(this);
  }

  trapFocus({ startFocusingFrom }) {
    if (!this.elementToTrapFocusIn) return;
    const focusableElements = Array.from(
      this.elementToTrapFocusIn.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex^="-"]):not([disabled])'
      )
    );
    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];
    let currentFocus = null;

    currentFocus = startFocusingFrom || firstFocusableEl;
    currentFocus.focus();

    const handleFocus = (e) => {
      e.preventDefault();
      // If the focused element "lives" in your modal container then just focus it
      if (focusableElements.includes(e.target)) {
        currentFocus = e.target;
      } else {
        // You're out of the container
        // If the previously focused element was the first element then focus the last
        // element - means you were using the shift key
        if (currentFocus === firstFocusableEl) {
          lastFocusableEl.focus();
        } else {
          // You previously focused on the last element so just focus the first one
          firstFocusableEl.focus();
        }
        // update the current focus var
        currentFocus = document.activeElement;
      }
    };

    document.addEventListener('focus', handleFocus, true);

    const removeTrapFocus = ({ shouldRevertFocusedElement }) => {
      document.removeEventListener('focus', handleFocus, true);
      shouldRevertFocusedElement && this.elementToRevertFocusTo.focus();
    };

    return removeTrapFocus;
  }

  add({ isResetting = false } = {}) {
    // Calculate elementToRevertFocusTo just once
    if (!isResetting) {
      this.elementToRevertFocusTo = document.activeElement;
    }
    this.untrapFocus = this.trapFocus({
      startFocusingFrom: isResetting ? document.activeElement : null,
    });
  }

  delete({ isResetting = false } = {}) {
    if (!this.untrapFocus) return;
    this.untrapFocus({ shouldRevertFocusedElement: !isResetting });
    this.untrapFocus = null;
    if (!isResetting) this.elementToRevertFocusTo = null;
  }

  reset() {
    this.delete({ isResetting: true });
    this.add({ isResetting: true });
  }
}

export { FocusTrapper };
