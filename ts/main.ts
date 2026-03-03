/**
 * 通用表单样式 - 主脚本
 * 提供主题切换、导航同步等功能
 */

// 主题类型
type Theme = 'light' | 'dark';

/**
 * 获取当前主题
 * @returns 当前主题名称
 */
function getCurrentTheme(): Theme {
  const html = document.documentElement;
  return html.classList.contains('theme-dark') ? 'dark' : 'light';
}

/**
 * 设置主题
 * @param theme - 要设置的主题
 */
function setTheme(theme: Theme): void {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  if (theme === 'dark') {
    html.classList.remove('theme-light');
    html.classList.add('theme-dark');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = '浅色模式';
  } else {
    html.classList.remove('theme-dark');
    html.classList.add('theme-light');
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeText) themeText.textContent = '深色模式';
  }

  // 同步 iframe 内的主题
  syncThemeToIframe(theme);

  // 保存主题偏好
  localStorage.setItem('form-theme', theme);
}

/**
 * 切换主题
 */
function toggleTheme(): void {
  const currentTheme = getCurrentTheme();
  const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * 同步主题到 iframe
 * @param theme - 主题名称
 */
function syncThemeToIframe(theme: Theme): void {
  const iframe = document.querySelector('.content-iframe') as HTMLIFrameElement;
  if (iframe && iframe.contentDocument) {
    const iframeHtml = iframe.contentDocument.documentElement;
    if (theme === 'dark') {
      iframeHtml.classList.remove('theme-light');
      iframeHtml.classList.add('theme-dark');
    } else {
      iframeHtml.classList.remove('theme-dark');
      iframeHtml.classList.add('theme-light');
    }
  }
}

/**
 * 导航同步
 * 根据当前 iframe 页面高亮对应的导航项
 */
function initNavigation(): void {
  const navItems = document.querySelectorAll('.nav-item');
  const iframe = document.querySelector('.content-iframe') as HTMLIFrameElement;

  // 点击导航项时更新 active 状态
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // iframe 加载时同步主题
  if (iframe) {
    iframe.addEventListener('load', () => {
      const currentTheme = getCurrentTheme();
      syncThemeToIframe(currentTheme);
    });
  }
}

/**
 * 初始化主题
 * 从 localStorage 读取保存的主题，或使用系统偏好
 */
function initTheme(): void {
  // 尝试读取保存的主题
  const savedTheme = localStorage.getItem('form-theme') as Theme | null;

  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  // 检测系统深色模式偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme: Theme = prefersDark ? 'dark' : 'light';
  setTheme(defaultTheme);
}

/**
 * 监听系统主题变化
 */
function watchSystemTheme(): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  mediaQuery.addEventListener('change', (e) => {
    // 只有在用户没有手动设置主题时才自动切换
    const savedTheme = localStorage.getItem('form-theme');
    if (!savedTheme) {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    }
  });
}

/**
 * 初始化
 */
function init(): void {
  initTheme();
  initNavigation();
  watchSystemTheme();

  // 将 toggleTheme 暴露到全局，供 HTML 调用
  (window as any).toggleTheme = toggleTheme;
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 导出供模块使用
export { toggleTheme, setTheme, getCurrentTheme };
