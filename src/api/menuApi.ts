import { MenuItem, StockUpdatePayload, ApiResult } from '../types/menuItem';


// Начальный список позиций в меню (моки)
let mockMenuItems: MenuItem[] = [
  { id: '1', title: 'Стейк Рибай', category: 'Кухня', stock: 5 },
  { id: '2', title: 'Цезарь с креветками', category: 'Кухня', stock: 2 },
  { id: '3', title: 'Борщ домашний', category: 'Кухня', stock: 0 },
  { id: '4', title: 'Паста Карбонара', category: 'Кухня', stock: 7 },
  { id: '5', title: 'Пицца Маргарита', category: 'Кухня', stock: 4 },
  { id: '6', title: 'Куриный суп с лапшой', category: 'Кухня', stock: 1 },
  { id: '7', title: 'Тартар из лосося', category: 'Кухня', stock: 0 },
  { id: '8', title: 'Греческий салат', category: 'Кухня', stock: 10 },
  { id: '9', title: 'Котлеты из индейки с пюре', category: 'Кухня', stock: 3 },
  { id: '10', title: 'Апероль Шприц', category: 'Бар', stock: 12 },
  { id: '11', title: 'Крафтовое пиво IPA', category: 'Бар', stock: 1 },
  { id: '12', title: 'Лимонад Манго-Маракуйя', category: 'Бар', stock: 8 },
  { id: '13', title: 'Домашний мохито', category: 'Бар', stock: 0 },
  { id: '14', title: 'Капучино', category: 'Бар', stock: 25 },
  { id: '15', title: 'Чай облепиховый', category: 'Бар', stock: 6 },
  { id: '16', title: 'Медовик фирменный', category: 'Десерты', stock: 3 },
  { id: '17', title: 'Чизкейк Нью-Йорк', category: 'Десерты', stock: 0 },
  { id: '18', title: 'Тирамису', category: 'Десерты', stock: 2 },
  { id: '19', title: 'Шоколадный фондант', category: 'Десерты', stock: 4 },
  { id: '20', title: 'Мороженое пломбир', category: 'Десерты', stock: 15 },
];
// Имитация задержки сети
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Получить список меню
export const fetchMenuItems = async (): Promise<ApiResult<MenuItem[]>> => {
  await delay(800);
  if (Math.random() < 0.15) {
    return{
      ok: false,
      error: { code: 'network', message: 'Не удалось загрузить меню. Проверьте сеть.' },
    };
  }
  return { ok: true, data: mockMenuItems.map(item => ({ ...item }))};
}


export const updateMenuItem = async (payload: StockUpdatePayload): Promise<ApiResult<MenuItem>> => {
  await delay(800);
  const index = mockMenuItems.findIndex((item) => item.id === payload.id);

  if (index === -1) {
    return {
      ok: false,
      error: { code: 'unknown', message: 'Позиция не найдена в базе данных' },
    };
  }
  mockMenuItems[index] = {
    ...mockMenuItems[index],
    stock: payload.stock,
    reason: payload.reason,
  };

  return { ok: true, data: { ...mockMenuItems[index] } };
};