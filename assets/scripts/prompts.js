// ============================================
// Image2 提示词列表页逻辑
// ============================================

import { promptsData } from '../../data/prompts.js';

class PromptsPage {
  constructor() {
    this.allPrompts = [];
    this.categories = [];
    this.filteredPrompts = [];
    this.currentFilters = {
      search: '',
      category: 'all',
      sort: 'latest'
    };
    this.init();
  }

  init() {
    this.loadData();
    this.renderCategoryFilters();
    this.setupEventListeners();
    this.applyUrlParams();
    this.filterAndRenderPrompts();
  }

  /**
   * 加载数据
   */
  loadData() {
    this.allPrompts = promptsData.prompts;
    this.categories = promptsData.categories;
  }

  /**
   * 渲染分类筛选器
   */
  renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;

    // 清空除了"全部"按钮外的内容
    const allButton = container.querySelector('[data-category="all"]');
    container.innerHTML = '';
    container.appendChild(allButton);

    // 添加分类按钮
    this.categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'tag';
      button.setAttribute('data-category', category.id);
      button.setAttribute('role', 'tab');
      button.innerHTML = `<span>${category.icon}</span> ${category.name}`;
      container.appendChild(button);
    });
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    // 搜索输入
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.currentFilters.search = e.target.value.trim();
        this.filterAndRenderPrompts();
        this.updateUrlParams();
      }, 300));
    }

    // 分类筛选
    const categoryFilters = document.getElementById('category-filters');
    if (categoryFilters) {
      categoryFilters.addEventListener('click', (e) => {
        const button = e.target.closest('[data-category]');
        if (button) {
          const category = button.getAttribute('data-category');
          this.currentFilters.category = category;
          this.updateCategoryButtons(category);
          this.filterAndRenderPrompts();
          this.updateUrlParams();
        }
      });
    }

    // 排序选择
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentFilters.sort = e.target.value;
        this.filterAndRenderPrompts();
        this.updateUrlParams();
      });
    }

    // 全局快捷键 Cmd/Ctrl + K 聚焦搜索框
    if (window.keyboardShortcuts) {
      window.keyboardShortcuts.register('k', () => {
        searchInput?.focus();
      }, { meta: true });

      window.keyboardShortcuts.register('k', () => {
        searchInput?.focus();
      }, { ctrl: true });
    }

    // ESC 键清空搜索
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInput === document.activeElement) {
        searchInput.value = '';
        this.currentFilters.search = '';
        this.filterAndRenderPrompts();
      }
    });
  }

  /**
   * 更新分类按钮状态
   */
  updateCategoryButtons(activeCategory) {
    const buttons = document.querySelectorAll('[data-category]');
    buttons.forEach(button => {
      const category = button.getAttribute('data-category');
      if (category === activeCategory) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      }
    });
  }

  /**
   * 搜索和筛选 Image2 提示词
   */
  filterAndRenderPrompts() {
    let results = [...this.allPrompts];

    // 应用分类筛选
    if (this.currentFilters.category !== 'all') {
      results = results.filter(prompt => 
        prompt.category === this.currentFilters.category
      );
    }

    // 应用搜索
    if (this.currentFilters.search) {
      results = this.searchPrompts(results, this.currentFilters.search);
    }

    // 应用排序
    results = this.sortPrompts(results, this.currentFilters.sort);

    this.filteredPrompts = results;
    this.renderPrompts(results);
    this.updateResultsInfo(results.length);
  }

  /**
   * 搜索匹配逻辑（带权重）
   */
  searchPrompts(prompts, query) {
    const lowerQuery = query.toLowerCase();
    
    return prompts
      .map(prompt => {
        let score = 0;
        const title = prompt.title.toLowerCase();
        const description = (prompt.description || '').toLowerCase();
        const content = (prompt.content || '').toLowerCase();
        const tags = prompt.tags.map(t => t.toLowerCase());

        // 标题完全匹配
        if (title === lowerQuery) score += 100;
        // 标题部分匹配
        else if (title.includes(lowerQuery)) score += 80;

        // 标签完全匹配
        if (tags.some(tag => tag === lowerQuery)) score += 60;
        // 标签部分匹配
        else if (tags.some(tag => tag.includes(lowerQuery))) score += 40;

        // 描述匹配
        if (description.includes(lowerQuery)) score += 40;

        // 内容匹配
        if (content.includes(lowerQuery)) score += 20;

        return { prompt, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.prompt);
  }

  /**
   * 排序 Image2 提示词
   */
  sortPrompts(prompts, sortBy) {
    const sorted = [...prompts];

    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      
      case 'updated':
        return sorted.sort((a, b) => 
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
      
      case 'popular':
        return sorted.sort((a, b) => 
          (b.usageCount || 0) - (a.usageCount || 0)
        );
      
      case 'alphabetical':
        return sorted.sort((a, b) => 
          a.title.localeCompare(b.title, 'zh-CN')
        );
      
      default:
        return sorted;
    }
  }

  /**
   * 渲染 Image2 提示词列表
   */
  renderPrompts(prompts) {
    const grid = document.getElementById('prompts-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid) return;

    // 清空网格
    grid.innerHTML = '';

    // 显示/隐藏空状态
    if (prompts.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    // 渲染卡片
    prompts.forEach((prompt, index) => {
      const card = this.createPromptCard(prompt);
      card.style.animationDelay = `${index * 50}ms`;
      card.classList.add('animate-fade-in-up');
      grid.appendChild(card);
    });
  }

  /**
   * 创建 Prompt 卡片
   */
  createPromptCard(prompt) {
    const card = document.createElement('article');
    card.className = 'prompt-card';
    card.setAttribute('data-prompt-id', prompt.id);

    // 获取分类信息
    const category = this.categories.find(c => c.id === prompt.category);
    const categoryColor = category?.color || 'var(--color-primary)';
    const promptImage = this.getPromptImage(prompt);
    const imageAlt = prompt.previewImage?.alt || `${prompt.title} 示例图`;

    card.innerHTML = `
      <div class="prompt-card-image-wrapper">
        <img
          class="prompt-card-image"
          src="${this.escapeHtml(promptImage)}"
          alt="${this.escapeHtml(imageAlt)}"
          loading="lazy"
        >
        <div class="prompt-card-image-badge">Image2 示例</div>
      </div>

      <div class="prompt-card-header">
        <div class="prompt-card-meta">
          <span class="badge badge-category" style="--category-color: ${categoryColor}">
            ${category?.icon || '📝'} ${category?.name || prompt.category}
          </span>
          ${prompt.difficulty ? `
            <span class="badge badge-difficulty-${prompt.difficulty}">
              ${prompt.difficulty}
            </span>
          ` : ''}
        </div>
      </div>
      
      <h3 class="prompt-card-title">${this.escapeHtml(prompt.title)}</h3>
      
      <p class="prompt-card-description">
        ${this.escapeHtml(prompt.description || prompt.content.substring(0, 100) + '...')}
      </p>
      
      <div class="prompt-card-tags">
        ${prompt.tags.slice(0, 4).map(tag => `
          <span class="tag">${this.escapeHtml(tag)}</span>
        `).join('')}
        ${prompt.tags.length > 4 ? `<span class="tag">+${prompt.tags.length - 4}</span>` : ''}
      </div>
      
      <div class="prompt-card-footer">
        <span class="prompt-card-time">
          ${Utils.formatRelativeTime(prompt.createdAt)}
        </span>
      </div>
    `;

    // 点击卡片打开详情
    card.addEventListener('click', () => {
      this.openPromptModal(prompt);
    });

    return card;
  }

  /**
   * 更新结果信息
   */
  updateResultsInfo(count) {
    const info = document.getElementById('results-info');
    if (info) {
      const total = this.allPrompts.length;
      if (count === total) {
        info.textContent = `共 ${total} 条 Image2 Prompt`;
      } else {
        info.textContent = `找到 ${count} 条 Image2 Prompt（共 ${total} 条）`;
      }
    }
  }

  /**
   * 打开 Prompt 详情弹窗
   */
  openPromptModal(prompt) {
    const category = this.categories.find(c => c.id === prompt.category);
    const promptImage = this.getPromptImage(prompt);
    const imageAlt = prompt.previewImage?.alt || `${prompt.title} 示例图`;
    
    const modalHTML = `
      <div class="modal-overlay modal-enter" id="prompt-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal modal-enter">
          <div class="modal-header">
            <h2 class="modal-title" id="modal-title">${this.escapeHtml(prompt.title)}</h2>
            <button class="modal-close" aria-label="关闭弹窗">×</button>
          </div>
          
          <div class="modal-content">
            <div class="modal-preview">
              <img
                class="modal-preview-image"
                src="${this.escapeHtml(promptImage)}"
                alt="${this.escapeHtml(imageAlt)}"
              >
            </div>

            <!-- 元信息 -->
            <div class="modal-meta-grid">
              ${prompt.author ? `
                <div class="meta-item">
                  <span class="meta-label">作者:</span>
                  <span class="meta-value">${this.escapeHtml(prompt.author)}</span>
                </div>
              ` : ''}
              
              <div class="meta-item">
                <span class="meta-label">分类:</span>
                <span class="meta-value">${category?.icon || ''} ${category?.name || prompt.category}</span>
              </div>
              
              ${prompt.difficulty ? `
                <div class="meta-item">
                  <span class="meta-label">难度:</span>
                  <span class="meta-value">${prompt.difficulty}</span>
                </div>
              ` : ''}
              
              ${prompt.version ? `
                <div class="meta-item">
                  <span class="meta-label">版本:</span>
                  <span class="meta-value">${prompt.version}</span>
                </div>
              ` : ''}
              
              <div class="meta-item">
                <span class="meta-label">创建时间:</span>
                <span class="meta-value">${Utils.formatRelativeTime(prompt.createdAt)}</span>
              </div>
              
              ${prompt.updatedAt ? `
                <div class="meta-item">
                  <span class="meta-label">更新时间:</span>
                  <span class="meta-value">${Utils.formatRelativeTime(prompt.updatedAt)}</span>
                </div>
              ` : ''}
            </div>
            
            <!-- Prompt 内容 -->
            <div class="prompt-content-wrapper">
              <pre class="prompt-content">${this.escapeHtml(prompt.content)}</pre>
            </div>
            
            <!-- 标签 -->
            <div class="modal-tags">
              ${prompt.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-primary" id="copy-prompt-btn">
              📋 复制提示词
            </button>
            <button class="btn btn-secondary" id="share-prompt-btn">
              🔗 分享
            </button>
          </div>
        </div>
      </div>
    `;

    const container = document.getElementById('modal-container');
    container.innerHTML = modalHTML;

    // 禁止页面滚动
    document.body.classList.add('no-scroll');

    // 事件监听
    this.setupModalEvents(prompt);
  }

  /**
   * 获取 Prompt 展示图
   */
  getPromptImage(prompt) {
    if (prompt.previewImage?.src) {
      return prompt.previewImage.src;
    }

    const categoryFallbackMap = {
      thinking: './assets/images/prompt-covers/thinking.svg',
      creative: './assets/images/prompt-covers/creative.svg',
      art: './assets/images/prompt-covers/art.svg',
      tech: './assets/images/prompt-covers/tech.svg',
      life: './assets/images/prompt-covers/life.svg',
      meta: './assets/images/prompt-covers/meta.svg'
    };

    return categoryFallbackMap[prompt.category] || './assets/images/prompt-covers/default.svg';
  }

  /**
   * 设置弹窗事件
   */
  setupModalEvents(prompt) {
    const modal = document.getElementById('prompt-modal');
    if (!modal) return;

    // 关闭按钮
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => this.closeModal());

    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // ESC 键关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 复制按钮
    const copyBtn = document.getElementById('copy-prompt-btn');
    copyBtn?.addEventListener('click', async () => {
      const success = await Utils.copyToClipboard(prompt.content);
      if (success) {
        copyBtn.textContent = '✓ 已复制';
        copyBtn.classList.add('copy-success');
        Utils.showToast('提示词已复制到剪贴板', 'success');
        setTimeout(() => {
          copyBtn.textContent = '📋 复制提示词';
          copyBtn.classList.remove('copy-success');
        }, 2000);
      } else {
        Utils.showToast('复制失败', 'error');
      }
    });

    // 分享按钮
    const shareBtn = document.getElementById('share-prompt-btn');
    shareBtn?.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('id', prompt.id);
      Utils.copyToClipboard(url.toString());
      Utils.showToast('分享链接已复制', 'success');
    });
  }

  /**
   * 关闭弹窗
   */
  closeModal() {
    const modal = document.getElementById('prompt-modal');
    if (modal) {
      modal.classList.add('modal-exit');
      const modalDialog = modal.querySelector('.modal');
      modalDialog?.classList.add('modal-exit');
      
      setTimeout(() => {
        modal.remove();
        document.body.classList.remove('no-scroll');
      }, 200);
    }
  }

  /**
   * 应用 URL 参数
   */
  applyUrlParams() {
    const params = Utils.getUrlParams();

    // 应用搜索参数
    if (params.search) {
      this.currentFilters.search = params.search;
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = params.search;
    }

    // 应用分类参数
    if (params.category) {
      this.currentFilters.category = params.category;
      this.updateCategoryButtons(params.category);
    }

    // 应用排序参数
    if (params.sort) {
      this.currentFilters.sort = params.sort;
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) sortSelect.value = params.sort;
    }

    // 如果有 id 参数，打开对应的 Prompt
    if (params.id) {
      const prompt = this.allPrompts.find(p => p.id === params.id);
      if (prompt) {
        setTimeout(() => this.openPromptModal(prompt), 500);
      }
    }
  }

  /**
   * 更新 URL 参数
   */
  updateUrlParams() {
    Utils.updateUrlParams({
      search: this.currentFilters.search || null,
      category: this.currentFilters.category !== 'all' ? this.currentFilters.category : null,
      sort: this.currentFilters.sort !== 'latest' ? this.currentFilters.sort : null
    });
  }

  /**
   * 转义 HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ============================================
// 全局函数 - 重置筛选
// ============================================

function resetFilters() {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'latest';
  
  if (window.promptsPage) {
    window.promptsPage.currentFilters = {
      search: '',
      category: 'all',
      sort: 'latest'
    };
    window.promptsPage.updateCategoryButtons('all');
    window.promptsPage.filterAndRenderPrompts();
    window.promptsPage.updateUrlParams();
  }
}

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  window.promptsPage = new PromptsPage();
});
