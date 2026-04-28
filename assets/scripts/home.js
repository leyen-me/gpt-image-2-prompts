// ============================================
// 首页逻辑 - 统计数据动画
// ============================================

import { promptsData } from '../../data/prompts.js';

class HomePage {
  constructor() {
    this.stats = {
      total: 0,
      categories: 0,
      tags: 0
    };
    this.init();
  }

  init() {
    this.loadData();
    this.setupAnimations();
  }

  /**
   * 加载数据
   */
  loadData() {
    // 计算统计数据
    this.stats.total = promptsData.prompts.length;
    this.stats.categories = promptsData.categories.length;
    
    // 统计标签数量（去重）
    const allTags = new Set();
    promptsData.prompts.forEach(prompt => {
      if (prompt.tags) {
        prompt.tags.forEach(tag => allTags.add(tag));
      }
    });
    this.stats.tags = allTags.size;
  }

  /**
   * 设置动画
   */
  setupAnimations() {
    // 使用 Intersection Observer 监听统计区域进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStats();
            observer.disconnect(); // 只执行一次
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    } else {
      // 如果找不到统计区域，直接执行动画
      this.animateStats();
    }
  }

  /**
   * 数字递增动画
   * @param {HTMLElement} element - 目标元素
   * @param {number} target - 目标数字
   * @param {number} duration - 动画时长（毫秒）
   */
  animateNumber(element, target, duration = 1000) {
    if (!element) return;

    const start = 0;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateNumber);
  }

  /**
   * 执行所有统计数据动画
   */
  animateStats() {
    const statTotal = document.getElementById('stat-total');
    const statCategories = document.getElementById('stat-categories');
    const statTags = document.getElementById('stat-tags');

    // 添加动画类
    if (statTotal) statTotal.classList.add('animate-count-up');
    if (statCategories) statCategories.classList.add('animate-count-up');
    if (statTags) statTags.classList.add('animate-count-up');

    // 延迟执行数字动画，让淡入动画先完成
    setTimeout(() => {
      this.animateNumber(statTotal, this.stats.total, 1200);
      this.animateNumber(statCategories, this.stats.categories, 1000);
      this.animateNumber(statTags, this.stats.tags, 1400);
    }, 200);
  }
}

// ============================================
// 页面加载完成后初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const homePage = new HomePage();
});
