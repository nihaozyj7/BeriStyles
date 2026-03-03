/**
 * 消息通知组件
 * 支持多种类型（成功、错误、警告、信息）和位置
 * 自动适配主题，通过读取 CSS 变量实现
 */

/**
 * 通知类型
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * 通知位置
 */
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * 通知配置选项
 */
export interface NotificationOptions {
  /** 通知类型 */
  type?: NotificationType;
  /** 通知标题 */
  title?: string;
  /** 通知内容 */
  message: string;
  /** 显示位置 */
  position?: NotificationPosition;
  /** 显示时长（毫秒），默认 4500 */
  duration?: number;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 自定义类名 */
  customClass?: string;
  /** 关闭时的回调 */
  onClose?: () => void;
}

/**
 * 默认配置
 */
const defaultOptions: Required<Omit<NotificationOptions, 'message' | 'onClose'>> &
  Pick<NotificationOptions, 'onClose'> = {
  type: 'info',
  title: '',
  position: 'top-right',
  duration: 4500,
  closable: true,
  showIcon: true,
  customClass: '',
  onClose: undefined,
};

/**
 * 图标映射
 */
const iconMap: Record<NotificationType, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

/**
 * 通知容器映射，用于管理不同位置的通知
 */
const containerMap: Map<NotificationPosition, HTMLElement> = new Map();

/**
 * 获取或创建通知容器
 * @param position - 通知位置
 * @returns 容器元素
 */
function getContainer(position: NotificationPosition): HTMLElement {
  if (containerMap.has(position)) {
    return containerMap.get(position)!;
  }

  const container = document.createElement('div');
  container.className = `notification-container notification-${position}`;

  // 读取 CSS 变量设置 z-index
  const zIndex = getComputedStyle(document.documentElement).getPropertyValue(
    '--notification-z-index'
  ) || '9999';
  container.style.zIndex = zIndex;

  document.body.appendChild(container);
  containerMap.set(position, container);

  return container;
}

/**
 * 创建通知元素
 * @param options - 通知配置
 * @returns 通知元素和关闭方法
 */
function createNotification(
  options: NotificationOptions
): { element: HTMLElement; close: () => void } {
  const mergedOptions = { ...defaultOptions, ...options };
  const {
    type,
    title,
    message,
    position,
    closable,
    showIcon,
    customClass,
    onClose,
  } = mergedOptions;

  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = [
    'notification',
    `notification-${type}`,
    customClass,
  ]
    .filter(Boolean)
    .join(' ');

  // 创建内容容器
  const content = document.createElement('div');
  content.className = 'notification-content';

  // 添加图标
  if (showIcon) {
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = iconMap[type || 'info'];
    content.appendChild(icon);
  }

  // 创建文本容器
  const textWrapper = document.createElement('div');
  textWrapper.className = 'notification-text';

  // 添加标题
  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'notification-title';
    titleEl.textContent = title;
    textWrapper.appendChild(titleEl);
  }

  // 添加消息内容
  const messageEl = document.createElement('div');
  messageEl.className = 'notification-message';
  messageEl.textContent = message;
  textWrapper.appendChild(messageEl);

  content.appendChild(textWrapper);
  notification.appendChild(content);

  // 添加关闭按钮
  let closeBtn: HTMLButtonElement | null = null;
  if (closable) {
    closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', '关闭通知');
    notification.appendChild(closeBtn);
  }

  // 添加到容器
  const container = getContainer(position || 'top-right');

  // 根据位置决定插入方式
  const isBottomPosition = position?.startsWith('bottom');
  if (isBottomPosition) {
    container.appendChild(notification);
  } else {
    container.insertBefore(notification, container.firstChild);
  }

  // 触发重绘以启动动画
  notification.offsetHeight;

  // 添加显示类
  notification.classList.add('notification-show');

  // 关闭方法
  const close = () => {
    notification.classList.remove('notification-show');
    notification.classList.add('notification-hide');

    // 等待动画完成后移除元素
    const handleTransitionEnd = () => {
      notification.remove();

      // 如果容器为空，移除容器
      if (container.children.length === 0) {
        container.remove();
        containerMap.delete(position || 'top-right');
      }

      // 执行回调
      onClose?.();
    };

    notification.addEventListener('transitionend', handleTransitionEnd, {
      once: true,
    });

    // 保险：如果 transitionend 未触发，强制清理
    setTimeout(() => {
      if (notification.parentElement) {
        handleTransitionEnd();
      }
    }, 400);
  };

  // 绑定关闭按钮事件
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  return { element: notification, close };
}

