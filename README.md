# oes-parser

## Install

1. Install dependencies

```
npm install
```

### Fetch donations for OES

```
npm run oes
```
This will run a cronjob to update `donation-oes.txt` for the amount and `donation-test-oes.text` for each individual donations with names

### Fetch donations for Gran Fondo
```
npm run granfondo
```
This will run a cronjob to update `donation-granfondo.txt` for the amount

