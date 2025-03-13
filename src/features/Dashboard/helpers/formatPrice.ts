
export const formatPrice = (price: number) => {
    if (typeof price !== "number" || isNaN(price)) {
        console.warn("formatPrice recibió un valor no numérico:", price);
        return "N/A";
    }

    const fixedPrice = Number(price.toFixed(2));

    return `RD$${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(fixedPrice)}`;
};