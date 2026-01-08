export interface User {
  id: number;
  name: string;
  email: string;
  role: 'clerk' | 'manager' | 'admin'; // Строгая типизация ролей. типо могут быть только эти три значения
}

// Структура пластинки (см. server.js records array)
export interface MusicRecord {
  id: number;
  title: string;
  artist: string;
  format: string; // 'Vinyl' | 'CD'
  genre: string;
  releaseYear: number;
  price: number;
  stockQty: number;
  
  // Данные покупателя (могут быть пустыми)
  customerId?: string; // ID типа "123A" или хз
  customerFirstName?: string;
  customerLastName?: string;
  customerContact?: string;
  customerEmail?: string;
}