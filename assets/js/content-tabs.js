(() => {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

    if (!tabButtons.length || !panels.length) return;

    const activateTab = (selectedTab, moveFocus = false) => {
      tabButtons.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;

        const panel = panels.find((item) => item.id === tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !isSelected;
      });

      if (moveFocus) selectedTab.focus();
    };

    tabButtons.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));

      tab.addEventListener("keydown", (event) => {
        let nextIndex;

        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabButtons.length - 1;
        if (nextIndex === undefined) return;

        event.preventDefault();
        activateTab(tabButtons[nextIndex], true);
      });
    });
  });
})();
