export const CATEGORIES = [
  "General",
  "Love",
  "Health",
  "Work",
  "Finance",
  "Personal",
];

export const CATEGORY_GRADIENTS: Record<string, string> = {
  General:
    "conic-gradient(from 0deg, #ff0000 0%, #00ff22 20%, #0066ff 40%, #000000 60%, #ff00aa 80%, #ffbb00 100%)",
  Love: "conic-gradient(from 0deg, #ff0000 0%, #ff0b0b 15%, #ff6600 30%, #991f00 45%, #ff1100 60%, #ff4726 75%, #ff3300 90%)",
  Health:
    "conic-gradient(from 0deg, #48ff00 0%, #317c06 20%, #33ff44 40%, #0a720a 60%, #90ca23 80%, #5a8030 100%)",
  Work: "conic-gradient(from 0deg, #00ffff 0%, #003cff 20%, #0084ff 40%, #0092cc 60%, #11385c 80%, #0066ff 100%)",
  Finance:
    "conic-gradient(from 0deg, #ffd000 0%, #ffe6009d 20%, #ff9900 40%, #ccad00 60%, #ff6600 80%, #ff9900 100%)",
  Personal:
    "conic-gradient(from 0deg, #cc00ff 0%, #ff66ff 20%, #cc00ff 40%, #6600cc 60%, #cc00ff 80%, #ff66ff 100%)",
};

export const CATEGORY_MAP: Record<string, string> = {
  General: "about",
  Love: "love",
  Health: "health",
  Finance: "finance",
  Personal: "personal",
  Work: "work",
};
