const { Workbook } = require("exceljs");
const fs = require("fs");
async function main() {
  const workbook = new Workbook();
  const workbook2 = await workbook.xlsx.readFile("./bundle.xlsx");

  const zhCNBundle = {};
  const enUSBundle = {};

  // 工作表 => 每一行 => 单元格
  // 解析也是按照 workbook（工作簿） > worksheet（工作表）> row （行）的层次，调用 eachSheet、eachRow、eachCell 就好了
  workbook2.eachSheet((sheet, sheetIndex) => {
    console.log("工作表" + sheetIndex);
    sheet.eachRow((row, rowIndex) => {
      // 忽略表头
      if (rowIndex === 1) {
        return;
      }
      const key = row.getCell(1).value;
      const zhCNValue = row.getCell(4).value;
      const enUSValue = row.getCell(5).value;
      zhCNBundle[key] = zhCNValue;
      enUSBundle[key] = enUSValue;
    });
  });

  console.log(zhCNBundle);
  console.log(enUSBundle);
  fs.writeFileSync("zh-CN.json", JSON.stringify(zhCNBundle, null, 2));
  fs.writeFileSync("en-US.json", JSON.stringify(enUSBundle, null, 2));
}
main().catch(console.error);
