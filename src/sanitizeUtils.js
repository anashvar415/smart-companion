

const personalKeywords = [
  'Akshay', 'Singh', 'Rahul', 'Priya',
];

const locationMap = {
  'my room': 'a personal room',
  'my house': 'the residence',
  'my kitchen': 'the kitchen area',
  'nit silchar': 'the campus',
  'silchar': 'the local area',
  'guwahati': 'the destination'
};

/**
 * Sanitizes user input to remove PII (Personally Identifiable Information)
 * before sending it to an LLM.
 */
export const sanitizeTask = (task) => {
  if (!task) return "";

  let cleaned = task.toLowerCase();

  // 1. Replace specific known locations/personal items using the map
  Object.keys(locationMap).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    cleaned = cleaned.replace(regex, locationMap[key]);
  });

  // 2. Remove Personal Names (Simple Regex for common patterns)
  // This matches words in the specific name list
  personalKeywords.forEach(name => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '[User]');
  });

  // 3. Remove email-like patterns
  cleaned = cleaned.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[Email]');

  // 4. Remove phone numbers (simple 10-digit or international format)
  cleaned = cleaned.replace(/(\+?\d{1,3}[- ]?)?\d{10}/g, '[Phone Number]');

  // Capitalize first letter and return
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

