interface AppConfig {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfig = {
    name: "BootUp",
    github: {
        title: "BootUp",
        url: "https://github.com/Mullayam/boot-up.git",
    },
    author: {
        name: "Mullayam",
        url: "https://github.com/Mullayam",
    }
}