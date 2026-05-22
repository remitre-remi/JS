// Ülesanne 10
// 1. Toote objekt
// Loo toote jaoks objekt ‘toode‘, mis sisaldab vähemalt 3 omadust (nimetus, hind, kogus)

// Kuva objekti omadused konsoolis
// Lisa meetodid ja kuva konsoolis:
//      toote koguhind
//      muudab toote kogust
//      kuvab objekti sisu, kasutades sõne malli

let toode = { 
    nimetus: "sai", 
    hind: 3, 
    kogus: 2022,

    koguhind: function () {
        return this.hind * this.kogus;
    }

};

const ostukorv = {
tooted: [
        { nimi:'Piim', hind:3.60, kogus:2 },
        { nimi:'Leib', hind:2.00, kogus:1 },
        { nimi:'Munad', hind:1.50, kogus:6 },
        { nimi:'Juust', hind:4.20, kogus:1 },
        { nimi:'Tomatid', hind:2.30, kogus:3 },
    ],

    koik_tooted: function () {
        this.tooted.forEach(t => {
        console.log(t.nimi + " " + t.hind + "€" + " " + t.kogus + "tk")
        })
    }
}

ostukorv.koik_tooted()
    

