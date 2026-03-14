
document.addEventListener("DOMContentLoaded", () => {
    const footerTemplate = `
    <footer class="bottom-tab-bar">
        <a href="/index.html" class="tab-item">
            <span class="material-symbols-rounded">home</span>
            <span class="tab-label">Home</span>
        </a>

        <a href="/dashboard.html" class="tab-item">
            <span class="material-symbols-rounded">leaderboard</span>
            <span class="tab-label">Stats</span>
        </a>

        <a href="/settings.html" class="tab-item">
            <span class="material-symbols-rounded">settings</span>
            <span class="tab-label">Settings</span>
        </a>
    </footer>
    `;

    // Injects the footer at the very end of the body
    document.body.insertAdjacentHTML('beforeend', footerTemplate);
    
    // Auto-highlight the active tab based on current URL
    const currentPath = window.location.pathname;
    const tabs = document.querySelectorAll('.tab-item');
    
    tabs.forEach(tab => {
        if (currentPath.includes(tab.getAttribute('href'))) {
            tab.classList.add('active');
        }
    });
});