// @ts-check

import { test, expect } from './myFixtures';
import packageInfo from '../package.json';
import { showLoginPage, checkLogInOrNot, userFile, userFolder, userJson, createProjectValidation, createProjects, unstarProject, starProject, userValidation, signOut, showActiveUsers, searchProject, checkProjectName, checkNotification, goToProjectPage, exportProject } from './common';

const fs = require('fs');
const path = require('path');
const { _electron: electron } = require('@playwright/test');

let electronApp;
let appPath;
let window;


test("Start the scribe application", async () => {
  electronApp = await electron.launch({ args: ['main/index.js'] });
  appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script
    return app.getAppPath();
  });
  window = await electronApp.firstWindow();
  expect(await window.title()).toBe('Scribe Scripture');

})

test('Check whether the app is being logged IN', async () => {
  await checkLogInOrNot(window, expect)
});

test('If logged IN then logout and delete that user from the backend', async ({ userName }) => {
  //user json
  const json = await userJson(window, packageInfo, fs, path)
  // user file
  const file = await userFile(window, packageInfo, path)
  // user folde name
  const folder = await userFolder(window, userName, packageInfo, path)

  if (await checkLogInOrNot(window, expect)) {
    expect(await window.locator('//*[@id="user-profile"]')).toBeVisible()
    await window.locator('//*[@id="user-profile"]').click()
    const currentUser = await window.textContent('[aria-label="userName"]')
    expect(await window.locator('//*[@aria-label="signout"]')).toBeVisible()
    await window.locator('//*[@aria-label="signout"]').click()
    // projects page then logout and delete playwright user
    if (currentUser.toLowerCase() === userName.toLowerCase() && await fs.existsSync(folder)) {
      await showLoginPage(fs, folder, userName, json, file, window, expect)
    }
  } else {
    // loging page, if playwright user exist then reload app and remove 
    const existUser = json.some((item) => item.username.toLowerCase() === userName.toLowerCase())
    if (existUser && await fs.existsSync(folder)) {
      await showLoginPage(fs, folder, userName, json, file, window, expect)
    }
  }

});


test('Create a new user and login', async ({ userName }) => {
  await userValidation(window, expect)
  await window.locator('//input[@placeholder="Username"]').fill(userName)
  await expect(window.locator('//button[@type="submit"]')).toBeVisible()
  await window.click('[type=submit]');
  const title = await window.textContent('[aria-label=projects]');
  expect(title).toBe('Projects');
})


/*CREATE PROJECTS FOR ALL FLAVOR TYPE */
/* Translation Project    */
test('Click New and Fill project page details to create a new project for text translation with custom book', async ({ textProject }) => {
  await expect(window.locator('//a[@aria-label="new"]')).toBeVisible()
  await window.locator('//a[@aria-label="new"]').click()
  await createProjectValidation(window, expect)
  await expect(window.locator('//input[@id="project_name"]')).toBeVisible()
  await window.locator('//input[@id="project_name"]').fill(textProject)
  await expect(window.locator('//textarea[@id="project_description"]')).toBeVisible()
  await window.locator('//textarea[@id="project_description"]').fill('test description')
  await expect(window.locator('//input[@id="version_abbreviated"]')).toBeVisible()
  await window.locator('//input[@id="version_abbreviated"]').fill('ttp')
  await expect(window.locator('//button[@id="open-advancesettings"]')).toBeVisible()
  await window.locator('//button[@id="open-advancesettings"]').click()
  await expect(window.locator('//div[@aria-label="custom-book"]')).toBeVisible()
  await window.locator('//div[@aria-label="custom-book"]').click()
  await window.locator('//*[@aria-label="nt-Matthew"]').click()
  await window.locator('//*[@id="save-canon"]').click()
  await window.locator('//button[@aria-label="create"]').click()
  const notifyMe = await window.textContent('//*[@id="__next"]/div/div[2]/div[2]/div/div')
  expect(await notifyMe).toBe('New project created')
  const projectName = await window.innerText(`//div[@id="${textProject}"]`)
  expect(projectName).toBe(textProject);
  const title = await window.textContent('[aria-label=projects]');
  expect(title).toBe('Projects');
})

