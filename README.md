# snip-cli

Zero-dependency Node CLI for the Snip URL shortener.

## Usage

```bash
SNIP_API=http://localhost:3000 node cli.js add https://example.com
node cli.js ls
node cli.js open ABC123
```

The CLI supports `add`, `ls`, `open`, and `help` commands.
