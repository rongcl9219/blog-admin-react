interface Ia {
    type: string
}

export const toggleMenu = (): Promise<Ia> => new Promise((resolve) => {
    resolve({type: 'toggle-menu'});
});

export default {
    toggleMenu
};
