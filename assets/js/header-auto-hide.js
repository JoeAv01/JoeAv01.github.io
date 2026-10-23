(() => {
  const header = document.querySelector(".header");
  if (!header) return;

  const root = document.documentElement;
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const revealZone = 20;
  const directionThreshold = 10;
  const leaveDelay = 300;
  let headerHeight = 0;
  let hidden = false;
  let wantsHidden = false;
  let pointerNearHeader = false;
  let lastScrollY = Math.max(0, window.scrollY);
  let directionDistance = 0;
  let leaveTimer;
  let scrollRequested = false;

  const hasKeyboardFocus = () => {
    const active = document.activeElement;
    return header.contains(active) && active.matches(":focus-visible");
  };

  const notifyLayout = () => {
    root.style.setProperty("--visible-header-height", `${hidden ? 0 : headerHeight}px`);
    window.dispatchEvent(new Event("header-visibility-change"));
  };

  const updateVisibility = () => {
    const shouldHide = wantsHidden && !pointerNearHeader && !hasKeyboardFocus();
    if (hidden === shouldHide) return;
    hidden = shouldHide;
    header.classList.toggle("header--hidden", hidden);
    notifyLayout();
  };

  const measureHeader = () => {
    headerHeight = Math.ceil(header.getBoundingClientRect().height);
    root.style.setProperty("--site-header-height", `${headerHeight}px`);
    notifyLayout();
  };

  const updateScroll = () => {
    scrollRequested = false;
    // Clamp overscroll so mobile rubber-banding cannot reverse the direction.
    const maxScrollY = Math.max(0, root.scrollHeight - window.innerHeight);
    const scrollY = Math.max(0, Math.min(window.scrollY, maxScrollY));
    const delta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    if (scrollY <= Math.max(headerHeight + 24, 96)) {
      wantsHidden = false;
      directionDistance = 0;
    } else if (hoverPointer.matches) {
      wantsHidden = true;
    } else if (delta !== 0) {
      directionDistance = Math.sign(delta) === Math.sign(directionDistance)
        ? directionDistance + delta
        : delta;
      if (Math.abs(directionDistance) >= directionThreshold) {
        wantsHidden = directionDistance > 0;
        directionDistance = 0;
      }
    }

    updateVisibility();
  };

  const requestScroll = () => {
    if (scrollRequested) return;
    scrollRequested = true;
    window.requestAnimationFrame(updateScroll);
  };

  const scheduleHide = () => {
    window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(updateVisibility, leaveDelay);
  };

  document.addEventListener("pointermove", (event) => {
    if (!hoverPointer.matches || event.pointerType === "touch") return;
    const near = event.clientY >= 0 && event.clientY <= (hidden ? revealZone : headerHeight);
    if (near === pointerNearHeader) return;
    pointerNearHeader = near;
    window.clearTimeout(leaveTimer);
    if (near) updateVisibility();
    else scheduleHide();
  }, { passive: true });

  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget !== null) return;
    pointerNearHeader = false;
    scheduleHide();
  });

  header.addEventListener("focusin", updateVisibility);
  header.addEventListener("focusout", () => {
    // Wait until the next element receives focus before deciding to hide.
    window.setTimeout(updateVisibility, 0);
  });

  hoverPointer.addEventListener("change", () => {
    pointerNearHeader = false;
    directionDistance = 0;
    requestScroll();
  });
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", () => {
    measureHeader();
    requestScroll();
  });
  window.addEventListener("pageshow", requestScroll);
  if ("ResizeObserver" in window) new ResizeObserver(measureHeader).observe(header);

  measureHeader();
  updateScroll();
})();
