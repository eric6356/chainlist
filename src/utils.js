export const compareAccount = (a, b) => {
    return a && b && a.address.toUpperCase() === b.address.toUpperCase();
};