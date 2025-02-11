export enum StoreStatus {
  ACTIVE = 'active',
  NOT_ACCEPTING_ORDER = 'not_accepting_orders',
  TEMPORARILY_CLOSED = 'temporarily_closed',
  PERMANENTLY_CLOSED = 'permanently_closed',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum StoreType {
  Restaurant = 'restaurant',
  Bakery = 'bakery',
  JuiceBar = 'juice_bar',
  IceCream = 'ice_cream',
  CoffeeShop = 'coffee_shop',
  Pizzerias = 'pizzerias',
  Salad = 'salad',
  Grazing = 'grazing',
  ChineseRestaurant = 'chinese_restaurant',
  JapaneseRestaurant = 'japanese_restaurant',
  VietnameseFood = 'vietnamese_food',
  Korean = 'korean',
  BBQRestaurant = 'bbq_restaurant',
  BeerGardenBrewpub = 'beer_garden_brewpub',
  Steakhouse = 'steakhouse',
}
