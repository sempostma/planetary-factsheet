const { table2json } = require('./table2json');

const urls = [
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    /* earth data can bet gotten from any page so lets use marsfact.html */
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html',
    'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html',
];

const names = ['Mars', 'Earth', 'Venus', 'Mercury', 'Pluto', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

const keyFmt = key => {
    key = key[0].toLowerCase() + key.slice(1);
    key = key.replace(/[()/,\._-]/g, ' ');
    key = key.replace(/10(\d+)/g, '10_$1');
    key = key.replace(/\s+[a-z]/g, s => s.toUpperCase());
    key = key.replace(/\s/g, '');
    return key;
}

const valFmt = val => {
    if (val === '-') return null;
    if (/^[-\d, \.*]+$/.test(val)) val = val.replace(/([-, *]|\.$)/g, '');
    if (!isNaN(val)) return +val;
    if (val.toLowerCase() === 'yes') return true;
    if (val.toLowerCase() === 'no') return false;
    return val;
}

const fmt = set => {
    for (const planet in set) {
        for (const prop in set[planet]) {
            set[planet][keyFmt(prop)] = valFmt(set[planet][prop]);
            delete set[planet][prop];
        }
    }
    return set;
}

Promise.all(urls.map(url => table2json(url)))
    .then(docs => Object.assign({}, ...docs.map((doc, i) => ({
        [names[i].toLowerCase()]: Object.assign({}, doc[0][names[i]], doc[1][names[i]])
    }))))
    .then(fmt)
    .then(obj => JSON.stringify(obj, null, +process.argv[2]))
    .then(console.log);

