const { Workbook } = require('exceljs');
const fs = require('fs');
const languages = ['zh-CN', 'en-US'];

function main() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('james-sheet1');
    // 读取了 en-US.json 和 zh-CN.json 的内容
    const bundleData = languages.map(language => JSON.parse(fs.readFileSync(`./${language}.json`)))
    const data = [];
    const messages = JSON.parse(fs.readFileSync('./messages.json'));
    bundleData.forEach((bundle, index) => {
        for (const key in messages) {
            if (Object.hasOwnProperty.call(messages, key)) {
                const foundItem = data.find(item => item.id === key);
                const languageIndex = languages[index];
                const bundleValue = bundle[key];
                if (foundItem) {
                    foundItem[languageIndex] = bundleValue;
                } else {
                    const message = messages[key];
                    data.push({
                        id: key,
                        defaultMessage: message.defaultMessage,
                        description: message.description,
                        [languageIndex]: bundleValue
                    })
                }
            }
        }
    });
    console.log(data);
    // 然后按照 id、en-US、zh-CN 的 column 来写入 excel
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'defaultMessage', key: 'defaultMessage', width: 30 },
        { header: 'description', key: 'description', width: 50 },
        ...languages.map(item => {
            return {
                header: item,
                key: item,
                width: 30
            }
        })
    ];

    worksheet.addRows(data);

    workbook.xlsx.writeFile('./bundle.xlsx');  
}
main()