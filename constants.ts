export const BOOKS_PER_PAGE = 12;
export const USER_FREE_LIMIT = 5;
export const CHAT_LIMIT_PER_BOOK = 5;

export enum ErrorType {
  ALREADY_FAV = "ALREADY_FAV",
  UPGRADE_PLAN = "UPGRADE_PLAN",
  SIGN_IN_REQUIRED = "SIGN_IN_REQUIRED",
}

export const CategoriesColors: Record<string, string> = {
  "fiction": "bg-blue-500",
  "business": "bg-green-500",
  "technology": "bg-red-500",
  "science": "bg-purple-500",
  "art": "bg-pink-500",
  "biography": "bg-purple-500",
  "history": "bg-gray-500",
  "travel": "bg-green-500",
  "religion": "bg-red-500",
  "cooking": "bg-purple-500",
  "sports": "bg-pink-500",
  "education": "bg-indigo-500",
  "comics": "bg-gray-500",
  "psychology": "bg-green-500",
  "family": "bg-purple-500",
  "relationships": "bg-purple-500",
  "wars": "bg-pink-500",
  "general": "bg-gray-500",
  "autobiography": "bg-yellow-500",
  "political": "bg-green-500",
  "health": "bg-green-500",
  "fitness": "bg-red-500",
  "vitamins": "bg-purple-500",
  "diet": "bg-pink-500",
  "nutrition": "bg-indigo-500",
  "computers": "bg-gray-500",
};

export enum Category {
  FICTION = "fiction",
  BUSINESS = "business",
  HISTORY = "history",
  SCIENCE = "science",
  ART = "art",
  BIOGRAPHY = "biography",
  COOKING = "cooking",
  TRAVEL = "travel",
  HEALTH = "health",
  FAMILY = "family",
  SPORTS = "sports",
  RELIGION = "religion",
  PHILOSOPHY = "philosophy",
  PSYCHOLOGY = "psychology",
  EDUCATION = "education",
  LAW = "law",
  COMPUTER = "computer",
  TECHNOLOGY = "technology",
  ENGINEERING = "engineering",
  MATHEMATICS = "mathematics",
  MEDICAL = "medical",
  SOCIAL = "social",
  POLITICAL = "political",
  LITERARY = "literary",
  CRITICISM = "criticism",
  DRAMA = "drama",
  POETRY = "poetry",
}
