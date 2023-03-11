const reqIcons = import.meta.glob('/src/svg/icons/*.svg')

const requireIcons = (req: any): string[] => {
    const imageModule: string[] = []

    Object.keys(req).forEach((key: string) => {
        const modulePath:string = '/src/svg/icons/'
        const newKey = key.replace(modulePath, '').replace(/(\.\/|\.svg)/g, '')
        imageModule.push(newKey)
    })

    return imageModule
}

const iconList: string[] = requireIcons(reqIcons)

export default iconList
