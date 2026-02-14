// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Slider année
    const yearSlider = document.getElementById('year');
    const yearValue = document.getElementById('yearValue');
    yearSlider?.addEventListener('input', e => {
        yearValue.textContent = e.target.value;
    });

    // Formulaire de prédiction
    document.getElementById('predictionForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await predictRisk();
    });

    // Navigation (désactivée)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
}

// Prédire le risque (interface statique - simulation locale)
async function predictRisk() {
    const resultContainer = document.getElementById('resultContainer');
    const resultContent = document.getElementById('resultContent');
    
    // Récupérer les données du formulaire
    const data = {
        year: parseInt(document.getElementById('year').value),
        insured_period: parseFloat(document.getElementById('insuredPeriod').value),
        residential: parseInt(document.getElementById('residential').value),
        building_painted: parseInt(document.getElementById('buildingPainted').value),
        building_fenced: parseInt(document.getElementById('buildingFenced').value),
        garden: parseInt(document.getElementById('garden').value),
        settlement: parseInt(document.getElementById('settlement').value),
        building_dimension: parseFloat(document.getElementById('buildingDimension').value),
        building_type: parseInt(document.getElementById('buildingType').value),
        num_windows: parseInt(document.getElementById('numWindows').value),
        geo_code: parseInt(document.getElementById('geoCode').value)
    };
    
    // Afficher le chargement
    resultContent.innerHTML = '<div class="spinner"></div><p style="text-align: center;">Analyse en cours...</p>';
    resultContainer.style.display = 'block';

    // Simulation locale simple (pas de connexion API)
    setTimeout(() => {
        // Calcul de risque basique basé sur les données
        const riskScore = calculateRiskScore(data);
        const result = {
            prediction: riskScore > 0.5 ? 1 : 0,
            probability: riskScore
        };
        showResult(result, data);
    }, 1000);
}

// Calculer un score de risque simple
function calculateRiskScore(data) {
    let score = 0.3; // Base
    
    // Facteurs augmentant le risque
    if (data.building_dimension > 200) score += 0.15;
    if (data.num_windows > 10) score += 0.1;
    if (data.building_type === 3) score += 0.1; // Immeuble
    if (data.settlement === 1) score += 0.05; // Urbain
    if (!data.building_fenced) score += 0.1;
    if (!data.building_painted) score += 0.05;
    
    // Facteurs diminuant le risque
    if (data.residential) score -= 0.1;
    if (data.garden) score -= 0.05;
    if (data.insured_period >= 1.0) score -= 0.05;
    
    return Math.max(0.1, Math.min(0.9, score));
}

// Afficher le résultat
function showResult(result, data) {
    const risk = result.prediction;
    const proba = (result.probability * 100).toFixed(1);
    
    const html = risk === 1 
        ? `<div class="result-box result-danger">
             <div>
                 <h3>Risque Élevé</h3>
                 <p>Probabilité de sinistre: <strong>${proba}%</strong></p>
                 <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">Analyse basée sur les caractéristiques du logement</p>
             </div>
           </div>`
        : `<div class="result-box result-success">
             <div>
                 <h3>Risque Faible</h3>
                 <p>Probabilité de sinistre: <strong>${proba}%</strong></p>
                 <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">Analyse basée sur les caractéristiques du logement</p>
             </div>
           </div>`;

    document.getElementById('resultContent').innerHTML = html;
}
