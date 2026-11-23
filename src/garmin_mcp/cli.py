"""Interactive authentication is separate from the MCP stdio stream."""

import argparse
from getpass import getpass
import json
import logging
import sys

from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)

from garmin_mcp.service import token_path


READ_COMMANDS = {"status", "daily", "activities", "activity", "trends"}


def main() -> None:
    parser = argparse.ArgumentParser(description="Garmin Connect MCP — sola lettura")
    sub = parser.add_subparsers(dest="command")
    sub.add_parser("serve", help="Avvia il server MCP su stdio")
    sub.add_parser("login", help="Login interattivo e salvataggio token")
    p = sub.add_parser("connect", help="Registra il server in un client MCP")
    p.add_argument("client", choices=["claude", "codex", "antigravity", "deepseek", "dsh"], nargs="?")
    # Read commands mirror the MCP tools and print JSON on stdout (used by the agent skill).
    sub.add_parser("status", help="Presenza token locale")
    p = sub.add_parser("daily", help="Metrica giornaliera")
    p.add_argument("day")
    p.add_argument("metric", nargs="?", default="summary",
                   choices=["summary", "sleep", "heart_rate", "stress", "body_battery", "hrv"])
    p = sub.add_parser("activities", help="Attività recenti")
    p.add_argument("--start", type=int, default=0)
    p.add_argument("--limit", type=int, default=20)
    p = sub.add_parser("activity", help="Dettaglio attività")
    p.add_argument("activity_id")
    p.add_argument("--splits", action="store_true")
    p = sub.add_parser("trends", help="Andamento 1–31 giorni")
    p.add_argument("start_date")
    p.add_argument("end_date")
    args = parser.parse_args()
    args.command = args.command or "serve"
    # Suppress upstream log messages that may contain private request details.
    logging.getLogger("garminconnect").setLevel(logging.CRITICAL)
    if args.command in READ_COMMANDS:
        from garmin_mcp import server
        from garmin_mcp.service import GarminError
        calls = {
            "status": lambda: server.garmin_status(),
            "daily": lambda: server.garmin_daily(args.day, args.metric),
            "activities": lambda: server.garmin_activities(args.start, args.limit),
            "activity": lambda: server.garmin_activity(args.activity_id, args.splits),
            "trends": lambda: server.garmin_trends(args.start_date, args.end_date),
        }
        try:
            result = calls[args.command]()
        except (GarminError, ValueError) as exc:
            parser.exit(1, f"Errore: {exc}\n")
        # Compact JSON: raw Garmin payloads (sleep, heart rate) are large.
        json.dump(result, sys.stdout, ensure_ascii=False, separators=(",", ":"), default=str)
        print()
        return
    if args.command == "connect":
        if not args.client:
            parser.error("Specifica il client: garmin-mcp connect [claude|codex|antigravity|deepseek]")
        from garmin_mcp.connect import register
        try:
            path = register(args.client)
        except Exception:
            parser.exit(1, "Configurazione fallita. Verifica formato e permessi del file del client; eventuali impostazioni precedenti non vengono sovrascritte se non valide.\n")
        print(f"Garmin configurato in {path}. Chiudi e riapri {args.client.title()}.\nChiedi: Usa Garmin per leggere i miei passi di oggi.")
        return
    if args.command == "serve":
        from garmin_mcp.server import run
        run()
        return
    if not sys.stdin.isatty():
        parser.exit(1, "Il login richiede un terminale interattivo.\n")
    try:
        email = input("Email Garmin: ").strip()
        if "@" not in email:
            parser.exit(1, "Email non valida. Riprova.\n")
        password = getpass("Password Garmin (non viene mostrata mentre scrivi): ")
        if not password:
            parser.exit(1, "Password vuota. Riprova.\n")
        api = Garmin(email=email, password=password, prompt_mfa=lambda: getpass("Codice MFA: ").strip())
        password = None
        path = token_path()
        # Garmin validates symlinks and enforces owner-only token permissions.
        api.login(str(path))
        api.client.dump(str(path))  # Fail visibly if persistence fails.
        print(f"Login completato. Token salvati in {path}.\nTorna all'assistente e chiedi, ad esempio: quanti passi ho fatto ieri?")
    except (KeyboardInterrupt, EOFError):
        parser.exit(130, "\nLogin annullato.\n")
    except GarminConnectTooManyRequestsError:
        parser.exit(1, "Troppi tentativi: Garmin ha bloccato temporaneamente il login. Attendi almeno 15-30 minuti, poi riprova.\n")
    except GarminConnectAuthenticationError:
        parser.exit(1, "Email, password o codice MFA errati, oppure account bloccato. Verifica accedendo a connect.garmin.com dal browser, poi riprova.\n")
    except GarminConnectConnectionError:
        parser.exit(1, "Garmin non raggiungibile. Controlla la connessione internet e riprova.\n")
    except Exception:
        parser.exit(1, "Login fallito. Verifica credenziali, MFA, connessione e permessi della cartella token.\n")


if __name__ == "__main__":
    main()
