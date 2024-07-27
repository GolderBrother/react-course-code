const { stringify } = require("csv-stringify");
const fs = require("fs");

const languages = ["zh-CN", "en-US"];

async function main() {
  const bundleData = languages.map((language) =>
    JSON.parse(fs.readFileSync(`${language}.json`))
  );

  const data = [];

  const messages = JSON.parse(fs.readFileSync("./messages.json"));
  bundleData.forEach((bundle, index) => {
    for (const key in messages) {
      if (Object.hasOwnProperty.call(messages, key)) {
        const foundItem = data.find((item) => item.id === key);
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
            [languageIndex]: bundleValue,
          });
        }
      }
    }
  });

  console.log(data);

//   定义 columns 和 column 对应的 data，调用 stringify 来转成 csv 文件
  const columns = {
    id: "Message ID",
    defaultMessage: "Default Message",
    description: "Description",
    "zh-CN": "zh-CN",
    "en-US": "en-US",
  };

  stringify(data, { header: true, columns }, (err, output) => {
    fs.writeFileSync("output.csv", output);
  })
}

main();
