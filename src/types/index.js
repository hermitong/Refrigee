/**
 * 类型定义和辅助函数
 * 为 Refrigee 应用提供基础类型支持
 */

// ========== 用户相关 ==========

/**
 * 创建用户资料对象
 * @param {string} name - 用户名称
 * @param {boolean} isGuest - 是否为访客
 * @param {string} avatar - 用户头像 emoji
 * @returns {Object} 用户资料对象
 */
export const createUserProfile = (name = '', isGuest = true, avatar = '👤') => ({
    name,
    isGuest,
    avatar
});

/**
 * 默认访客用户
 */
export const DEFAULT_USER = createUserProfile();

// ========== 分类相关 ==========

/**
 * 食材分类枚举
 */
export const Category = {
    FRUIT: 'Fruit',
    VEGETABLE: 'Vegetable',
    MEAT: 'Meat',
    DAIRY: 'Dairy',
    GRAIN: 'Grain',
    BEVERAGE: 'Beverage',
    SNACK: 'Snack',
    CONDIMENT: 'Condiment',
    OTHER: 'Other'
};

/**
 * 分类标签(多语言)
 */
export const CATEGORY_LABELS = {
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

// ========== 单位选项 ==========

/**
 * 可用的计量单位
 */
export const UNIT_OPTIONS = ['pcs', 'kg', 'g', 'lb', 'oz', 'L', 'ml', 'pack', 'box', 'can'];

// ========== 库存物品相关 ==========

/**
 * 创建库存物品对象
 * @param {Object} params - 物品参数
 * @returns {Object} 库存物品对象
 */
export const createInventoryItem = ({
    id = Date.now().toString(),
    name,
    quantity = 1,
    unit = 'pcs',
    category = Category.OTHER,
    emoji = '📦',
    addedDate = Date.now(),
    expiryDate
}) => ({
    id,
    name,
    quantity,
    unit,
    category,
    emoji,
    addedDate,
    expiryDate
});

// ========== 食谱相关 ==========

/**
 * 创建食谱对象
 * @param {Object} params - 食谱参数
 * @returns {Object} 食谱对象
 */
export const createRecipe = ({
    id = `recipe-${Date.now()}`,
    name,
    description = '',
    ingredients = [],
    instructions = [],
    timeMinutes = 30,
    matchPercentage = 0,
    calories
}) => ({
    id,
    name,
    description,
    ingredients,
    instructions,
    timeMinutes,
    matchPercentage,
    calories
});

// ========== AI 结果相关 ==========

/**
 * 创建 AI 分类结果对象
 * @param {Object} params - AI 分类结果参数
 * @returns {Object} AI 分类结果对象
 */
export const createAIClassificationResult = ({
    category = Category.OTHER,
    emoji = '📦',
    shelfLifeDays = 7
}) => ({
    category,
    emoji,
    shelfLifeDays
});
