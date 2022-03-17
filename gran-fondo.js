const fs = require("fs");
const cron = require("node-cron");
const express = require("express");
const numeral = require("numeral");
const locales = require("numeral/locales");
const puppeteer = require("puppeteer");
const axios = require("axios");

const GRAN_FONDO_URL =
  "https://sapi.fundky.com/campaigns/le-gran-fondo-d-operation-enfant-soleil/9?showChildrenCount=true&showDescription=true&showMedia=true&showSettings=true";

numeral.locale('fr-ca');

async function getAmount() {
  const res = await axios.get(GRAN_FONDO_URL);
  console.log(res.data.collected);

  if (!res) {
    console.log("No response");
    return;
  }

  const format = numeral(parseFloat(res.data.collected)).format("0,0.00 $");

  fs.writeFile("donation-granfondo.txt", format, (err) => {
    if (err) {
      console.log("Error", err);
    }

    console.log(`File updated to ${format}`);
  });
}

getAmount();

app = express();
cron.schedule("* * * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job");
  getAmount();
});

app.listen("3128");
