// Autoplay Spotify embed on first user interaction
(function () {
    const iframe = document.getElementById('spotify-iframe');
    if (!iframe) return;

    const baseSrc = iframe.src;
    let hasTriggered = false;

    function triggerAutoplay() {
        if (hasTriggered) return;
        hasTriggered = true;

        const separator = baseSrc.includes('?') ? '&' : '?';
        iframe.src = baseSrc + separator + 'autoplay=1';

        document.removeEventListener('click', triggerAutoplay);
        document.removeEventListener('keydown', triggerAutoplay);
        document.removeEventListener('touchstart', triggerAutoplay);
    }

    document.addEventListener('click', triggerAutoplay);
    document.addEventListener('keydown', triggerAutoplay);
    document.addEventListener('touchstart', triggerAutoplay);
})();