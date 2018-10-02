import 'babel-polyfill'
import 'colors'
import wd from 'wd'
import {assert} from 'chai'

const username = process.env.KOBITON_USERNAME || 'phanthao'
const apiKey = process.env.KOBITON_API_KEY || 'fc67c182-4131-4366-82a6-18494a61b828'

const platformVersion = process.env.KOBITON_DEVICE_PLATFORM_VERSION
const platformName = process.env.KOBITON_DEVICE_PLATFORM_NAME || 'Android'
let deviceName = process.env.KOBITON_DEVICE_NAME

if (deviceName == null) {
  if (platformName == 'Android') {
    deviceName = "Galaxy*"
  } else if (platformName == 'iOS') {
    deviceName = 'iPhone*'
  }
}

const kobitonServerConfig = {
  protocol: 'https',
  host: 'api.kobiton.com',
  auth: `${username}:${apiKey}`
}

const desiredCaps = {
  sessionName:        'Automation test session',
  sessionDescription: 'Demo Automation Test on Android', 
  deviceOrientation:  'portrait',  
  captureScreenshots: true, 
  app:                '<APP_URL>', 
  deviceGroup:        'KOBITON', 
  deviceName:         deviceName,
  platformName:       platformName,
  platformVersion:    platformVersion
}
desiredCaps.app = process.env.APP_URL

let driver

if (!username || !apiKey) {
  console.log('Error: Environment variables KOBITON_USERNAME and KOBITON_API_KEY are required to execute script')
  process.exit(1)
}

describe('Android App sample', () => {

  before(async () => {
    driver = wd.promiseChainRemote(kobitonServerConfig)

    driver.on('status', (info) => {
      console.log(info.cyan)
    })
    driver.on('command', (meth, path, data) => {
      console.log(' > ' + meth.yellow, path.grey, data || '')
    })
    driver.on('http', (meth, path, data) => {
      console.log(' > ' + meth.magenta, path, (data || '').grey)
    })

    try {
      await driver.init(desiredCaps)
    }
    catch (err) {
      if (err.data) {
        console.error(`init driver: ${err.data}`)
      }
    throw err
    }
  })

  it('should show the app label', async () => {
    await driver.elementByClassName("android.widget.TextView")
      .text().then(function(text) {
        assert.equal(text, 'API Demos')
      })
  })

  after(async () => {
    if (driver != null) {
    try {
      await driver.quit()
    }
    catch (err) {
      console.error(`quit driver: ${err}`)
    }
  }
  })
})
