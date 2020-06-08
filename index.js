const puppeteer = require('puppeteer');

const env = {
  email: '',
  senha: '',
  url: 'https://github.com/login'
};

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(env.url);
  await whiteLoginInput(page);
  await pressKeyboardTab(page);
  await whitePasswordInput(page);
  await submitLogin(page);
  await awaitPageLoader(page);
  const list = await loadInfoPage(page);
  console.log(list)
  await browser.close();
})();

async function loadInfoPage(page) {
  return await page.evaluate(() => {
    const divs = [...document.querySelectorAll('.source')];
    const newList = divs.map((data) => {
      return data.innerText.replace(/\n/g, "").trim();
    });
    return { newList };
  });
}

async function awaitPageLoader(page) {
  await page.waitForSelector("#dashboard");
  await screenShot(page, '3dashboard');
}

async function submitLogin(page) {
  await page.click("[type='submit']");
}

async function pressKeyboardTab(page) {
  await page.keyboard.down("Tab");
}

async function whitePasswordInput(page) {
  await page.keyboard.type(env.senha);
  await screenShot(page, '2password');
}

function screenShot(page, img) {
  return page.screenshot({ path: `img/${img}.jpg` });
}

async function whiteLoginInput(page) {
  await screenShot(page, '0page');
  await page.waitForSelector("[name='login']");
  await page.type("[name='login']", env.email);
  await screenShot(page, '1login');
}