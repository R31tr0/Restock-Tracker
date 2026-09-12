export type StockStatus = 'in_stock' | 'low' | 'stopped';
export type StopReason = 'sold_out' | 'no_supply' | 'quality' | 'other';

export interface MenuItem {
  id: string;
  title: string;
  category: 'Кухня' | 'Бар' | 'Десерты';
  stock: number;
  reason?: StopReason;
}

export type StockUpdatePayload = {
  id: string;
  stock: number;
  reason: StopReason;
  stockStatus: StockStatus;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: 'network' | 'unknown'; message: string } };