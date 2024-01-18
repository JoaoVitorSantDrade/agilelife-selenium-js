import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import 'dotenv/config';
import assert from 'assert';


async function criarSala() { 
    let driver = new Builder().forBrowser(Browser.CHROME).build();
    try {
        let link = ""

        let tabs = []

        
        await driver.get(process.env.URL);
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Criar Sala")]'), 10000)).click();
        await driver.wait(until.elementLocated(By.id('input-nick'))).sendKeys("Host");
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Criar Sala e Entrar")]'), 10000)).click();
        let input_com_link = await driver.wait(until.elementLocated(By.id('input-link')), 10000)
        link = await input_com_link.getAttribute('value')
        tabs.push(await driver.getWindowHandle())
        let participantes_nome = ['Host']
        for (let i = 1; i < process.env.PARTICIPANTES_POR_SALA; i++) {
            participantes_nome.push("P-" + i)
            await driver.switchTo().newWindow('tab');
            await driver.get(link);
            tabs.push(await driver.getWindowHandle())
            await novoParticipante(participantes_nome[i], driver)
        }
        await driver.switchTo().window(tabs[0])
        for (let i = 0; i < process.env.PARTICIPANTES_POR_SALA; i++) {
            let selector = await driver.wait(until.elementLocated(By.id('select_' + i)), 10000)
            await selector.click()
            let options = await selector.findElements(By.tagName('option'))
            await options[i + 1].click()
        }

        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Iniciar partida")]'), 10000)).click();
        for (let i = 0; i < process.env.PARTICIPANTES_POR_SALA; i++) {
            await driver.switchTo().window(tabs[i])
            assert(await driver.wait(until.elementLocated(By.className('Tabuleiro')), 10000).isDisplayed(), "Tabuleiro está sendo exibido")
        }
    }
    catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
    }
}

async function novoParticipante(nome, driver) {
    await driver.wait(until.elementLocated(By.id('input-nick'))).sendKeys(nome);
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Entrar na Sala")]'), 10000)).click();
    return
}

async function verificarSeNoTabuleiro(driver, lista_de_participantes) {
    
    
}

async function main() {
    
        criarSala()
}


main()