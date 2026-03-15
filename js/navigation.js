document.addEventListener("DOMContentLoaded", () => {
    const footerTemplate = `
    <footer class="bottom-tab-bar">
        <a href="/dashboard.html" class="tab-item" data-match="dashboard">
            <span class="material-symbols-rounded">home</span>
            <span class="tab-label">Home</span>
        </a>

        <a href="/stats.html" class="tab-item" data-match="stats">
            <span class="material-symbols-rounded">leaderboard</span>
            <span class="tab-label">Stats</span>
        </a>

        <a href="/settings.html" class="tab-item" data-match="settings">
            <span class="material-symbols-rounded">settings</span>
            <span class="tab-label">Settings</span>
        </a>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerTemplate);
    
    const currentPath = window.location.pathname.toLowerCase();
    const tabs = document.querySelectorAll('.tab-item');
    
    tabs.forEach(tab => {
        const matchToken = tab.getAttribute('data-match');
        
        // 1. Handle the Homepage (root or index.html)
        if (matchToken === 'dashboard' && (currentPath === '/' || currentPath.includes('dashboard.html'))) {
            tab.classList.add('active');
        } 
        // 2. Handle Stats/Dashboard
        else if (matchToken === 'stats' && currentPath.includes('stats.html')) {
            tab.classList.add('active');
        }
        // 3. Handle ALL settings pages (matches folder name OR file name)
        else if (matchToken === 'settings' && (currentPath.includes('/settings/') || currentPath.includes('settings.html'))) {
            tab.classList.add('active');
        }
    });
});