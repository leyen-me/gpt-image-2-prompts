// ============================================
// 主脚本 - 主题切换、导航交互、工具函数
// ============================================

// ============================================
// 主题管理
// ============================================

class ThemeManager {
  constructor() {
    this.theme = this.getInitialTheme();
    this.applyTheme(this.theme);
    this.setupEventListeners();
  }

  getInitialTheme() {
    // 优先级：localStorage > 系统偏好 > 默认浅色
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.updateThemeIcon();
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = this.theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', 
        this.theme === 'light' ? '切换到暗色模式' : '切换到浅色模式'
      );
    }
  }

  setupEventListeners() {
    // 监听主题切换按钮
    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) {
        this.toggleTheme();
      }
    });

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// ============================================
// 工具函数
// ============================================

const Utils = {
  /**
   * 格式化日期为相对时间
   * @param {string} dateString - ISO 8601 格式的日期字符串
   * @returns {string} 相对时间描述
   */
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    if (diffMonths < 12) return `${diffMonths}个月前`;
    return `${diffYears}年前`;
  },

  /**
   * 防抖函数
   * @param {Function} func - 需要防抖的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 防抖后的函数
   */
  debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 需要节流的函数
   * @param {number} limit - 时间限制（毫秒）
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} 是否复制成功
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 备用方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          return successful;
        } catch (err) {
          document.body.removeChild(textArea);
          return false;
        }
      }
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    }
  },

  /**
   * 显示提示消息
   * @param {string} message - 提示消息
   * @param {string} type - 消息类型 (success, error, info)
   * @param {number} duration - 显示时长（毫秒）
   */
  showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 24px;
      background: var(--color-text);
      color: var(--color-bg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      animation: slideInUp 0.3s var(--ease-smooth);
      font-weight: 500;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s var(--ease-smooth)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * 滚动到元素
   * @param {string|HTMLElement} target - 目标元素或选择器
   * @param {number} offset - 偏移量
   */
  scrollToElement(target, offset = 80) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  },

  /**
   * 解析 URL 参数
   * @returns {Object} URL 参数对象
   */
  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  /**
   * 更新 URL 参数（不刷新页面）
   * @param {Object} params - 参数对象
   */
  updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, params[key]);
      }
    });
    window.history.replaceState({}, '', url.toString());
  }
};

// ============================================
// 滚动动画观察器
// ============================================

class ScrollAnimationObserver {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      this.observeElements();
    }
  }

  observeElements() {
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(el => {
      if (this.observer) {
        this.observer.observe(el);
      }
    });
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ============================================
// 键盘快捷键管理
// ============================================

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.setupEventListener();
  }

  /**
   * 注册快捷键
   * @param {string} key - 键名
   * @param {Function} handler - 处理函数
   * @param {Object} modifiers - 修饰键 {ctrl, alt, shift, meta}
   */
  register(key, handler, modifiers = {}) {
    const shortcutKey = this.getShortcutKey(key, modifiers);
    this.shortcuts.set(shortcutKey, handler);
  }

  getShortcutKey(key, modifiers) {
    const parts = [];
    if (modifiers.ctrl) parts.push('ctrl');
    if (modifiers.alt) parts.push('alt');
    if (modifiers.shift) parts.push('shift');
    if (modifiers.meta) parts.push('meta');
    parts.push(key.toLowerCase());
    return parts.join('+');
  }

  setupEventListener() {
    document.addEventListener('keydown', (e) => {
      const modifiers = {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey
      };

      const shortcutKey = this.getShortcutKey(e.key, modifiers);
      const handler = this.shortcuts.get(shortcutKey);

      if (handler) {
        e.preventDefault();
        handler(e);
      }
    });
  }
}

// ============================================
// 导航高亮
// ============================================

function updateActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath || 
        (currentPath.includes('prompts') && linkPath.includes('prompts'))) {
      link.classList.add('active');
    }
  });
}

// ============================================
// Toast 动画样式
// ============================================

const toastStyles = document.createElement('style');
toastStyles.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;
document.head.appendChild(toastStyles);

// ============================================
// 初始化
// ============================================

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化主题管理
  window.themeManager = new ThemeManager();
  
  // 初始化滚动动画
  window.scrollAnimationObserver = new ScrollAnimationObserver();
  
  // 初始化键盘快捷键
  window.keyboardShortcuts = new KeyboardShortcuts();
  
  // 更新导航高亮
  updateActiveNavLink();
  
  // 应用页面加载动画
  document.body.classList.add('loaded');
});

// 导出工具函数供全局使用
window.Utils = Utils;
