const FIELD_PATTERNS = {
  "Patient name": [
    /patient name[:\s]+([a-zA-Z\s]+)/i,
    /name[:\s]+([a-zA-Z\s]+)/i
  ],
  "Age": [
    /age[:\s]+(\d{1,3})/i
  ],
  "Gender": [
    /(male|female|other)/i
  ],
  "Admission date": [
    /admission date[:\s]+([\d\-\/]+)/i,
    /admitted on[:\s]+([\w\s\d]+)/i
  ],
  "Location": [
    /location[:\s]+([a-zA-Z\s&]+)/i
  ],
  "Referral source": [
    /referral source[:\s]+([a-zA-Z\s]+)/i,
    /(gp referral|emergency|self referral)/i
  ],
  "Problem": [
    /problem[:\s]+([a-zA-Z\s]+)/i,
    /complaint[:\s]+([a-zA-Z\s]+)/i
  ],
  "Outcome": [
    /outcome[:\s]+([a-zA-Z\s]+)/i
  ],
  "Notes": [
    /notes[:\s]+([\s\S]+)/i
  ]
};

module.exports = FIELD_PATTERNS;


const FIELD_PATTERNS = require("./fieldPatterns");

function mapTextToFields(text) {
  const mappedData = {};

  for (const field in FIELD_PATTERNS) {
    for (const regex of FIELD_PATTERNS[field]) {
      const match = text.match(regex);
      if (match && match[1]) {
        mappedData[field] = match[1].trim();
        break;
      }
    }
  }

  return mappedData;
}

module.exports = { mapTextToFields };
