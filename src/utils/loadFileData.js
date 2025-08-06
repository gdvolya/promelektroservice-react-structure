```javascript
export function loadFileData(fileData, isXlsx = false) {
  if (!fileData) {
    console.warn("No file data provided");
    return "";
  }

  if (isXlsx) {
    try {
      const workbook = XLSX.read(fileData, { type: "base64" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: "",
      });
      const filteredData = jsonData.filter((row) =>
        row.some((cell) => cell !== "" && cell != null)
      );

      const headerRowIndex = filteredData.findIndex(
        (row, index) =>
          row.filter((cell) => cell !== "" && cell != null).length >=
          filteredData[index + 1]?.filter((cell) => cell !== "" && cell != null)
            ?.length
      );
      const finalHeaderIndex = headerRowIndex === -1 || headerRowIndex > 25 ? 0 : headerRowIndex;

      const csvSheet = XLSX.utils.aoa_to_sheet(filteredData.slice(finalHeaderIndex));
      const csv = XLSX.utils.sheet_to_csv(csvSheet, { header: 1 });
      return csv;
    } catch (e) {
      console.error("Error processing XLSX file:", e.message);
      return "";
    }
  }

  return fileData || "";
}
```