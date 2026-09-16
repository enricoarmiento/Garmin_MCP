"""Interactive authentication is separate from the MCP stdio stream."""

import argparse
from getpass import getpass
import logging
import sys

from garminconnect import Garmin

from garmin_mcp.service import token_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Garmin Connect MCP — sola lettura")
    parser.add_argument("command", choices=["serve", "login", "connect"], nargs="?", default="serve")
    parser.add_argument("client", choices=["claude", "codex"], nargs="?")
    args = parser.parse_args()
    # Suppress upstream log messages that may contain private request details.
    logging.getLogger("garminconnect").setLevel(logging.CRITICAL)
    if args.command == "connect":
        if not args.client:
            parser.error("Specifica il client: garmin-mcp connect claude oppure codex")
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
        password = getpass("Password Garmin: ")
        api = Garmin(email=email, password=password, prompt_mfa=lambda: getpass("Codice MFA: ").strip())
        password = None
        path = token_path()
        # Garmin validates symlinks and enforces owner-only token permissions.
        api.login(str(path))
        api.client.dump(str(path))  # Fail visibly if persistence fails.
        print(f"Login completato. Token salvati in {path}. Ora avvia garmin-mcp serve.")
    except KeyboardInterrupt:
        parser.exit(130, "\nLogin annullato.\n")
    except Exception:
        parser.exit(1, "Login fallito. Verifica credenziali, MFA, connessione e permessi della cartella token.\n")


if __name__ == "__main__":
    main()
