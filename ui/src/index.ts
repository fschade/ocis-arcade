import App from './App.vue'

const routes = [
    {
        path: '/:driveAliasAndItem(.*)?',
        component: App,
        name: 'oces',
        meta: {
            authContext: 'hybrid',
            title: 'ES',
            patchCleanPath: true
        }
    }
]

const appInfo = {
    name: 'ES',
    id: 'oces',
    icon: 'bear-smile',
    iconFillType: 'fill',
    iconColor: 'rgb(255,255,0)',
    extensions: [
        {
            extension: 'oces',
            routeName: 'oces'
        }
    ]
}

export default {
    appInfo,
    routes
}
