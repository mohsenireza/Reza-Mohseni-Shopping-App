const domHelper = {
  // Trap focus (like in modals) and also take back focus to the last focused element in page after deleting the focus trapper (when modal closed)
  trapFocus: ({
    elementToTrapFocusIn,
    startFocusingFrom,
    elementToRevertFocusTo = document.activeElement,
  }) => {
    if (!elementToTrapFocusIn) return;
    const focusableElements = Array.from(
      elementToTrapFocusIn.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
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
      shouldRevertFocusedElement && elementToRevertFocusTo.focus();
    };

    return removeTrapFocus;
  },
};

export { domHelper };
