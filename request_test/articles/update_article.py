#!/usr/bin/env python3

import uuid
import requests
from datetime import datetime, UTC

def test_update_article():
    article_id = "0f25dee9"
    content = """
    Ce mercredi soir (21 heures), le Real Madrid reçoit Manchester City à l'Estadio Santiago Bernabéu, 
    en huitième de finale aller de Ligue des Champions. 
    Pour ce choc entre récents vainqueurs de la compétition, Alvaro Arbeloa a convoqué un groupe de 23 joueurs, 
    dont ne font pas partie sept joueurs madrilènes. En effet, Eder Militão, David Alaba, Alvaro Carreras, Dani Ceballos, Jude Bellingham, Rodrygo et Kylian Mbappé sont blessés et indisponibles. 
    Trois retours sont cependant à signaler dans les rangs des Merengue. Ceux de Dean Huijsen, Eduardo Camavinga et Franco Mastantuono.
    LE GROUPE DU REAL MADRID
    Courtois, Lunin, Fran González - Carvajal, Alexander-Arnold, Asencio, Fran Garcia, Rüdiger, F. Mendy, Huijsen, Aguado - Camavinga, Valverde, Tchouaméni, Arda Güler, Cestero, Manuel Angel, Palacios, Thiago Pitarch - Vinicius Jr, Gonzalo Garcia, Brahim Diaz, Mastantuono.
    """
    url = f"http://localhost:8000/articles_management/update?article_id={article_id}"
    payload = {
        "article_sys_id":str(uuid.uuid4()).split("-")[0],
        "title":"Real MadridMultitude d'absences, mais trois retours dans le groupe madrilène pour affronter Manchester City",
        "subtitle":"Le groupe du Real Madrid pour la réception de Manchester City, ce mercredi soir (8ème de finale aller LDC).",
        "headline":"Clash ligue de champion Real Madrid vs Man City",
        "content":content,
        "author_name": "Hugo Voisot",
        "article_source":"https://madeinreal.ouest-france.fr/infos/article-real-madrid-multitude-d-absences-mais-trois-retours-dans-le-groupe-madrilene-pour-affronter-manchester-city-515646.html",
        "updated_at":datetime.now(UTC).isoformat()
    }
    response = requests.put(url=url, json=payload)
    response.raise_for_status()
    data = response.json()
    print(f"Response: {data}")

if __name__ == "__main__":
    test_update_article()
