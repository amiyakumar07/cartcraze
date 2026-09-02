export interface FlashSaleStatus {
  isActiveNow: boolean;
  itemsRemainingToday: number;
  isQuotaExhausted: boolean;
  timeRemainingStr: string;
  itemsUsedToday: number;
  hasOrderedToday: boolean;
}

export const getFlashSaleStatus = (): FlashSaleStatus => {
  const now = new Date();
  const todayKey = now.toDateString();

  // Active everyday between 9 PM and 10 PM
  const isActiveNow = now.getHours() === 21;

  // Check if user has ordered today
  const lastOrderDate = localStorage.getItem('cartcraze_last_order_date');
  const hasOrderedToday = lastOrderDate === todayKey;

  // Usage today (max 5 items quantity)
  const savedUsageRaw = localStorage.getItem('cartcraze_10rs_sale_usage');
  let usedToday = 0;
  if (savedUsageRaw) {
    try {
      const parsed = JSON.parse(savedUsageRaw);
      if (parsed.todayKey === todayKey) {
        usedToday = parsed.count || 0;
      }
    } catch {}
  }

  const itemsRemainingToday = Math.max(0, 5 - usedToday);
  const isQuotaExhausted = hasOrderedToday || itemsRemainingToday <= 0;

  // Time remaining in 9 PM - 10 PM window
  let timeRemainingStr = '00m 00s';
  if (isActiveNow) {
    const minsLeft = 59 - now.getMinutes();
    const secsLeft = 59 - now.getSeconds();
    timeRemainingStr = `${minsLeft}m ${secsLeft < 10 ? '0' : ''}${secsLeft}s`;
  }

  return {
    isActiveNow,
    itemsRemainingToday,
    isQuotaExhausted,
    timeRemainingStr,
    itemsUsedToday: usedToday,
    hasOrderedToday
  };
};

export const record10RsSalePurchase = (itemCount: number = 1) => {
  const todayKey = new Date().toDateString();
  localStorage.setItem('cartcraze_last_order_date', todayKey);

  const status = getFlashSaleStatus();
  const newCount = status.itemsUsedToday + itemCount;
  localStorage.setItem('cartcraze_10rs_sale_usage', JSON.stringify({
    todayKey,
    count: newCount
  }));
};

export const recordFlashSalePurchase = record10RsSalePurchase;
