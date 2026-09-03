import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export interface CartSummaryResult {
  itemCount: number;
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  buy2Discount: number;
  couponDiscount: number;
  finalPay: number;
  isFreeDeliveryEligible: boolean;
  amountNeededForFreeDelivery: number;
}

export const useCartSummary = (): CartSummaryResult => {
  const { cart, getCartTotal, getBuy2DiscountTotal, getFinalPayAmount, appliedCoupon } = useApp();

  return useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemTotal = getCartTotal();
    const deliveryFee = itemTotal >= 99 ? 0 : 25;
    const handlingFee = 5;
    const buy2Discount = getBuy2DiscountTotal();
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const finalPay = getFinalPayAmount();
    const isFreeDeliveryEligible = itemTotal >= 99;
    const amountNeededForFreeDelivery = itemTotal < 99 ? 99 - itemTotal : 0;

    return {
      itemCount,
      itemTotal,
      deliveryFee,
      handlingFee,
      buy2Discount,
      couponDiscount,
      finalPay,
      isFreeDeliveryEligible,
      amountNeededForFreeDelivery
    };
  }, [cart, getCartTotal, getBuy2DiscountTotal, getFinalPayAmount, appliedCoupon]);
};
