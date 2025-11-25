export type Language = 'en' | 'zh';

export enum Category {
  FRUIT = 'Fruit',
  VEGETABLE = 'Vegetable',
  MEAT = 'Meat',
  DAIRY = 'Dairy',
  GRAIN = 'Grain',
  BEVERAGE = 'Beverage',
  SNACK = 'Snack',
  CONDIMENT = 'Condiment',
  OTHER = 'Other'
}

export const CATEGORY_LABELS: Record<Language, Record<Category, string>> = {
  en: {
    [Category.FRUIT]: 'Fruit',
    [Category.VEGETABLE]: 'Vegetable',
    [Category.MEAT]: 'Meat',
    [Category.DAIRY]: 'Dairy',
    [Category.GRAIN]: 'Grain',
    [Category.BEVERAGE]: 'Beverage',
    [Category.SNACK]: 'Snack',
    [Category.CONDIMENT]: 'Condiment',
    [Category.OTHER]: 'Other'
  },
  zh: {
    [Category.FRUIT]: '水果',
    [Category.VEGETABLE]: '蔬菜',
    [Category.MEAT]: '肉类',
    [Category.DAIRY]: '乳制品',
    [Category.GRAIN]: '谷物',
    [Category.BEVERAGE]: '饮料',
    [Category.SNACK]: '零食',
    [Category.CONDIMENT]: '调味品',
    [Category.OTHER]: '其他'
  }
};

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  emoji: string;
  addedDate: number; // Timestamp
  expiryDate: number; // Timestamp
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  timeMinutes: number;
  matchPercentage: number;
  calories?: number;
}

export interface AIClassificationResult {
  category: string;
  emoji: string;
  shelfLifeDays: number;
}

export const UNIT_OPTIONS = ['pcs', 'kg', 'g', 'lb', 'oz', 'L', 'ml', 'pack', 'box', 'can'];