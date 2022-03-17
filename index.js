const fs = require("fs");
const cron = require("node-cron");
const express = require("express");
const numeral = require("numeral");
const puppeteer = require("puppeteer");
const axios = require("axios");

const EXTRALIFE_URL =
  "https://www.extra-life.org/index.cfm?fuseaction=donorDrive.team&teamID=56920";

const DONATIONS_URL = "https://extra-life.org/api/1.3/teams/56920/donations?limit=10&offset=0&_=1622375682241";

async function getAmount() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(EXTRALIFE_URL);

  const [donation] = await page.evaluate(() => {
    const allTitles = document.querySelectorAll(
      "#thermo-wrap .dd-thermo-raised",
      {
        waitUntil: "networkidle2"
      }
    );

    return Array.from(allTitles).map(title => {
      let res = {
        amount: title.textContent.match(/\d+/g).join("")
      };

      return res;
    });
  });

  const format = numeral(donation.amount).format("0,0 $") + ' USD';
  fs.writeFile("donation-oes.txt", format, err => {
    if (err) {
      console.log("Error", err);
    }

    console.log(`File updated to ${format}`);
  });

  await browser.close();
}

async function fetchDonations() {
  const res = await axios.get(DONATIONS_URL);
  const donations = [];

  for(don of res.data) {
    const amount = numeral(don.amount).format("0,0 $") + ' USD';
    donations.push(`${don.displayName} ${amount} (via ${don.recipientName})`);
  };

  return donations;
}

async function updateDonationFile() {
  const donations = await fetchDonations();

  fs.writeFile("donation-text-oes.txt", donations.join('           '), err => {
    if (err) {
      console.log("Error", err);
    }

    console.log(`File updated to ${donations}`);
  });

}



getAmount();
updateDonationFile();

app = express();
cron.schedule("* * * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job");
  getAmount();
  updateDonationFile();
});

app.listen("3128");
