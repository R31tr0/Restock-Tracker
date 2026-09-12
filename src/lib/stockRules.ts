import { StockStatus } from '../types/menuItem';


// Функция определяет статус по остатку
export const statusOf = (stock: number): StockStatus => {
  if (stock <= 0) return 'stopped';
  if (stock <= 3) return 'low';
  return 'in_stock';
}


// Функция парсинга и валидации инпута
export const parseStock = (input: string): { isValid: boolean; value: number; error?: string } => {
  if (!input || input.trim() === '') {
    return { isValid: false, value: 0, error: 'Поле не должно быть пустым' };
  }

  const num = Number(input);
  if (isNaN(num) || !Number.isInteger(num)) {
    return { isValid: false, value: 0, error: 'Введите целое число' };
  }

  if (num < 0) {
    return { isValid: false, value: 0, error: 'Введите неотрицательное число' };
  }

  if (num > 999) {
    return { isValid: false, value: 0, error: 'Слишком большое значение (макс. 999)' };
  }

  return { isValid: true, value: num };
}