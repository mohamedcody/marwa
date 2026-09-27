import { defaultRestaurantInfo, RestaurantInfoData } from '../data/restaurantInfo';

export type { RestaurantInfoData };

/**
 * جلب بيانات المطعم محلياً مع محاكاة async خفيفة ومستقرة بدون أي خادم
 */
export async function fetchRestaurantInfo(): Promise<RestaurantInfoData> {
  return Promise.resolve(defaultRestaurantInfo);
}

export function getRestaurantInfoSync(): RestaurantInfoData {
  return defaultRestaurantInfo;
}
