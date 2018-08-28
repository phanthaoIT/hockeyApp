const https = require('https')
const hockeyAppToken = process.env.HOCKEYAPP_TOKEN || '534047b5470d479d8ae907ffe4c6f4d4'
const appId = process.env.APP_ID || '656f530f20ed442fbe9500f28853c435'
const format = process.env.FILE_FORMAT || 'apk'

function getDownloadUrl () {
	return new Promise((resolve, reject) => {
		const options = {
			host: 'rink.hockeyapp.net',
			path: `/api/2/apps/${appId}/app_versions`,
			headers: {
				'X-HockeyAppToken': `${hockeyAppToken}`
			}
		}

		https.get(options, function (res) {
			let body = ''
			res.on('data', function (data) {
				body += data
			})
			res.on('end', function () {
				let result = JSON.parse(body)
				resolve(result.app_versions[0].id)
			})
			res.on('error', function (err) {
				reject(err)
			})
		})
	})
}

function getResignedUrl (appVersion) {
	return new Promise((resolve, reject) => {
		const options = {
			host: 'rink.hockeyapp.net',
			path: `/api/2/apps/${appId}/app_versions/${appVersion}?format=${format}`,
			headers: {
				'X-HockeyAppToken': `${hockeyAppToken}`
			}
		}

		https.get(options, function (res) {
			if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				resolve(res.headers.location)
			} else {
				reject('Cannot get URL')
			}
		}).on('error', (err) => {
			reject(err)
		})
	})
}

async function main() {
	let version = await getDownloadUrl()
	let url = await getResignedUrl(version)
	console.log(url)
}
main()