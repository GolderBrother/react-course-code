const { execSync } = require('child_process');
const { parse } = require("csv-parse/sync");
const fs = require('fs');

// const sheetUrl = "https://docs.google.com/spreadsheets/d/1IxfNyGpq8wWTYzYB1pHni0FCL1eKr9FsoSBH35OPv8w";
const sheetUrl = "https://docs.google.com/spreadsheets/d/1FgCNmoTz9FWuR6Jv1SJ9ioWd2bBfrtRAeoi5CYpmXBA";

// 实现资源包在 google sheet 的在线编辑，以及编辑完以后下载并解析生成资源包的功能。
// 用 curl 命令来下载，-L 是自动跳转的意思，因为访问这个 url 会跳转一个新的地址
execSync(`curl -L ${sheetUrl}/export?format=csv -o ./message2.csv`, {
    stdio: 'ignore'
});

const input = fs.readFileSync("./message2.csv");

// 解析读取csv文件
const records = parse(input, { columns: true });

// console.log('records', records);
const zhCNBundle = {};
const enUSBundle = {};

records.forEach(item => {
    const keys = Object.keys(item);
    const key = item[keys[0]];
    const valueZhCN = item[keys[3]];
    const valueEnUS = item[keys[4]];

    zhCNBundle[key] = valueZhCN;
    enUSBundle[key] = valueEnUS;
})
console.log(zhCNBundle);
console.log(enUSBundle);

fs.writeFileSync('./zh-CN2.json', JSON.stringify(zhCNBundle, null, 2));
fs.writeFileSync('./en-US2.json', JSON.stringify(enUSBundle, null, 2));
