const https = require('https')
const hockeyAppToken = process.env.HOCKEYAPP_TOKEN 
const appId = process.env.APP_ID 
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