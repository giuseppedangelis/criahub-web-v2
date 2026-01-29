
export const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2')
        .slice(0, 15);
};

export const maskCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const floatValue = Number(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(floatValue);
};

export const parseCurrency = (value: string): number => {
    return Number(value.replace(/\D/g, '')) / 100;
};
