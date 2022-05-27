export const toggleMenu = (): Promise<IAction> => new Promise((resolve) => {
    resolve({type: 'toggle-menu'});
});

export default {
    toggleMenu
};
