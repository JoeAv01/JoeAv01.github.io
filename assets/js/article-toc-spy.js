(() => {
  const desktopNavigation = document.getElementById("article-toc-navigation");
  const mobileNavigation = document.getElementById("article-mobile-toc-navigation");

  if (!desktopNavigation) return;

  const links = [desktopNavigation, mobileNavigation]
    .filter(Boolean)
    .flatMap((navigation) => [...navigation.querySelectorAll('a[href^="#"]')]);

  const headingIds = [...new Set(
    [...desktopNavigation.querySelectorAll('a[href^="#"]')]
      .map((link) => decodeURIComponent(link.getAttribute("href").slice(1)))
  )];
  const headings = headingIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!links.length || !headings.length) return;

  const activationOffset = () => {
    const header = document.querySelector(".header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    return headerHeight + 96;
  };

  const setActiveHeading = (heading) => {
    links.forEach((link) => {
      const targetId = decodeURIComponent(link.getAttribute("href").slice(1));
      const isActive = targetId === heading.id;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveHeading = () => {
    const offset = activationOffset();
    let activeHeading = headings[0];

    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= offset) {
        activeHeading = heading;
      }
    });

    const pageBottom = window.scrollY + window.innerHeight;
    const documentBottom = document.documentElement.scrollHeight;
    if (pageBottom >= documentBottom - 2) {
      activeHeading = headings.at(-1);
    }

    setActiveHeading(activeHeading);
  };

  let updateRequested = false;
  const requestUpdate = () => {
    if (updateRequested) return;
    updateRequested = true;

    window.requestAnimationFrame(() => {
      updateActiveHeading();
      updateRequested = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("hashchange", requestUpdate);
  updateActiveHeading();
})();
