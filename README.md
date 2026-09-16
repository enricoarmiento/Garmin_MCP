# Garmin MCP

Server MCP locale per leggere i dati del proprio account Garmin Connect e renderli disponibili a un assistente per analisi. Python 3.12+, trasporto **stdio**, cinque strumenti, nessuna operazione di modifica su Garmin.

Usa [python-garminconnect](https://github.com/cyberjunky/python-garminconnect), client **non ufficiale**, e il [Python SDK MCP](https://github.com/modelcontextprotocol/python-sdk). Non si collega direttamente all'orologio: sincronizza prima il dispositivo con Garmin Connect. Cambiamenti Garmin, blocchi del login o limitazioni dell'account possono impedire l'accesso.

## Avvio

Dal terminale, nella cartella del progetto:

```sh
uv sync --locked
uv run garmin-mcp login
```

Il login chiede email, password e, quando richiesto, codice MFA. Password e MFA non vengono mostrati né salvati nel progetto. Non inserirli nella chat o nella configurazione MCP. I token di accesso e rinnovo sono salvati dalla libreria in `~/.garmin-mcp`, con cartella privata (`0700`) e file privato (`0600`). Il server riutilizza i token senza chiedere input. Un token revocato o scaduto richiede un nuovo login.

Per cambiare la cartella token, imposta `GARMIN_TOKEN_DIR` **sia nel terminale di login sia nell'ambiente del client MCP**. La libreria rinnova automaticamente la sessione quando possibile. I token consentono accesso all'account: trattali come una password.

## Collegamento a un client MCP

Importa o adatta [examples/mcp.json](examples/mcp.json) nelle impostazioni MCP del tuo client. Il file contiene il percorso assoluto di questa installazione; su un altro computer sostituiscilo con il percorso locale di `.venv/bin/garmin-mcp`.

Configurazione generica:

```json
{
  "mcpServers": {
    "garmin": {
      "command": "/percorso/assoluto/Garmin_MCP/.venv/bin/garmin-mcp",
      "args": ["serve"]
    }
  }
}
```

Riavvia o riconnetti il client. `garmin_status` controlla solo la presenza locale dei token; una lettura conferma che la sessione funziona. Per avviare manualmente: `uv run garmin-mcp serve`. Il processo attende messaggi MCP su stdin: non è una pagina web né una CLI interattiva.

## Strumenti

| Strumento | Parametri | Risultato |
|---|---|---|
| `garmin_status` | Nessuno | Presenza token, senza richiesta di rete |
| `garmin_daily` | `day`, `metric` | JSON Garmin per `summary`, `sleep`, `heart_rate`, `stress`, `body_battery`, `hrv` |
| `garmin_activities` | `start=0`, `limit=20` | Attività recenti, paginazione, massimo 100 per chiamata |
| `garmin_activity` | `activity_id`, `include_splits=false` | Dettagli e giri facoltativi |
| `garmin_trends` | `start_date`, `end_date` | Serie giornaliera e statistiche, da 1 a 31 giorni inclusi |

Date `YYYY-MM-DD`, riferite al calendario Garmin. Per il sonno usa la data del risveglio. La validazione delle date future usa la data locale del computer: configura correttamente il fuso orario. I dati grezzi mantengono campi e unità Garmin, normalmente metri, secondi e bpm. `garmin_trends` esplicita le unità e converte la distanza in km; calcola medie sui soli giorni disponibili, senza sostituire dati mancanti con zero. Zero passi resta un valore valido; frequenza a riposo zero e punteggi negativi sono trattati come assenti. La giornata corrente può essere incompleta.

Esempi di richieste all'assistente:

- «Mostra passi e sonno del 15 settembre 2026.»
- «Analizza andamento di passi, stress e frequenza a riposo dal 1 al 15 settembre 2026.»
- «Mostra le ultime dieci corse tra le attività recenti e confronta distanza e durata.»
- «Leggi i giri dell'attività con ID 123456789.»

Il server restituisce JSON al client MCP, che può analizzarlo o salvarlo. Non produce diagnosi né esporta automaticamente file. I dati restituiti, inclusa l'eventuale posizione GPS delle attività, diventano disponibili al client e al modello configurato.

## Affidabilità e limiti

- Cache in memoria di 60 secondi, fino a 128 risposte; richieste serializzate per evitare rinnovi concorrenti nello stesso processo.
- Solo metodi Garmin esplicitamente autorizzati in lettura. Nessun upload, cancellazione o modifica esposto.
- Il riepilogo di un periodo richiede una lettura per giorno; in caso di errore interrompe l'operazione, senza presentare risultati parziali come completi.
- Rate limit: attendi prima di riprovare. Errori di autenticazione: esegui di nuovo il login nel terminale. Non vengono restituiti messaggi grezzi della libreria che potrebbero contenere dati privati.
- Sonno, HRV e altre metriche dipendono da dispositivo, sincronizzazione e disponibilità Garmin; risposte vuote sono possibili.
- Nessuna porta di rete aperta. I token rimangono locali; le richieste di autenticazione e dati vanno ai servizi Garmin.

## Sviluppo e verifica

```sh
uv sync --locked
uv run pytest -q
```

I test coprono statistiche, limiti, cache, errori e un vero scambio MCP via stdio, con autenticazione mancante. Le risposte Garmin nei test unitari sono simulate: per verificare l'accesso reale servono login personale e una prima lettura dal client MCP.
