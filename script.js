let fiches = [];

function normaliserTexte(texte) {
    return (texte || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function afficherResultats(resultats) {
    const container = document.getElementById('results');

    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (!resultats.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez un autre mot-clé comme « papier », « acétone » ou « soude ».</p>
            </div>
        `;
        return;
    }

    resultats.forEach(fiche => {
        const lien = fiche.url
            ? `<a class="fiche-link" href="${fiche.url}" target="_blank" rel="noopener noreferrer">Ouvrir la fiche</a>`
            : '';

        container.innerHTML += `
            <article class="fiche">
                <h3>${fiche.nom}</h3>
                ${lien}
            </article>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const recherche = normaliserTexte(this.value);

            if (!recherche) {
                afficherResultats(fiches);
                return;
            }

            const resultats = fiches.filter(fiche => {
                const texte = `${fiche.nom} ${fiche.description}`;
                return normaliserTexte(texte).includes(recherche);
            });

            afficherResultats(resultats);
        });
    }

    fetch('fiches.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fiches = data;
            afficherResultats(fiches);
        })
        .catch(error => {
            console.error('Erreur lors du chargement du JSON :', error);
            const container = document.getElementById('results');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>Impossible de charger les fiches</h3>
                        <p>Vérifiez que le fichier de données est bien présent et accessible.</p>
                    </div>
                `;
            }
        });
});