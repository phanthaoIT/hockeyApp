import https from 'https'

const hockeyAppToken = process.env.HOCKEYAPP_TOKEN
const appId = process.env.APP_ID
// const appVersion = process.env.APP_VERSION

export function getDownloadUrl() {
    return new Promise((resolve, reject) => {
        const options = {
            host: 'rink.hockeyapp.net',
            path: `/api/2/apps/${appId}/app_versions`,
            headers: {
                'X-HockeyAppToken': `${hockeyAppToken}`
            }
        }
            
        https.get(options, function (res) {
            let body = ""
            res.on('data', function (data) {
                body += data
            })
            res.on('end', function () {
                let result = JSON.parse(body)
                resolve(result.app_versions[0].id)
            })
            res.on('error', function (err) {
                console.log('Error: ' + err.message)
                reject(err)
                return
            })
        })
    })
}

export function getResignedUrl(appVersion) {
    console.log(appId, hockeyAppToken, appVersion)
    return new Promise((resolve, reject) => {
        const options = {
            host: 'rink.hockeyapp.net',
            path: `/api/2/apps/${appId}/app_versions/${appVersion}?format=apk`,
            headers: {
                'X-HockeyAppToken': `${hockeyAppToken}`
            }
        }
            
        https.get(options, function (res) {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                resolve(res.headers.location)
            } else {
                reject('Cannot get url')
                return
            }
        }).on('error',(err) => {
            reject(err)
            return
        })
    })
}

//For testing only
main()

async function main() {
    try {
        const a = await getVersion()
        console.log(a)
        console.log(await getResignedUrl(a)
    } catch(err) {
        console.log('Error:', err)
    }
}
//For testing only

// request({
//     url: `https://rink.hockeyapp.net/api/2/apps/${appId}/app_versions/${appVersion}`,
//     headers: {
//         'X-HockeyAppToken': hockeyAppToken,
//         'Accept': 'application/json'
//     },
//     method: 'GET'
// }, (err,res) => {
//     if (err) {
//         reject()
//         return
//     }
//     console.log(res.statusCode)
//     if (res.statusCode === 200 && res.request.uri.href) {
//         resolve(res.request.uri.href)
//     }
// })