/**
 * 通知 ID 计数器
 */
let notificationId = 0;

/**
 * 活跃的通知映射
 */
const activeNotifications: Map<number, () => void> = new Map();

/**
 * 显示通知
 * @param options - 通知配置或消息字符串
 * @returns 通知 ID，可用于手动关闭
 */
export function notify(
  options: NotificationOptions | string
): number {
  const opts: NotificationOptions =
    typeof options === 'string' ? { message: options } : options;

  const id = ++notificationId;
  const { element, close } = createNotification(opts);

  // 存储关闭方法
  activeNotifications.set(id, close);

  // 自动关闭
  const duration = opts.duration ?? defaultOptions.duration;
  if (duration > 0) {
    setTimeout(() => {
      close();
      activeNotifications.delete(id);
    }, duration);
  }

  // 存储 ID 到元素上，方便后续操作
  element.dataset.notificationId = String(id);

  return id;
}

/**
 * 关闭指定通知
 * @param id - 通知 ID
 */
export function closeNotification(id: number): void {
  const close = activeNotifications.get(id);
  if (close) {
    close();
    activeNotifications.delete(id);
  }
}

/**
 * 关闭所有通知
 */
export function closeAllNotifications(): void {
  activeNotifications.forEach((close) => close());
  activeNotifications.clear();
}

/**
 * 显示成功通知
 * @param message - 消息内容或配置选项
 * @returns 通知 ID
 */
export function notifySuccess(
  message: string | Omit<NotificationOptions, 'type'>
): number {
  const opts: NotificationOptions =
    typeof message === 'string' ? { message } : message;
  return notify({ ...opts, type: 'success' });
}

/**
 * 显示错误通知
 * @param message - 消息内容或配置选项
 * @returns 通知 ID
 */
export function notifyError(
  message: string | Omit<NotificationOptions, 'type'>
): number {
  const opts: NotificationOptions =
    typeof message === 'string' ? { message } : message;
  return notify({ ...opts, type: 'error' });
}

/**
 * 显示警告通知
 * @param message - 消息内容或配置选项
 * @returns 通知 ID
 */
export function notifyWarning(
  message: string | Omit<NotificationOptions, 'type'>
): number {
  const opts: NotificationOptions =
    typeof message === 'string' ? { message } : message;
  return notify({ ...opts, type: 'warning' });
}

/**
 * 显示信息通知
 * @param message - 消息内容或配置选项
 * @returns 通知 ID
 */
export function notifyInfo(
  message: string | Omit<NotificationOptions, 'type'>
): number {
  const opts: NotificationOptions =
    typeof message === 'string' ? { message } : message;
  return notify({ ...opts, type: 'info' });
}

/**
 * 更新通知配置
 * @param id - 通知 ID
 * @param options - 新的配置选项
 */
export function updateNotification(
  id: number,
  options: Partial<NotificationOptions>
): void {
  const element = document.querySelector(
    `[data-notification-id="${id}"]`
  ) as HTMLElement | null;

  if (!element) return;

  // 更新类型
  if (options.type) {
    element.classList.remove('notification-info', 'notification-success', 'notification-warning', 'notification-error');
    element.classList.add(`notification-${options.type}`);
  }

  // 更新标题
  if (options.title !== undefined) {
    let titleEl = element.querySelector('.notification-title') as HTMLElement | null;
    if (options.title) {
      if (!titleEl) {
        titleEl = document.createElement('div');
        titleEl.className = 'notification-title';
        const textWrapper = element.querySelector('.notification-text');
        if (textWrapper) {
          textWrapper.insertBefore(titleEl, textWrapper.firstChild);
        }
      }
      titleEl.textContent = options.title;
    } else if (titleEl) {
      titleEl.remove();
    }
  }

  // 更新消息
  if (options.message) {
    const messageEl = element.querySelector('.notification-message') as HTMLElement | null;
    if (messageEl) {
      messageEl.textContent = options.message;
    }
  }
}

// Notification 对象，包含所有方法
export const Notification = {
  show: notify,
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  close: closeNotification,
  closeAll: closeAllNotifications,
  update: updateNotification,
};

// 导出默认对象
export default Notification;
