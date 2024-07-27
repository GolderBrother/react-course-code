const { Workbook } = require('exceljs');

async function main(){
    const workbook = new Workbook();

    // 按照 workbook（工作簿） > worksheet（工作表）> row （行）的层次来添加数据。
    const worksheet = workbook.addWorksheet('james11');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: '姓名', key: 'name', width: 30 },
        { header: '出生日期', key: 'birthday', width: 30},
        { header: '手机号', key: 'phone', width: 50 }
    ];

    const data = [
        { id: 1, name: 'james', birthday: new Date('1994-07-07'), phone: '1111111' },
        { id: 2, name: 'zhang', birthday: new Date('1994-04-14'), phone: '22222' },
        { id: 3, name: 'golder', birthday: new Date('1995-08-08'), phone: '33333' }
    ]
    worksheet.addRows(data);

    workbook.xlsx.writeFile('./data.xlsx');    
}

main();
