let algandmed = [];
let sorteerimiseSuund = {};

// Tühjendame otsinguväljad lehe laadimisel, et näha kõiki 200 rida
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('kliendi-otsing').value = '';
    document.getElementById('teenuse-filter').value = 'koik';
    laeAndmed();
});

// Takistame tabeli sorteerimist, kui vajutatakse sisendväljadele
document.getElementById('kliendi-otsing').addEventListener('click', (e) => e.stopPropagation());
document.getElementById('teenuse-filter').addEventListener('click', (e) => e.stopPropagation());

function laeAndmed() {
    fetch('https://metshein.com/kordamine/json/broneeringud.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Serveri viga: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Tuvastame, kas andmed on otse massiiv või sisalduvad võtme all
            if (Array.isArray(data)) {
                algandmed = data;
            } else if (data.broneeringud && Array.isArray(data.broneeringud)) {
                algandmed = data.broneeringud;
            } else if (data.data && Array.isArray(data.data)) {
                algandmed = data.data;
            } else {
                algandmed = Object.values(data);
            }

            console.log(`Edukalt laaditud ${algandmed.length} broneeringut.`);
            filtreeriAndmed();
        })
        .catch(error => {
            console.error('Viga andmete laadimisel:', error);
            const tbody = document.getElementById('tabeli-sisu');
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 30px; color: #ff6b6b; font-style: italic; background: rgba(0,0,0,0.5);">
                        Andmete laadimine ebaõnnestus.<br>
                        <small style="color: #ccc;">Kui avasid faili otse kaustast, kasuta VS Code "Live Serverit".</small>
                    </td>
                </tr>
            `;
        });
}

function kuvaTabel(andmed) {
    const tbody = document.getElementById('tabeli-sisu');
    tbody.innerHTML = '';

    if (!andmed || andmed.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 30px; color: #ffdf00; font-style: italic; background: rgba(0,0,0,0.3);">
                    Ühtegi vastavat broneeringut ei leitud.
                </td>
            </tr>
        `;
        return;
    }

    andmed.forEach(rida => {
        const tr = document.createElement('tr');
        
        // Loeme väärtused sõltumata võtmenimedest JSON-is
        const nimi = rida.mnimi || rida.nimi || rida.klient || rida.eesnimi || '';
        const teenus = rida.teenus || rida.teenuse_nimi || '';
        const kuupaev = rida.kuupaev || rida.kuupäev || rida.date || '';
        const aeg = rida.kellaaeg || rida.aeg || rida.time || '';

        const teenusKlass = puhastaKlass(teenus);
        if (teenusKlass) {
            tr.classList.add(teenusKlass);
        }

        tr.innerHTML = `
            <td>${nimi}</td>
            <td>${teenus}</td>
            <td>${kuupaev}</td>
            <td>${aeg}</td>
        `;
        tbody.appendChild(tr);
    });
}

function puhastaKlass(teenus) {
    if (!teenus) return '';
    const t = teenus.toLowerCase();
    if (t.includes('juuksur')) return 'juuksur';
    if (t.includes('massa') || t.includes('massaaž')) return 'massaaz';
    if (t.includes('spa')) return 'spa';
    if (t.includes('kosmee')) return 'kosmeetika';
    return '';
}

// Reaalajas otsing ja filtreerimine
document.getElementById('kliendi-otsing').addEventListener('input', filtreeriAndmed);
document.getElementById('teenuse-filter').addEventListener('change', filtreeriAndmed);

function filtreeriAndmed() {
    const otsiTekst = document.getElementById('kliendi-otsing').value.toLowerCase().trim();
    const valitudTeenus = document.getElementById('teenuse-filter').value.toLowerCase();

    const filtreeritud = algandmed.filter(rida => {
        const nimi = (rida.mnimi || rida.nimi || rida.klient || rida.eesnimi || '').toLowerCase();
        const teenus = (rida.teenus || rida.teenuse_nimi || '').toLowerCase();

        const klapibNimi = otsiTekst === '' || nimi.includes(otsiTekst);
        const klapibTeenus = valitudTeenus === 'koik' || teenus.includes(valitudTeenus) || puhastaKlass(teenus) === valitudTeenus;

        return klapibNimi && klapibTeenus;
    });

    kuvaTabel(filtreeritud);
}

// Veergude sorteerimine
document.querySelectorAll('th[data-sort]').forEach(pais => {
    pais.addEventListener('click', () => {
        const veerg = pais.getAttribute('data-sort');
        sorteerimiseSuund[veerg] = !sorteerimiseSuund[veerg];
        const kasKasvav = sorteerimiseSuund[veerg];

        algandmed.sort((a, b) => {
            let vana = '', uus = '';
            
            if (veerg === 'klient') {
                vana = a.mnimi || a.nimi || a.klient || a.eesnimi || '';
                uus = b.mnimi || b.nimi || b.klient || b.eesnimi || '';
            } else if (veerg === 'teenus') {
                vana = a.teenus || a.teenuse_nimi || '';
                uus = b.teenus || b.teenuse_nimi || '';
            } else if (veerg === 'kuupäev') {
                vana = a.kuupaev || a.kuupäev || a.date || '';
                uus = b.kuupaev || b.kuupäev || b.date || '';
            } else if (veerg === 'aeg') {
                vana = a.kellaaeg || a.aeg || a.time || '';
                uus = b.kellaaeg || b.aeg || b.time || '';
            }

            return kasKasvav ? vana.localeCompare(uus) : uus.localeCompare(vana);
        });

        filtreeriAndmed();
    });
});