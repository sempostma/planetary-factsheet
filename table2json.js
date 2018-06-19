const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');


exports.table2json = url => fetch(url)
    .then(response => response.text())
    .then(text => {
        const dom = new JSDOM(text);
        const doc = dom.window.document;

        const ret = [];

        doc.querySelectorAll('table').forEach(table => {
            const tableRows = table.querySelectorAll('tr');
            const items = [];
            const properties = [];
            const data = [];
            const obj = {};

            tableRows.item(0).querySelectorAll('td,th').forEach((th, i) => {
                if (i === 0) return;
                items.push(th.textContent.trim());
            });
            tableRows.forEach((tr, i) => {
                if (i === 0) return;
                const td = tr.querySelector('td,th');
                properties.push(td.textContent.trim());
            });
            tableRows.forEach((tr, ri) => {
                if (ri === 0) return;
                const r = [];
                tr.querySelectorAll('td,th').forEach((td, di) => {
                    if (di === 0) return;
                    r.push(td.textContent.trim());
                });
                data.push(r);
            });

            items.forEach((item, i) => {
                obj[item] = {};
                properties.forEach((row, ri) => {
                    obj[item][row] = data[ri][i];
                });
            })

            ret.push(obj);
        });
        return ret;
    });

