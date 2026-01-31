document.addEventListener("DOMContentLoaded", function() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        // hostame is empty for relative links (e.g. anchors) usually, or matches valid domain
        // We only want to target external links (different hostname)
        // If your site is accessed via localhost vs 127.0.0.1, this might be tricky, but generally window.location.hostname is safe
        if (links[i].hostname && links[i].hostname !== window.location.hostname) {
            links[i].target = "_blank";
            links[i].rel = "noopener noreferrer";
        }
    }
});
