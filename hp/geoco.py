import urllib.request
import json
import urllib.parse
import time

addresses = [
    "Chemin Monastier 10, 1260 Nyon, Suisse",
    "Route du Muids 3, 1272 Genolier, Suisse",
    "Avenue Vinet 30, 1004 Lausanne, Suisse",
    "Avenue Ruchonnet 53, 1003 Lausanne, Suisse",
    "Route de la Petite-Corniche 1, 1096 Bourg-en-Lavaux, Suisse",
    "Chemin du Pont-Bochet 3, 1226 Thônex, Suisse",
    "Chemin de la Savonnière 11, 1245 Collonge-Bellerive, Suisse",
    "Route de Loëx 151, 1233 Bernex, Suisse",
    "Avenue Trembley 43, 1209 Genève, Suisse",
    "Avenue Cardinal-Mermillod 1, 1227 Carouge, Suisse",
    "Route de Bertigny 34, 1700 Fribourg, Suisse",
    "Faubourg de l'Hôpital 81, 2000 Neuchâtel, Suisse",
    "Rue de l'Industrie 29, 1950 Sion, Suisse"
]

res = {}
for addr in addresses:
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(addr)}&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (local dev agent)"})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode())
        if data:
            res[addr] = [float(data[0]["lat"]), float(data[0]["lon"])]
        else:
            print("Failed:", addr)
    except Exception as e:
        print("Error:", addr, e)
    time.sleep(1)

print(json.dumps(res, indent=2))
