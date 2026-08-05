import Decimal from "decimal.js";

export interface Money {
  amount: Decimal;
  currency: string;
}

export function createMoney(amount: string | number, currency = "MYR") {
  return {
    amount: new Decimal(amount),
    currency,
  } satisfies Money;
}
