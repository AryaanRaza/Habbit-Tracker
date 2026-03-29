document.addEventListener("DOMContentLoaded", () => {
    // 1. Detect if we are inside the 'settings' folder
    const isInsideSettings = window.location.pathname.includes('/settings/');
    
    // 2. Set the prefix: if in settings, we need '../' to go up one level
    const prefix = isInsideSettings ? '../' : '';

    const footerTemplate = `
    <footer class="bottom-tab-bar">
        <a href="${prefix}dashboard.html" class="tab-item" data-match="dashboard">
            <span class="material-symbols-rounded">home</span>
            <span class="tab-label">Home</span>
        </a>

        <a href="${prefix}stats.html" class="tab-item" data-match="stats">
            <span class="material-symbols-rounded">leaderboard</span>
            <span class="tab-label">Stats</span>
        </a>

        <a href="${prefix}settings.html" class="tab-item" data-match="settings">
            <span class="material-symbols-rounded">settings</span>
            <span class="tab-label">Settings</span>
        </a>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerTemplate);
    
    // The rest of your active tab logic
    const currentPath = window.location.pathname.toLowerCase();
    const tabs = document.querySelectorAll('.tab-item');
    
    tabs.forEach(tab => {
        const matchToken = tab.getAttribute('data-match');
        
        if (matchToken === 'dashboard' && (currentPath === '/' || currentPath.includes('dashboard.html') || currentPath.endsWith('habbit-tracker/'))) {
            tab.classList.add('active');
        } 
        else if (matchToken === 'stats' && currentPath.includes('stats.html')) {
            tab.classList.add('active');
        }
        else if (matchToken === 'settings' && (currentPath.includes('/settings/') || currentPath.includes('settings.html'))) {
            tab.classList.add('active');
        }
    });
});