export interface FlashSaleStatus {
  isActiveNow: boolean;             // Is current time between 9 PM and 10 PM?
  itemsRemainingThisMonth: number;  // How many ₹1 items can user still buy this month (out of 5)?
  isQuotaExhausted: boolean;        // Has user bought 5 items at ₹1 this month?
  currentMonthKey: string;          // e.g. "2026-08"
  timeRemainingStr: string;         // e.g. "42m 18s"
  nextResetDateStr: string;         // e.g. "1st of Next Month"
  itemsUsedThisMonth: number;
}

export const getFlashSaleStatus = (): FlashSaleStatus => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Active everyday between 21:00 (9 PM) and 22:00 (10 PM)
  const isActiveNow = hours === 21;

  // Current month key: e.g. "2026-08"
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Read user's monthly flash sale purchase count from localStorage
  const savedUsageRaw = localStorage.getItem('cartcraze_flash_sale_usage');
  let usedThisMonth = 0;
  if (savedUsageRaw) {
    try {
      const parsed = JSON.parse(savedUsageRaw);
      if (parsed.monthKey === monthKey) {
        usedThisMonth = parsed.count || 0;
      }
    } catch {}
  }

  const itemsRemainingThisMonth = Math.max(0, 5 - usedThisMonth);
  const isQuotaExhausted = itemsRemainingThisMonth <= 0;

  // Time remaining in 9 PM - 10 PM window
  let timeRemainingStr = '00m 00s';
  if (isActiveNow) {
    const minsLeft = 59 - minutes;
    const secsLeft = 59 - seconds;
    timeRemainingStr = `${minsLeft}m ${secsLeft < 10 ? '0' : ''}${secsLeft}s`;
  }

  // Next reset date string: e.g. "1st of September"
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextResetDateStr = `1st of ${nextMonthDate.toLocaleString('default', { month: 'long' })}`;

  return {
    isActiveNow,
    itemsRemainingThisMonth,
    isQuotaExhausted,
    currentMonthKey: monthKey,
    timeRemainingStr,
    nextResetDateStr,
    itemsUsedThisMonth: usedThisMonth
  };
};

export const recordFlashSalePurchase = (itemCount: number) => {
  const status = getFlashSaleStatus();
  const savedUsageRaw = localStorage.getItem('cartcraze_flash_sale_usage');
  let usedThisMonth = 0;
  if (savedUsageRaw) {
    try {
      const parsed = JSON.parse(savedUsageRaw);
      if (parsed.monthKey === status.currentMonthKey) {
        usedThisMonth = parsed.count || 0;
      }
    } catch {}
  }
  const newCount = usedThisMonth + itemCount;
  localStorage.setItem('cartcraze_flash_sale_usage', JSON.stringify({
    monthKey: status.currentMonthKey,
    count: newCount
  }));
};