/* Obs translation project */
test('Click New and Fill project page details to create a new project for obs', async ({ obsProject }) => {
  await createProjects(window, expect, obsProject, "OBS", "test description", "otp")
})

/* Audio project */
test('Click Click New and Fill project page details to create a new project for audio', async ({ audioProject }) => {
  await createProjects(window, expect, audioProject, "Audio", "test description", "atp")
})

/* STAR & UNSTAR PROJECT */
// text translation
test("Star the text project", async ({ textProject }) => {
  await starProject(window, expect, textProject)
})

test("Unstar the text project", async ({ textProject }) => {
  await unstarProject(window, expect, textProject)
})

// obs
test("Star the obs project", async ({ obsProject }) => {
  await starProject(window, expect, obsProject)
})

test("Unstar the obs project", async ({ obsProject }) => {
  await unstarProject(window, expect, obsProject)
})

// audio
test("Star the audio project", async ({ audioProject }) => {
  await starProject(window, expect, audioProject)
})

test("Unstar the audio project", async ({ audioProject }) => {
  await unstarProject(window, expect, audioProject)
})

// text transaltion project
test('Search a text project in all projects list', async ({ textProject }) => {
  await searchProject(window, expect, textProject, 'translation')
});

test('Click and Check the text Translation project name in the editor', async ({ textProject }) => {
  await checkProjectName(window, expect, textProject)
});

test('Check text Translation project Notifications', async () => {
  await checkNotification(window, expect)
});

test('Return to the project page', async () => {
  await goToProjectPage(window, expect)
});

// obs project
test('Search an obs project in all projects list', async ({ obsProject }) => {
  await searchProject(window, expect, obsProject, 'obs')
});

test('Click and Check the obs project name in the editor', async ({ obsProject }) => {
  await checkProjectName(window, expect, obsProject)
});

test('Check obs project Notifications', async () => {
  await checkNotification(window, expect)
});

test('Add content in verses 1 and 2 in the obs story 1 editor.', async () => {
  const editorpane = await window.innerText('[aria-label=editor-pane]', { timeout: 120000 });
  expect(editorpane).toBe('EDITOR');
  await window.locator('div:nth-child(2) > .flex-grow').fill("god created heavens and earth");
  await window.locator('div:nth-child(3) > .flex-grow').fill("story content added in verse 3");
  const verse2 = await window.textContent('div:nth-child(2) > .flex-grow')
  expect(verse2).toBe('god created heavens and earth');
  const verse3 = await window.textContent('div:nth-child(3) > .flex-grow')
  expect(verse3).toBe('story content added in verse 3');
});

test('Increase the font size of the obs editor', async () => {
  await window.click('[aria-label=increase-font]');
  await window.click('[aria-label=increase-font]');
  const editorpane = await window.innerText('[aria-label=editor-pane]', { timeout: 120000 });
  expect(editorpane).toBe('EDITOR');
  const div = await window.locator('//*[@aria-label="editor"]')
  const fontSize = await div.evaluate((ele) => {
    return window.getComputedStyle(ele).getPropertyValue('font-size')

  })
  expect(await fontSize).toBe('22.4px');
});

test('Decrease the font size of the obs editor', async () => {
  const editorpane = await window.innerText('[aria-label=editor-pane]', { timeout: 120000 });
  expect(editorpane).toBe('EDITOR');
  await window.click('[aria-label=decrease-font]');
  await window.click('[aria-label=decrease-font]');
  const div = await window.locator('//*[@aria-label="editor"]')
  const fontSize = await div.evaluate((ele) => {
    return window.getComputedStyle(ele).getPropertyValue('font-size')
  })
  expect(await fontSize).toBe('16px');
});

