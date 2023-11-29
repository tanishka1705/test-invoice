export const getRateWithCurrencySymbol = (rate: any, currency: string | number) => {
    const currencySymbols: { [key: string]: string } = {
        USD: '$',
        POUND: '£',
        INR: 'INR',
    };

    return `${rate} ${currencySymbols[currency as string] || ''} / Hour`;
};
