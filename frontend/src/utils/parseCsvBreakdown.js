import Papa from "papaparse";

const parseCsvBreakdown = (csvText) => {
  const rows = Papa.parse(csvText.trim(), { header: true }).data;

  const breakdown = [];
  const grouped = {};

  for (const row of rows) {
    const { Label, Value, Max } = row;

    if (!Label || isNaN(Number(Value)) || isNaN(Number(Max))) continue;

    if (Label.includes("->")) {
      const [parent, child] = Label.split("->").map((s) => s.trim());

      if (!grouped[parent]) {
        grouped[parent] = {
          label: parent,
          value: 0,
          max: 0,
          sub: [],
        };
      }

      grouped[parent].sub.push({
        label: child,
        value: Number(Value),
        max: Number(Max),
      });
    } else {
      breakdown.push({
        label: Label.trim(),
        value: Number(Value),
        max: Number(Max),
      });
    }
  }

  // Merge grouped sub-sections into breakdown
  for (const key in grouped) {
    const item = grouped[key];
    item.value = item.sub.reduce((sum, s) => sum + s.value, 0);
    item.max = item.sub.reduce((sum, s) => sum + s.max, 0);
    breakdown.push(item);
  }

  return breakdown;
};

export default parseCsvBreakdown;