test('Change the obs navigation story  from 1 to 12 and edit the title', async () => {
  const editorpane = await window.innerText('[aria-label=editor-pane]', { timeout: 120000 });
  expect(editorpane).toBe('EDITOR');
  await expect(window.locator('//*[@aria-label="obs-navigation"]')).toBeVisible()
  await window.locator('//*[@aria-label="obs-navigation"]').click()
  await window.locator('//*[@aria-label="12"]').click();
  await expect(window.locator('//*[@name="12. The Exodus"]')).toBeVisible()
  await window.locator('//*[@name="12. The Exodus"]').fill('12. The Exodus Edit title')
  const title = await window.textContent('//*[@name="12. The Exodus Edit title"]')
  expect(title).toBe('12. The Exodus Edit title');
});

test('Return to the projects page from obs editor', async () => {
  await goToProjectPage(window, expect)
});

// audio project
test('Search an audio project in all projects list', async ({ audioProject }) => {
  await searchProject(window, expect, audioProject, 'audio')
});

test('Click and Check the audio project name in the editor', async ({ audioProject }) => {
  await checkProjectName(window, expect, audioProject)
});

test('Check audio project Notifications', async () => {
  await checkNotification(window, expect)
});

test('Return to the projects page from audio editor', async () => {
  await goToProjectPage(window, expect)
});


test("About scribe Application and License", async () => {
  await window.locator('//*[@aria-label="about-button"]').click()
  const developedby = await window.innerText('[aria-label=developed-by]');
  expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
  await window.click('[aria-label=license-button]');
  await window.locator('//*[@aria-label="about-description"]').click()
  await window.click('[aria-label=close-about]');
  const title = await window.textContent('[aria-label=projects]', { timeout: 10000 });
  expect(title).toBe('Projects');
})

test("Sign out the Application", async () => {
  await signOut(window, expect)
})

test("Click the view users button, log in with playwright user, and sign out", async ({ userName }) => {
  await showActiveUsers(window, expect)
  const tabContent = await window.locator('//*[@id="active-tab-content"]')
  const div = await tabContent.locator("div > div")
  for (let i = 0; i < await div.count(); i++) {
    if (await div.nth(i).textContent() === userName.toLowerCase()) {
      await div.nth(i).click()
      await window.waitForTimeout(2000)
      const title = await window.textContent('[aria-label=projects]')
      await expect(title).toBe('Projects')
      await signOut(window, expect)
    }
  }
})

test("Delete the user from the active tab and check in the archived tab", async ({ userName }) => {
  await showActiveUsers(window, expect)
  const tabContent = await window.locator('//*[@id="active-tab-content"]')
  const items = await tabContent.locator('div > div')
  const div = await tabContent.locator("div > button")
  for (let i = 0; i < await items.count(); i++) {
    if (await items.nth(i).textContent() === userName.toLowerCase()) {
      await div.nth(i).click()
      expect(await window.locator('//*[@id="archived-tab"]')).toBeVisible()
      await window.locator('//*[@id="archived-tab"]').click()
      const text = await window.locator('//*[@id="archived-tab"]').textContent()
      expect(await text).toBe('Archived')
      await window.getByLabel('Archived').locator('button').click()
      expect(await window.locator('//*[@id="active-tab"]')).toBeVisible()
      await window.locator('//*[@id="active-tab"]').click()
      await window.getByRole('button', { name: userName.toLowerCase() }).click()
    }
  }
  const title = await window.textContent('[aria-label=projects]')
  await expect(title).toBe('Projects')
})

test("Logout and delete that playwright user from the backend", async ({ userName }) => {
  // user json
  const json = await userJson(window, packageInfo, fs, path)
  // user file
  const file = await userFile(window, packageInfo, path)
  // user folde name
  const folder = await userFolder(window, userName, packageInfo, path)
  expect(await window.locator('//*[@id="user-profile"]')).toBeVisible()
  await window.locator('//*[@id="user-profile"]').click()
  const currentUser = await window.textContent('[aria-label="userName"]')
  expect(await window.locator('//*[@aria-label="signout"]')).toBeVisible()
  await window.locator('//*[@aria-label="signout"]').click()
  // projects page then logout and delete playwright user
  if (currentUser.toLowerCase() === userName.toLowerCase() && await fs.existsSync(folder)) {
    await showLoginPage(fs, folder, userName, json, file, window, expect)
  }
})
